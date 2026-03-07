#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

default_spec_path="$ROOT_DIR/docs/specs/work-session-spec.md"
if [[ -f "$default_spec_path" ]]; then
  SPEC_PATH="${LONG_HORIZON_SPEC_PATH:-$default_spec_path}"
else
  SPEC_PATH="${LONG_HORIZON_SPEC_PATH:-}"
fi

TEMPLATE_DIR="${LONG_HORIZON_TEMPLATE_DIR:-$ROOT_DIR/.codex/templates/long-horizon}"
LOG_ROOT="${LONG_HORIZON_LOG_ROOT:-$ROOT_DIR/.codex/long-horizon}"
STOP_FILE="${LONG_HORIZON_STOP_FILE:-$ROOT_DIR/.codex/STOP_LONG_HORIZON_LOOP}"
SESSION_ID="${LONG_HORIZON_SESSION_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"

HOURS="${LONG_HORIZON_HOURS:-24}"
FOREVER="false"
SLEEP_SECONDS="${LONG_HORIZON_SLEEP_SECONDS:-30}"
MAX_FAILURES="${LONG_HORIZON_MAX_FAILURES:-5}"
MODEL="${LONG_HORIZON_MODEL:-}"
WEB_MODE="${LONG_HORIZON_WEB_MODE:-cached}"
NOTIFY_TOKEN="${MOSHI_WEBHOOK_TOKEN:-}"
DRY_RUN="false"
ALLOW_MAIN="false"
RESUME_MODE="false"

PLAN_TIMEOUT_SECONDS="${LONG_HORIZON_PLAN_TIMEOUT_SECONDS:-420}"
BUILD_TIMEOUT_SECONDS="${LONG_HORIZON_BUILD_TIMEOUT_SECONDS:-1800}"
DOC_TIMEOUT_SECONDS="${LONG_HORIZON_DOC_TIMEOUT_SECONDS:-420}"
VERIFY_TIMEOUT_SECONDS="${LONG_HORIZON_VERIFY_TIMEOUT_SECONDS:-600}"

usage() {
  cat <<USAGE
Usage: scripts/long-horizon-loop.sh [options]

24h class long-horizon automation loop with durable memory files:
  plan -> implement -> verify -> docs

Options:
  --spec <path>                  Optional spec file path
  --hours <n>                    Session duration in hours (default: $HOURS)
  --forever                      Run until stop file is detected
  --sleep <sec>                  Pause between cycles (default: $SLEEP_SECONDS)
  --max-failures <n>             Stop after consecutive failures (default: $MAX_FAILURES)
  --model <name>                 Optional codex model override
  --web-mode <mode>              live|cached|disabled (default: $WEB_MODE)
  --plan-timeout <sec>           Timeout for planning step (default: $PLAN_TIMEOUT_SECONDS)
  --build-timeout <sec>          Timeout for implementation step (default: $BUILD_TIMEOUT_SECONDS)
  --doc-timeout <sec>            Timeout for docs step (default: $DOC_TIMEOUT_SECONDS)
  --verify-timeout <sec>         Timeout for verify step (default: $VERIFY_TIMEOUT_SECONDS)
  --session-id <id>              Session id (default: current UTC timestamp)
  --resume <id>                  Resume existing session id under $LOG_ROOT
  --log-root <path>              Session log root (default: $LOG_ROOT)
  --template-dir <path>          Template dir for memory files (default: $TEMPLATE_DIR)
  --notify-token <token>         Moshi token for cycle completion alerts
  --allow-main                   Allow execution on main/master branch
  --dry-run                      Print commands only
  -h, --help                     Show help

Stop signal:
  touch $STOP_FILE
USAGE
}

