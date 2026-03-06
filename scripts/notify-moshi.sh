#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

WEBHOOK_URL="${MOSHI_WEBHOOK_URL:-https://api.getmoshi.app/api/webhook}"
WEBHOOK_TOKEN="${MOSHI_WEBHOOK_TOKEN:-}"
TITLE="${MOSHI_TITLE:-Done}"
MESSAGE=""
DRY_RUN="false"
ALLOW_NON_KOREAN="false"
STRICT_MODE="false"
MAX_RETRIES="${MOSHI_MAX_RETRIES:-4}"
RETRY_DELAY_SECONDS="${MOSHI_RETRY_DELAY_SECONDS:-2}"
PENDING_FILE="${MOSHI_PENDING_FILE:-$ROOT_DIR/.codex/.pending-moshi-notifications.jsonl}"

usage() {
  cat <<USAGE
Usage: notify-moshi.sh [options]

Options:
  --title <text>         Notification title (default: $TITLE)
  --message <text>       Task completion message (required)
  --token <text>         Webhook token (or use MOSHI_WEBHOOK_TOKEN)
  --url <text>           Webhook URL (default: $WEBHOOK_URL)
  --max-retries <n>      Retry attempts per payload (default: $MAX_RETRIES)
  --retry-delay <sec>    Delay between retries (default: $RETRY_DELAY_SECONDS)
  --pending-file <path>  Queue file for unsent payloads (default: $PENDING_FILE)
  --allow-non-korean     Skip Korean-dominant message normalization
  --strict               Exit non-zero when notification cannot be sent
  --dry-run              Print payload only
  -h, --help             Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      TITLE="${2:-}"
      shift 2
      ;;
    --message)
      MESSAGE="${2:-}"
      shift 2
      ;;
    --token)
      WEBHOOK_TOKEN="${2:-}"
      shift 2
      ;;
    --url)
      WEBHOOK_URL="${2:-}"
      shift 2
      ;;
    --max-retries)
      MAX_RETRIES="${2:-}"
      shift 2
      ;;
    --retry-delay)
      RETRY_DELAY_SECONDS="${2:-}"
      shift 2
      ;;
    --pending-file)
      PENDING_FILE="${2:-}"
      shift 2
      ;;
    --allow-non-korean)
      ALLOW_NON_KOREAN="true"
      shift
      ;;
    --strict)
      STRICT_MODE="true"
      shift
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$MESSAGE" ]]; then
  echo "--message is required"
  exit 1
fi

if [[ ! "$MAX_RETRIES" =~ ^[0-9]+$ ]] || [[ "$MAX_RETRIES" -lt 1 ]]; then
  echo "--max-retries must be a positive integer"
  exit 1
fi

if [[ ! "$RETRY_DELAY_SECONDS" =~ ^[0-9]+$ ]]; then
  echo "--retry-delay must be a non-negative integer"
  exit 1
fi

count_korean_chars() {
  printf '%s' "$1" | grep -o '[가-힣]' | wc -l | tr -d ' '
}

count_latin_chars() {
  printf '%s' "$1" | grep -o '[A-Za-z]' | wc -l | tr -d ' '
}

normalize_message() {
  local original="$1"
  local normalized="$original"

  if [[ "$ALLOW_NON_KOREAN" == "true" ]]; then
    printf '%s' "$normalized"
    return
  fi

  local korean_count
  local latin_count
  korean_count="$(count_korean_chars "$normalized")"
  latin_count="$(count_latin_chars "$normalized")"

  if [[ "$korean_count" -eq 0 || "$latin_count" -gt "$korean_count" ]]; then
    local short
    short="$(printf '%s' "$original" | tr '\n' ' ' | cut -c 1-80)"
    normalized="작업 완료 알림: ${short}"
    korean_count="$(count_korean_chars "$normalized")"
    latin_count="$(count_latin_chars "$normalized")"
  fi

  if [[ "$korean_count" -eq 0 || "$latin_count" -gt "$korean_count" ]]; then
    local issue_ref
    issue_ref="$(printf '%s' "$original" | grep -o '#[0-9]\+' | head -n1 || true)"
    if [[ -n "$issue_ref" ]]; then
      normalized="작업 완료 알림입니다. ${issue_ref} 관련 상세 내용은 작업 로그를 확인해 주세요."
    else
      normalized="작업 완료 알림입니다. 상세 내용은 작업 로그를 확인해 주세요."
    fi
  fi

  printf '%s' "$normalized"
}

send_payload_once() {
  local payload="$1"
  curl -fsS -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$payload" >/dev/null
}

send_with_retry() {
  local payload="$1"
  local label="$2"
  local attempt=1

  while [[ "$attempt" -le "$MAX_RETRIES" ]]; do
    if send_payload_once "$payload"; then
      echo "[notify] sent ($label, attempt=$attempt)"
      return 0
    fi

    if [[ "$attempt" -lt "$MAX_RETRIES" ]]; then
      sleep "$RETRY_DELAY_SECONDS"
    fi
    attempt=$((attempt + 1))
  done

  echo "[notify] failed after retries ($label)" >&2
  return 1
}

enqueue_payload() {
  local payload="$1"
  mkdir -p "$(dirname "$PENDING_FILE")"
  printf '%s\n' "$payload" >> "$PENDING_FILE"
  echo "[notify] queued unsent payload: $PENDING_FILE"
}

flush_pending_queue() {
  if [[ ! -s "$PENDING_FILE" ]]; then
    return
  fi

  local tmp_file
  tmp_file="$(mktemp)"

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ -z "$line" ]]; then
      continue
    fi

    if send_with_retry "$line" "queued"; then
      continue
    fi

    printf '%s\n' "$line" >> "$tmp_file"
  done < "$PENDING_FILE"

  if [[ -s "$tmp_file" ]]; then
    mv "$tmp_file" "$PENDING_FILE"
  else
    unlink "$tmp_file"
    unlink "$PENDING_FILE"
  fi
}

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required"
  exit 1
fi

MESSAGE="$(normalize_message "$MESSAGE")"

payload="$(jq -n --arg token "$WEBHOOK_TOKEN" --arg title "$TITLE" --arg message "$MESSAGE" '{token: $token, title: $title, message: $message}')"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "$payload"
  exit 0
fi

if [[ -z "$WEBHOOK_TOKEN" ]]; then
  echo "[notify] token missing; cannot send" >&2
  if [[ "$STRICT_MODE" == "true" ]]; then
    exit 1
  fi
  exit 0
fi

flush_pending_queue || true

if send_with_retry "$payload" "current"; then
  echo "moshi notification sent"
  exit 0
fi

fallback_message="작업 완료 알림입니다. 상세 내용은 채팅 응답을 확인해 주세요."
fallback_payload="$(jq -n --arg token "$WEBHOOK_TOKEN" --arg title "$TITLE" --arg message "$fallback_message" '{token: $token, title: $title, message: $message}')"

if send_with_retry "$fallback_payload" "fallback"; then
  echo "moshi notification sent (fallback)"
  exit 0
fi

enqueue_payload "$payload"

if [[ "$STRICT_MODE" == "true" ]]; then
  exit 1
fi

exit 0
