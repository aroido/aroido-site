#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

STRICT_MODE="${WORK_SESSION_PREFLIGHT_STRICT:-true}"
REPORT_PATH="${WORK_SESSION_PREFLIGHT_REPORT:-$ROOT_DIR/.codex/.work-session-preflight.json}"
REQUIRED_LABELS_CSV="${WORK_SESSION_REQUIRED_LABELS:-Ready,In progress,In review,Done}"
REPO="${WORK_SESSION_REPO:-}"

BLOCKERS=0
WARNINGS=0

TOOLS_GLAB="false"
TOOLS_JQ="false"
TOOLS_RG="false"
GIT_REPO_OK="false"
AUTH_OK="false"
LABELS_OK="false"
AI_VERIFY_OK="false"
AI_FINISH_OK="false"
WORK_SESSION_CMD_OK="false"

required_labels=()
missing_labels=()

pass() { echo "[ok] $1"; }
fail() { echo "[fail] $1"; BLOCKERS=$((BLOCKERS + 1)); }
warn() { echo "[warn] $1"; WARNINGS=$((WARNINGS + 1)); }

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

to_json_array() {
  if [[ "$#" -eq 0 ]]; then
    echo "[]"
    return
  fi
  printf '%s\n' "$@" | jq -R . | jq -s .
}

usage() {
  cat <<USAGE
Usage: work-session-preflight.sh [options]

Options:
  --strict <true|false>         Fail on blocker checks (default: $STRICT_MODE)
  --report <path>               JSON report path (default: $REPORT_PATH)
  --required-labels <csv>       Required labels (default: $REQUIRED_LABELS_CSV)
  --repo <owner/repo>           Override target repository for glab calls
  -h, --help                    Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --strict)
      STRICT_MODE="${2:-}"
      shift 2
      ;;
    --report)
      REPORT_PATH="${2:-}"
      shift 2
      ;;
    --required-labels)
      REQUIRED_LABELS_CSV="${2:-}"
      shift 2
      ;;
    --repo)
      REPO="${2:-}"
      shift 2
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

if [[ ! "$STRICT_MODE" =~ ^(true|false)$ ]]; then
  echo "--strict must be true or false"
  exit 1
fi

mkdir -p "$(dirname "$REPORT_PATH")"

echo "== Work Session Preflight =="
echo "strict=$STRICT_MODE"
if [[ -n "$REPO" ]]; then
  echo "repo=$REPO"
fi
echo

if command -v glab >/dev/null 2>&1; then
  TOOLS_GLAB="true"
  pass "glab is installed"
else
  fail "glab is not installed"
fi

if command -v jq >/dev/null 2>&1; then
  TOOLS_JQ="true"
  pass "jq is installed"
else
  fail "jq is not installed"
fi

if command -v rg >/dev/null 2>&1; then
  TOOLS_RG="true"
  pass "rg is installed"
else
  fail "rg is not installed"
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_REPO_OK="true"
  pass "inside git repository"
else
  fail "not inside git repository"
fi

if [[ -f "$ROOT_DIR/scripts/ai-verify" ]]; then
  AI_VERIFY_OK="true"
  pass "scripts/ai-verify exists"
else
  fail "scripts/ai-verify missing"
fi

if [[ -f "$ROOT_DIR/scripts/ai-finish-task" ]]; then
  AI_FINISH_OK="true"
  pass "scripts/ai-finish-task exists"
else
  fail "scripts/ai-finish-task missing"
fi

if [[ -f "$ROOT_DIR/.codex/commands/work-session.md" ]]; then
  WORK_SESSION_CMD_OK="true"
  pass ".codex/commands/work-session.md exists"
else
  fail ".codex/commands/work-session.md missing"
fi

if [[ -n "${GITLAB_TOKEN:-}" || -n "${GITLAB_ACCESS_TOKEN:-}" ]]; then
  warn "global GITLAB token env detected; prefer account auth without exported token"