log() {
  printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

require_command() {
  local name="$1"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "missing required command: $name" >&2
    exit 1
  fi
}

validate_integer() {
  local value="$1"
  local label="$2"
  if [[ ! "$value" =~ ^[0-9]+$ ]]; then
    echo "$label must be a non-negative integer" >&2
    exit 1
  fi
}

validate_web_mode() {
  local value="$1"
  if [[ ! "$value" =~ ^(live|cached|disabled)$ ]]; then
    echo "invalid web mode: $value (expected live|cached|disabled)" >&2
    exit 1
  fi
}

wait_with_timeout() {
  local pid="$1"
  local timeout_seconds="$2"

  if [[ "$timeout_seconds" -le 0 ]]; then
    wait "$pid"
    return $?
  fi

  local elapsed=0
  while kill -0 "$pid" 2>/dev/null; do
    if [[ "$elapsed" -ge "$timeout_seconds" ]]; then
      kill -TERM "$pid" 2>/dev/null || true
      sleep 2
      kill -KILL "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
      return 124
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  wait "$pid"
}

notify_cycle() {
  local cycle="$1"
  local status="$2"
  local message="$3"

  if [[ -z "$NOTIFY_TOKEN" ]]; then
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run notify cycle=$cycle status=$status"
    return
  fi

  "$ROOT_DIR/scripts/notify-moshi.sh" \
    --token "$NOTIFY_TOKEN" \
    --title "Long loop $status" \
    --message "장기 루프 ${cycle}회차 ${status}: ${message}" \
    >/dev/null || true
}

run_codex_exec() {
  local prompt_file="$1"
  local last_message_file="$2"
  local transcript_file="$3"
  local timeout_seconds="$4"

  local -a cmd=(
    codex exec
    --dangerously-bypass-approvals-and-sandbox
    --ephemeral
    -c "web_search=\"$WEB_MODE\""
    --output-last-message "$last_message_file"
    -
  )

  if [[ -n "$MODEL" ]]; then
    cmd+=(--model "$MODEL")
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    printf '+ %q ' "${cmd[@]}"
    echo "< $prompt_file 2>&1 | tee $transcript_file"
    return 0
  fi

  (
    "${cmd[@]}" < "$prompt_file" 2>&1 | tee "$transcript_file"
  ) &
  local cmd_pid=$!

  local wait_rc=0
  wait_with_timeout "$cmd_pid" "$timeout_seconds" || wait_rc=$?
  if [[ "$wait_rc" -ne 0 ]]; then
    if [[ "$wait_rc" -eq 124 ]]; then
      echo "step timeout exceeded (${timeout_seconds}s): $transcript_file" >&2
    fi
    return "$wait_rc"
  fi

  return 0
}

run_verify() {
  local output_file="$1"
  local timeout_seconds="$2"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ ./scripts/ai-verify --mode full 2>&1 | tee $output_file"
    return 0
  fi

  (
    ./scripts/ai-verify --mode full 2>&1 | tee "$output_file"
  ) &
  local cmd_pid=$!

  local wait_rc=0
  wait_with_timeout "$cmd_pid" "$timeout_seconds" || wait_rc=$?
  if [[ "$wait_rc" -ne 0 ]]; then
    if [[ "$wait_rc" -eq 124 ]]; then
      echo "verify timeout exceeded (${timeout_seconds}s): $output_file" >&2
    fi
    return "$wait_rc"
  fi

  return 0
}

write_state() {
  local status="$1"
  local cycle="$2"
  local failures="$3"
  local message="$4"

  local now_utc
  now_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  cat > "$STATE_FILE" <<EOF
{
  "session_id": "$SESSION_ID",
  "status": "$status",
  "updated_at": "$now_utc",
  "started_at": "$STARTED_AT_UTC",
  "ended_at": "${END_AT_UTC:-}",
  "spec_path": "${SPEC_PATH}",
  "branch": "$branch",
  "cycle": $cycle,
  "consecutive_failures": $failures,
  "last_message": "$message",
  "session_dir": "$SESSION_DIR",
  "stop_file": "$STOP_FILE"
}
EOF
}

initialize_memory_file() {
  local target_file="$1"
  local template_name="$2"
  if [[ -f "$target_file" ]]; then
    return
  fi

  local template_file="$TEMPLATE_DIR/$template_name"
  if [[ -f "$template_file" ]]; then
    cp "$template_file" "$target_file"
    return
  fi

  cat > "$target_file" <<'EOF'
# Placeholder
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --spec)
      SPEC_PATH="${2:-}"
      shift 2
      ;;
    --hours)
      HOURS="${2:-}"
      shift 2
      ;;
    --forever)
      FOREVER="true"
      shift
      ;;
    --sleep)
      SLEEP_SECONDS="${2:-}"
      shift 2
      ;;
    --max-failures)
      MAX_FAILURES="${2:-}"
      shift 2
      ;;
    --model)
      MODEL="${2:-}"
      shift 2
      ;;
    --web-mode)
      WEB_MODE="${2:-}"
      shift 2
      ;;
    --plan-timeout)
      PLAN_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --build-timeout)
      BUILD_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --doc-timeout)
      DOC_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --verify-timeout)
      VERIFY_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --session-id)
      SESSION_ID="${2:-}"
      shift 2
      ;;
    --resume)
      SESSION_ID="${2:-}"
      RESUME_MODE="true"
      shift 2
      ;;
    --log-root)
      LOG_ROOT="${2:-}"
      shift 2
      ;;
    --template-dir)
      TEMPLATE_DIR="${2:-}"
      shift 2
      ;;
    --notify-token)
      NOTIFY_TOKEN="${2:-}"
      shift 2
      ;;
    --allow-main)
      ALLOW_MAIN="true"
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
      echo "unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

validate_web_mode "$WEB_MODE"
validate_integer "$SLEEP_SECONDS" "--sleep"
validate_integer "$MAX_FAILURES" "--max-failures"
validate_integer "$PLAN_TIMEOUT_SECONDS" "--plan-timeout"
validate_integer "$BUILD_TIMEOUT_SECONDS" "--build-timeout"
validate_integer "$DOC_TIMEOUT_SECONDS" "--doc-timeout"
validate_integer "$VERIFY_TIMEOUT_SECONDS" "--verify-timeout"

if [[ "$FOREVER" == "false" ]]; then
  validate_integer "$HOURS" "--hours"
  if [[ "$HOURS" -lt 1 ]]; then
    echo "--hours must be >= 1 when --forever is not set" >&2
    exit 1
  fi
fi

require_command codex
require_command git

if [[ -n "$SPEC_PATH" && ! -f "$SPEC_PATH" ]]; then
  echo "spec file not found: $SPEC_PATH" >&2
  exit 1
fi

if [[ ! -x "$ROOT_DIR/scripts/ai-verify" ]]; then
  echo "missing executable: $ROOT_DIR/scripts/ai-verify" >&2
  exit 1
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$ALLOW_MAIN" != "true" && ( "$branch" == "main" || "$branch" == "master" ) ]]; then
  echo "refusing to run on $branch. use a task branch or pass --allow-main." >&2
  exit 1
fi

SESSION_DIR="$LOG_ROOT/$SESSION_ID"
STATE_FILE="$SESSION_DIR/state.json"
PROMPT_FILE="$SESSION_DIR/Prompt.md"
PLAN_FILE="$SESSION_DIR/Plan.md"
IMPLEMENT_FILE="$SESSION_DIR/Implement.md"
DOC_FILE="$SESSION_DIR/Documentation.md"

mkdir -p "$SESSION_DIR"

STARTED_AT_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
START_EPOCH="$(date +%s)"

if [[ "$FOREVER" == "true" ]]; then
  END_EPOCH=0
  END_AT_UTC=""
else
  END_EPOCH=$((START_EPOCH + (HOURS * 3600)))
  END_AT_UTC="$(date -u -r "$END_EPOCH" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d "@$END_EPOCH" +%Y-%m-%dT%H:%M:%SZ)"
fi

if [[ "$RESUME_MODE" == "true" ]]; then
  if [[ ! -d "$SESSION_DIR" ]]; then
    echo "resume target not found: $SESSION_DIR" >&2
    exit 1
  fi
else
  initialize_memory_file "$PROMPT_FILE" "Prompt.md"
  initialize_memory_file "$PLAN_FILE" "Plan.md"
  initialize_memory_file "$IMPLEMENT_FILE" "Implement.md"
  initialize_memory_file "$DOC_FILE" "Documentation.md"
fi

if [[ ! -f "$PROMPT_FILE" || ! -f "$PLAN_FILE" || ! -f "$IMPLEMENT_FILE" || ! -f "$DOC_FILE" ]]; then
  echo "memory files missing in session dir: $SESSION_DIR" >&2
  exit 1
fi

last_cycle_num=0
while IFS= read -r cycle_dir; do
  base_name="$(basename "$cycle_dir")"
  num="${base_name#cycle-}"
  if [[ "$num" =~ ^[0-9]+$ ]] && [[ "$num" -gt "$last_cycle_num" ]]; then
    last_cycle_num="$num"
  fi
done < <(find "$SESSION_DIR" -maxdepth 1 -mindepth 1 -type d -name 'cycle-*' 2>/dev/null || true)

if [[ "$RESUME_MODE" == "true" ]]; then
  cycle=$((last_cycle_num + 1))
else
  cycle=1
fi

consecutive_failures=0
write_state "running" "$cycle" "$consecutive_failures" "session initialized"

log "session_id=$SESSION_ID"
log "session_dir=$SESSION_DIR"
log "branch=$branch"
if [[ -n "$SPEC_PATH" ]]; then
  log "spec=$SPEC_PATH"
fi
if [[ "$FOREVER" == "true" ]]; then
  log "duration=forever"
else
  log "duration_hours=$HOURS end_at=$END_AT_UTC"
fi

while true; do
  now_epoch="$(date +%s)"
  if [[ "$FOREVER" == "false" && "$now_epoch" -ge "$END_EPOCH" ]]; then
    log "time limit reached"
    break
  fi

  if [[ -f "$STOP_FILE" ]]; then
    log "stop file detected: $STOP_FILE"
    break
  fi

  cycle_id="$(printf '%03d' "$cycle")"
  cycle_dir="$SESSION_DIR/cycle-$cycle_id"
  mkdir -p "$cycle_dir"
  log "cycle=$cycle_id start"

  plan_prompt="$cycle_dir/plan.prompt.md"
  plan_last="$cycle_dir/plan.last.md"
  plan_log="$cycle_dir/plan.log.txt"

  build_prompt="$cycle_dir/build.prompt.md"
  build_last="$cycle_dir/build.last.md"
  build_log="$cycle_dir/build.log.txt"

  docs_prompt="$cycle_dir/docs.prompt.md"
  docs_last="$cycle_dir/docs.last.md"
  docs_log="$cycle_dir/docs.log.txt"

  verify_log="$cycle_dir/verify.log.txt"
  git_status_file="$cycle_dir/git-status.txt"

  cat > "$plan_prompt" <<EOF