fi

if [[ "$TOOLS_GLAB" == "true" ]]; then
  if glab auth status >/dev/null 2>&1; then
    AUTH_OK="true"
    pass "glab auth is valid"
  else
    fail "glab auth is invalid"
  fi
fi

IFS=',' read -r -a raw_labels <<< "$REQUIRED_LABELS_CSV"
for raw in "${raw_labels[@]}"; do
  label="$(trim "$raw")"
  if [[ -n "$label" ]]; then
    required_labels+=("$label")
  fi
done

if [[ "${#required_labels[@]}" -eq 0 ]]; then
  fail "required labels list is empty"
fi

if [[ "$TOOLS_GLAB" == "true" && "$TOOLS_JQ" == "true" && "$AUTH_OK" == "true" ]]; then
  if [[ -n "$REPO" ]]; then
    labels_json="$(glab label list --repo "$REPO" -P 200 -F json 2>/dev/null || echo '[]')"
  else
    labels_json="$(glab label list -P 200 -F json 2>/dev/null || echo '[]')"
  fi
  available_labels="$(echo "$labels_json" | jq -r '.[].name // empty')"

  for label in "${required_labels[@]}"; do
    if ! printf '%s\n' "$available_labels" | rg -Fx -- "$label" >/dev/null; then
      missing_labels+=("$label")
    fi
  done

  if [[ "${#missing_labels[@]}" -eq 0 ]]; then
    LABELS_OK="true"
    pass "required labels exist"
  else
    fail "missing labels: ${missing_labels[*]}"
  fi
fi

required_labels_json="$(to_json_array "${required_labels[@]}")"
if [[ "${#missing_labels[@]}" -gt 0 ]]; then
  missing_labels_json="$(to_json_array "${missing_labels[@]}")"
else
  missing_labels_json="[]"
fi

jq -n \
  --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg strict_mode "$STRICT_MODE" \
  --arg repo "$REPO" \
  --argjson required_labels "$required_labels_json" \
  --argjson missing_labels "$missing_labels_json" \
  --arg tools_glab "$TOOLS_GLAB" \
  --arg tools_jq "$TOOLS_JQ" \
  --arg tools_rg "$TOOLS_RG" \
  --arg git_repo_ok "$GIT_REPO_OK" \
  --arg auth_ok "$AUTH_OK" \
  --arg labels_ok "$LABELS_OK" \
  --arg ai_verify_ok "$AI_VERIFY_OK" \
  --arg ai_finish_ok "$AI_FINISH_OK" \
  --arg work_session_cmd_ok "$WORK_SESSION_CMD_OK" \
  --argjson blockers "$BLOCKERS" \
  --argjson warnings "$WARNINGS" \
  '{
    generated_at: $generated_at,
    strict_mode: ($strict_mode == "true"),
    context: {
      repo: (if $repo == "" then null else $repo end),
      required_labels: $required_labels,
      missing_labels: $missing_labels
    },
    checks: {
      tools: {
        glab: ($tools_glab == "true"),
        jq: ($tools_jq == "true"),
        rg: ($tools_rg == "true")
      },
      git_repo_ok: ($git_repo_ok == "true"),
      auth_ok: ($auth_ok == "true"),
      labels_ok: ($labels_ok == "true"),
      ai_verify_script_ok: ($ai_verify_ok == "true"),
      ai_finish_script_ok: ($ai_finish_ok == "true"),
      work_session_command_ok: ($work_session_cmd_ok == "true")
    },
    summary: {
      blockers: $blockers,
      warnings: $warnings
    }
  }' > "$REPORT_PATH"

echo
echo "report: $REPORT_PATH"
echo "blockers=$BLOCKERS warnings=$WARNINGS"

if [[ "$STRICT_MODE" == "true" && "$BLOCKERS" -gt 0 ]]; then
  exit 1
fi

exit 0