You are running long-horizon cycle $cycle for repository $ROOT_DIR.

Durable memory files (must keep updated):
- Prompt: $PROMPT_FILE
- Plan: $PLAN_FILE
- Implement: $IMPLEMENT_FILE
- Documentation: $DOC_FILE

${SPEC_PATH:+Primary spec: $SPEC_PATH}

Task:
1) Read all durable memory files and git status.
2) Append one section to $PLAN_FILE with title:
   "## Cycle $cycle - \$(date -u +%Y-%m-%dT%H:%M:%SZ)"
3) In that section include:
   - current objective
   - next 1-3 high-impact changes
   - risks and verification checks
4) Do not edit any file except $PLAN_FILE.
5) Output a short Korean summary (max 8 lines).
EOF

  cat > "$build_prompt" <<EOF
You are running implementation step of long-horizon cycle $cycle.

Inputs:
- $PROMPT_FILE
- $PLAN_FILE
- $IMPLEMENT_FILE
- $DOC_FILE
${SPEC_PATH:+- Spec: $SPEC_PATH}

Task:
1) Implement only the highest-priority item from the latest plan section.
2) Keep changes small and reversible.
3) Update $IMPLEMENT_FILE by appending a cycle entry with:
   - changed files
   - intent and rationale
   - rollback notes
4) Run ./scripts/ai-verify --mode full before finishing.
5) Output a Korean summary with remaining risk.
EOF

  cat > "$docs_prompt" <<EOF
You are running documentation step of long-horizon cycle $cycle.

Inputs:
- $PROMPT_FILE
- $PLAN_FILE
- $IMPLEMENT_FILE
- $DOC_FILE
${SPEC_PATH:+- Spec: $SPEC_PATH}

Task:
1) Append one cycle note to $DOC_FILE:
   - what worked / what failed
   - key decisions
   - next cycle start checklist (max 3 items)
2) If objective changed, update "Current Objective" section in $PROMPT_FILE.
3) Do not edit product code in this step.
4) Output concise Korean summary.
EOF

  cycle_failed="false"

  if ! run_codex_exec "$plan_prompt" "$plan_last" "$plan_log" "$PLAN_TIMEOUT_SECONDS"; then
    cycle_failed="true"
    log "cycle=$cycle_id failed during planning"
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$build_prompt" "$build_last" "$build_log" "$BUILD_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during implementation"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_verify "$verify_log" "$VERIFY_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during verify"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$docs_prompt" "$docs_last" "$docs_log" "$DOC_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during docs"
    fi
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ git status --short > $git_status_file"
  else
    git status --short > "$git_status_file"
  fi

  if [[ "$cycle_failed" == "true" ]]; then
    consecutive_failures=$((consecutive_failures + 1))
    notify_cycle "$cycle" "failed" "로그: $cycle_dir"
    write_state "running" "$cycle" "$consecutive_failures" "cycle $cycle_id failed"
    log "cycle=$cycle_id failed (consecutive_failures=$consecutive_failures)"
    if [[ "$consecutive_failures" -ge "$MAX_FAILURES" ]]; then
      log "max failures reached; stopping loop"
      break
    fi
  else
    consecutive_failures=0
    notify_cycle "$cycle" "done" "검증 통과, 로그: $cycle_dir"
    write_state "running" "$cycle" "$consecutive_failures" "cycle $cycle_id success"
    log "cycle=$cycle_id success"
  fi

  cycle=$((cycle + 1))

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run finished after first cycle"
    break
  fi

  if [[ "$SLEEP_SECONDS" -gt 0 ]]; then
    sleep "$SLEEP_SECONDS"
  fi
done

finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
summary_file="$SESSION_DIR/session-summary.md"

cat > "$summary_file" <<EOF
# Long Horizon Loop Summary

- session_id: $SESSION_ID
- started_at: $STARTED_AT_UTC
- finished_at: $finished_at
- spec: ${SPEC_PATH:-n/a}
- branch: $branch
- forever_mode: $FOREVER
- configured_hours: $HOURS
- max_failures: $MAX_FAILURES
- consecutive_failures_at_end: $consecutive_failures
- logs: $SESSION_DIR
- memory_files:
  - $PROMPT_FILE
  - $PLAN_FILE
  - $IMPLEMENT_FILE
  - $DOC_FILE
EOF

write_state "completed" "$cycle" "$consecutive_failures" "session completed"
log "summary=$summary_file"
log "done"
