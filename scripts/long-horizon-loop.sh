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
CHECKPOINT_TIMEOUT_SECONDS="${LONG_HORIZON_CHECKPOINT_TIMEOUT_SECONDS:-1800}"

CHECKPOINT_EVERY_CYCLES="${LONG_HORIZON_CHECKPOINT_EVERY:-0}"
STALE_MINUTES="${LONG_HORIZON_STALE_MINUTES:-20}"
MAX_NO_PROGRESS_CYCLES="${LONG_HORIZON_MAX_NO_PROGRESS_CYCLES:-0}"

AUTO_FINISH="${LONG_HORIZON_AUTO_FINISH:-false}"
FINISH_TARGET_BRANCH="${LONG_HORIZON_FINISH_TARGET_BRANCH:-main}"
FINISH_COMMIT_MSG="${LONG_HORIZON_FINISH_COMMIT_MSG:-}"
FINISH_ISSUE="${LONG_HORIZON_FINISH_ISSUE:-}"
FINISH_AUTO_MERGE="${LONG_HORIZON_FINISH_AUTO_MERGE:-false}"
FINISH_TIMEOUT_SECONDS="${LONG_HORIZON_FINISH_TIMEOUT_SECONDS:-1800}"

KPI_JSONL_FILE="${LONG_HORIZON_KPI_JSONL_FILE:-$ROOT_DIR/.codex/.long-horizon-kpi.jsonl}"
KPI_CSV_FILE="${LONG_HORIZON_KPI_CSV_FILE:-$ROOT_DIR/.codex/.long-horizon-kpi.csv}"

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
  --checkpoint-timeout <sec>     Timeout for checkpoint step (default: $CHECKPOINT_TIMEOUT_SECONDS)
  --checkpoint-every <n>         Auto-checkpoint every N successful cycles (default: $CHECKPOINT_EVERY_CYCLES, 0=off)
  --stale-minutes <n>            Alert when no progress for N minutes (default: $STALE_MINUTES, 0=off)
  --max-no-progress-cycles <n>   Stop after N consecutive no-progress cycles (default: $MAX_NO_PROGRESS_CYCLES, 0=off)
  --auto-finish                  Run ai-finish-task when loop exits
  --finish-target <branch>       Target branch for auto-finish MR (default: $FINISH_TARGET_BRANCH)
  --finish-commit-msg <text>     Commit message for auto-finish (default: auto-generated)
  --finish-issue <number>        Optional issue IID for auto-finish
  --finish-auto-merge            Enable auto-merge in auto-finish
  --finish-timeout <sec>         Timeout for auto-finish step (default: $FINISH_TIMEOUT_SECONDS)
  --session-id <id>              Session id (default: current UTC timestamp)
  --resume <id>                  Resume existing session id under $LOG_ROOT
  --log-root <path>              Session log root (default: $LOG_ROOT)
  --template-dir <path>          Template dir for memory files (default: $TEMPLATE_DIR)
  --kpi-jsonl <path>             KPI jsonl output (default: $KPI_JSONL_FILE)
  --kpi-csv <path>               KPI csv output (default: $KPI_CSV_FILE)
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

validate_boolean() {
  local value="$1"
  local label="$2"
  if [[ "$value" != "true" && "$value" != "false" ]]; then
    echo "$label must be true or false" >&2
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
    --title "Long loop #${cycle} ${status}" \
    --message "장기 루프 ${cycle}회차 상태 요약: ${message}" \
    >/dev/null || true
}

notify_cycle_start() {
  local cycle="$1"
  local message="$2"

  if [[ -z "$NOTIFY_TOKEN" ]]; then
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run notify cycle=$cycle status=start"
    return
  fi

  "$ROOT_DIR/scripts/notify-moshi.sh" \
    --token "$NOTIFY_TOKEN" \
    --title "Long loop #${cycle} start" \
    --message "장기 루프 ${cycle}회차 시작 계획: ${message}" \
    >/dev/null || true
}

notify_session_event() {
  local phase="$1"
  local message="$2"

  if [[ -z "$NOTIFY_TOKEN" ]]; then
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run notify session phase=$phase"
    return
  fi

  "$ROOT_DIR/scripts/notify-moshi.sh" \
    --token "$NOTIFY_TOKEN" \
    --title "Long loop session ${phase}" \
    --message "장기 루프 세션 ${phase}: ${message}" \
    >/dev/null || true
}

bool_to_ko() {
  local value="$1"
  if [[ "$value" == "true" ]]; then
    echo "예"
  else
    echo "아니오"
  fi
}

notify_stale() {
  local idle_minutes="$1"

  log "no progress detected for ${idle_minutes} minute(s)"
  if [[ -z "$NOTIFY_TOKEN" ]]; then
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run notify stale idle_minutes=$idle_minutes"
    return
  fi

  "$ROOT_DIR/scripts/notify-moshi.sh" \
    --token "$NOTIFY_TOKEN" \
    --title "Long loop stale" \
    --message "장기 루프 진행 정체 감지: ${idle_minutes}분 동안 변경 없음 (session: ${SESSION_ID})" \
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
    echo "+ ./scripts/run-ai-verify --mode full 2>&1 | tee $output_file"
    return 0
  fi

  (
    ./scripts/run-ai-verify --mode full 2>&1 | tee "$output_file"
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

run_checkpoint() {
  local cycle_id="$1"
  local output_file="$2"
  local timeout_seconds="$3"
  local commit_msg="chore: long-horizon checkpoint session=${SESSION_ID} cycle=${cycle_id}"

  local -a cmd=(
    "$ROOT_DIR/scripts/long-horizon-checkpoint.sh"
    --session-id "$SESSION_ID"
    --commit-msg "$commit_msg"
  )

  if [[ "$DRY_RUN" == "true" ]]; then
    cmd+=(--dry-run)
    printf '+ %q ' "${cmd[@]}"
    echo "2>&1 | tee $output_file"
    return 0
  fi

  (
    "${cmd[@]}" 2>&1 | tee "$output_file"
  ) &
  local cmd_pid=$!

  local wait_rc=0
  wait_with_timeout "$cmd_pid" "$timeout_seconds" || wait_rc=$?
  if [[ "$wait_rc" -ne 0 ]]; then
    if [[ "$wait_rc" -eq 124 ]]; then
      echo "checkpoint timeout exceeded (${timeout_seconds}s): $output_file" >&2
    fi
    return "$wait_rc"
  fi

  return 0
}

run_auto_finish() {
  local output_file="$1"
  local timeout_seconds="$2"

  local commit_msg="$FINISH_COMMIT_MSG"
  if [[ -z "$commit_msg" ]]; then
    commit_msg="chore: long-horizon finalize session=${SESSION_ID}"
  fi

  local -a cmd=(
    "$ROOT_DIR/scripts/ai-finish-task"
    --target "$FINISH_TARGET_BRANCH"
    --commit-msg "$commit_msg"
  )

  if [[ -n "$FINISH_ISSUE" ]]; then
    cmd+=(--issue "$FINISH_ISSUE")
  fi
  if [[ "$FINISH_AUTO_MERGE" == "true" ]]; then
    cmd+=(--auto-merge)
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    cmd+=(--dry-run)
    printf '+ %q ' "${cmd[@]}"
    echo "2>&1 | tee $output_file"
    return 0
  fi

  (
    "${cmd[@]}" 2>&1 | tee "$output_file"
  ) &
  local cmd_pid=$!

  local wait_rc=0
  wait_with_timeout "$cmd_pid" "$timeout_seconds" || wait_rc=$?
  if [[ "$wait_rc" -ne 0 ]]; then
    if [[ "$wait_rc" -eq 124 ]]; then
      echo "auto-finish timeout exceeded (${timeout_seconds}s): $output_file" >&2
    fi
    return "$wait_rc"
  fi

  return 0
}

write_cycle_report() {
  local report_file="$1"
  local cycle_num="$2"
  local cycle_status="$3"
  local failure_stage="$4"
  local duration_sec="$5"
  local has_changes="$6"
  local head_changed="$7"
  local checkpoint_triggered="$8"
  local checkpoint_ok="$9"

  cat > "$report_file" <<EOF
{
  "session_id": "$SESSION_ID",
  "cycle": $cycle_num,
  "status": "$cycle_status",
  "failure_stage": "$failure_stage",
  "duration_sec": $duration_sec,
  "has_changes": $has_changes,
  "head_changed": $head_changed,
  "checkpoint_triggered": $checkpoint_triggered,
  "checkpoint_ok": $checkpoint_ok
}
EOF
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
  "checkpoint_every_cycles": $CHECKPOINT_EVERY_CYCLES,
  "stale_minutes": $STALE_MINUTES,
  "max_no_progress_cycles": $MAX_NO_PROGRESS_CYCLES,
  "consecutive_no_progress": $CONSECUTIVE_NO_PROGRESS,
  "last_progress_at": "$LAST_PROGRESS_AT_UTC",
  "stale_alert_sent": $STALE_ALERT_SENT,
  "stop_reason": "$STOP_REASON",
  "auto_finish_enabled": $AUTO_FINISH,
  "finish_target_branch": "$FINISH_TARGET_BRANCH",
  "finish_auto_merge": $FINISH_AUTO_MERGE,
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
    --checkpoint-timeout)
      CHECKPOINT_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --checkpoint-every)
      CHECKPOINT_EVERY_CYCLES="${2:-}"
      shift 2
      ;;
    --stale-minutes)
      STALE_MINUTES="${2:-}"
      shift 2
      ;;
    --max-no-progress-cycles)
      MAX_NO_PROGRESS_CYCLES="${2:-}"
      shift 2
      ;;
    --auto-finish)
      AUTO_FINISH="true"
      shift
      ;;
    --finish-target)
      FINISH_TARGET_BRANCH="${2:-}"
      shift 2
      ;;
    --finish-commit-msg)
      FINISH_COMMIT_MSG="${2:-}"
      shift 2
      ;;
    --finish-issue)
      FINISH_ISSUE="${2:-}"
      shift 2
      ;;
    --finish-auto-merge)
      FINISH_AUTO_MERGE="true"
      shift
      ;;
    --finish-timeout)
      FINISH_TIMEOUT_SECONDS="${2:-}"
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
    --kpi-jsonl)
      KPI_JSONL_FILE="${2:-}"
      shift 2
      ;;
    --kpi-csv)
      KPI_CSV_FILE="${2:-}"
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
validate_integer "$CHECKPOINT_TIMEOUT_SECONDS" "--checkpoint-timeout"
validate_integer "$CHECKPOINT_EVERY_CYCLES" "--checkpoint-every"
validate_integer "$STALE_MINUTES" "--stale-minutes"
validate_integer "$MAX_NO_PROGRESS_CYCLES" "--max-no-progress-cycles"
validate_integer "$FINISH_TIMEOUT_SECONDS" "--finish-timeout"
validate_boolean "$AUTO_FINISH" "--auto-finish"
validate_boolean "$FINISH_AUTO_MERGE" "--finish-auto-merge"

if [[ -n "$FINISH_ISSUE" && ! "$FINISH_ISSUE" =~ ^[0-9]+$ ]]; then
  echo "--finish-issue must be numeric" >&2
  exit 1
fi

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

if [[ ! -x "$ROOT_DIR/scripts/run-ai-verify" ]]; then
  echo "missing executable: $ROOT_DIR/scripts/run-ai-verify" >&2
  exit 1
fi

if [[ "$AUTO_FINISH" == "true" && ! -x "$ROOT_DIR/scripts/ai-finish-task" ]]; then
  echo "missing executable: $ROOT_DIR/scripts/ai-finish-task" >&2
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
  num_raw="${base_name#cycle-}"
  if [[ "$num_raw" =~ ^[0-9]+$ ]]; then
    num=$((10#$num_raw))
    if [[ "$num" -gt "$last_cycle_num" ]]; then
      last_cycle_num="$num"
    fi
  fi
done < <(find "$SESSION_DIR" -maxdepth 1 -mindepth 1 -type d -name 'cycle-*' 2>/dev/null || true)

if [[ "$RESUME_MODE" == "true" ]]; then
  cycle=$((last_cycle_num + 1))
else
  cycle=1
fi

LAST_PROGRESS_AT_UTC="$STARTED_AT_UTC"
last_progress_epoch="$START_EPOCH"
STALE_ALERT_SENT="false"
CONSECUTIVE_NO_PROGRESS=0
STOP_REASON="running"
AUTO_FINISH_RESULT="skipped"

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
log "checkpoint_every=$CHECKPOINT_EVERY_CYCLES stale_minutes=$STALE_MINUTES"
log "max_no_progress_cycles=$MAX_NO_PROGRESS_CYCLES auto_finish=$AUTO_FINISH finish_target=$FINISH_TARGET_BRANCH finish_auto_merge=$FINISH_AUTO_MERGE"
notify_session_event "start" "세션ID=${SESSION_ID}, 브랜치=${branch}, 종료예정=${END_AT_UTC:-forever}, 체크포인트주기=${CHECKPOINT_EVERY_CYCLES}, 무진척중단=${MAX_NO_PROGRESS_CYCLES}, 자동마무리=${AUTO_FINISH}"

while true; do
  now_epoch="$(date +%s)"
  if [[ "$FOREVER" == "false" && "$now_epoch" -ge "$END_EPOCH" ]]; then
    log "time limit reached"
    STOP_REASON="time_limit_reached"
    break
  fi

  if [[ "$STALE_MINUTES" -gt 0 ]]; then
    stale_threshold_seconds=$((STALE_MINUTES * 60))
    idle_seconds=$((now_epoch - last_progress_epoch))
    if [[ "$idle_seconds" -ge "$stale_threshold_seconds" && "$STALE_ALERT_SENT" != "true" ]]; then
      notify_stale "$((idle_seconds / 60))"
      STALE_ALERT_SENT="true"
      write_state "running" "$cycle" "$consecutive_failures" "stale alert triggered"
    fi
  fi

  if [[ -f "$STOP_FILE" ]]; then
    log "stop file detected: $STOP_FILE"
    STOP_REASON="stop_file_detected"
    break
  fi

  cycle_started_epoch="$(date +%s)"
  cycle_head_before="$(git rev-parse HEAD)"
  cycle_failed="false"
  failure_stage="none"
  checkpoint_triggered="false"
  checkpoint_ok="false"

  cycle_id="$(printf '%03d' "$cycle")"
  cycle_dir="$SESSION_DIR/cycle-$cycle_id"
  if [[ -e "$cycle_dir" ]]; then
    echo "cycle dir already exists (resume collision): $cycle_dir" >&2
    STOP_REASON="resume_cycle_collision"
    break
  fi
  mkdir "$cycle_dir"
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
  checkpoint_log="$cycle_dir/checkpoint.log.txt"
  git_status_file="$cycle_dir/git-status.txt"
  cycle_report_file="$cycle_dir/cycle-report.json"

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
4) Run ./scripts/run-ai-verify --mode full before finishing.
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

  if [[ "$MAX_NO_PROGRESS_CYCLES" -gt 0 ]]; then
    no_progress_rule="켜짐(${CONSECUTIVE_NO_PROGRESS}/${MAX_NO_PROGRESS_CYCLES})"
  else
    no_progress_rule="꺼짐"
  fi
  notify_cycle_start "$cycle" "계획=Plan 갱신 -> 최우선 1건 구현 -> verify -> docs, 무진척규칙=${no_progress_rule}, 체크포인트주기=${CHECKPOINT_EVERY_CYCLES}, 로그=cycle-${cycle_id}"

  if ! run_codex_exec "$plan_prompt" "$plan_last" "$plan_log" "$PLAN_TIMEOUT_SECONDS"; then
    cycle_failed="true"
    failure_stage="planning"
    log "cycle=$cycle_id failed during planning"
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$build_prompt" "$build_last" "$build_log" "$BUILD_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      failure_stage="implementation"
      log "cycle=$cycle_id failed during implementation"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_verify "$verify_log" "$VERIFY_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      failure_stage="verify"
      log "cycle=$cycle_id failed during verify"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$docs_prompt" "$docs_last" "$docs_log" "$DOC_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      failure_stage="docs"
      log "cycle=$cycle_id failed during docs"
    fi
  fi

  if [[ "$cycle_failed" == "false" && "$CHECKPOINT_EVERY_CYCLES" -gt 0 && $((cycle % CHECKPOINT_EVERY_CYCLES)) -eq 0 ]]; then
    checkpoint_triggered="true"
    if run_checkpoint "$cycle_id" "$checkpoint_log" "$CHECKPOINT_TIMEOUT_SECONDS"; then
      checkpoint_ok="true"
    else
      cycle_failed="true"
      failure_stage="checkpoint"
      log "cycle=$cycle_id failed during checkpoint"
    fi
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ git status --short > $git_status_file"
  else
    git status --short > "$git_status_file"
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    has_changes="true"
  elif [[ -s "$git_status_file" ]]; then
    has_changes="true"
  else
    has_changes="false"
  fi

  cycle_head_after="$(git rev-parse HEAD)"
  if [[ "$cycle_head_before" == "$cycle_head_after" ]]; then
    head_changed="false"
  else
    head_changed="true"
  fi

  if [[ "$has_changes" == "true" || "$head_changed" == "true" ]]; then
    last_progress_epoch="$(date +%s)"
    LAST_PROGRESS_AT_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    STALE_ALERT_SENT="false"
    progress_detected="true"
  else
    progress_detected="false"
  fi

  cycle_finished_epoch="$(date +%s)"
  cycle_duration_sec=$((cycle_finished_epoch - cycle_started_epoch))

  if [[ "$cycle_failed" == "true" ]]; then
    cycle_status="failed"
  else
    cycle_status="success"
  fi

  write_cycle_report \
    "$cycle_report_file" \
    "$cycle" \
    "$cycle_status" \
    "$failure_stage" \
    "$cycle_duration_sec" \
    "$has_changes" \
    "$head_changed" \
    "$checkpoint_triggered" \
    "$checkpoint_ok"

  if [[ "$cycle_failed" == "true" ]]; then
    consecutive_failures=$((consecutive_failures + 1))
    CONSECUTIVE_NO_PROGRESS=0
    if [[ "$MAX_NO_PROGRESS_CYCLES" -gt 0 ]]; then
      no_progress_status="0/${MAX_NO_PROGRESS_CYCLES}"
    else
      no_progress_status="0/off"
    fi
    if [[ "$checkpoint_triggered" == "true" ]]; then
      if [[ "$checkpoint_ok" == "true" ]]; then
        checkpoint_status="성공"
      else
        checkpoint_status="실패"
      fi
    else
      checkpoint_status="미실행"
    fi
    notify_cycle "$cycle" "failed" "상태=실패, 실패단계=${failure_stage}, 소요=${cycle_duration_sec}초, 작업변경=$(bool_to_ko "$has_changes"), 커밋변경=$(bool_to_ko "$head_changed"), 진척=$(bool_to_ko "$progress_detected"), 무진척연속=${no_progress_status}, 체크포인트=${checkpoint_status}, 로그=cycle-${cycle_id}"
    write_state "running" "$cycle" "$consecutive_failures" "cycle $cycle_id failed at $failure_stage"
    log "cycle=$cycle_id failed at $failure_stage (consecutive_failures=$consecutive_failures)"
    if [[ "$consecutive_failures" -ge "$MAX_FAILURES" ]]; then
      log "max failures reached; stopping loop"
      STOP_REASON="max_failures_reached"
      break
    fi
  else
    consecutive_failures=0
    if [[ "$progress_detected" == "true" ]]; then
      CONSECUTIVE_NO_PROGRESS=0
    else
      CONSECUTIVE_NO_PROGRESS=$((CONSECUTIVE_NO_PROGRESS + 1))
    fi

    if [[ "$MAX_NO_PROGRESS_CYCLES" -gt 0 ]]; then
      no_progress_status="${CONSECUTIVE_NO_PROGRESS}/${MAX_NO_PROGRESS_CYCLES}"
    else
      no_progress_status="${CONSECUTIVE_NO_PROGRESS}/off"
    fi
    if [[ "$checkpoint_triggered" == "true" ]]; then
      if [[ "$checkpoint_ok" == "true" ]]; then
        checkpoint_status="성공"
      else
        checkpoint_status="실패"
      fi
    else
      checkpoint_status="미실행"
    fi
    notify_cycle "$cycle" "done" "상태=성공, 소요=${cycle_duration_sec}초, 작업변경=$(bool_to_ko "$has_changes"), 커밋변경=$(bool_to_ko "$head_changed"), 진척=$(bool_to_ko "$progress_detected"), 무진척연속=${no_progress_status}, 체크포인트=${checkpoint_status}, 로그=cycle-${cycle_id}"
    write_state "running" "$cycle" "$consecutive_failures" "cycle $cycle_id success (progress=$progress_detected, no_progress_streak=$CONSECUTIVE_NO_PROGRESS)"
    log "cycle=$cycle_id success (progress=$progress_detected, no_progress_streak=$CONSECUTIVE_NO_PROGRESS)"

    if [[ "$MAX_NO_PROGRESS_CYCLES" -gt 0 && "$CONSECUTIVE_NO_PROGRESS" -ge "$MAX_NO_PROGRESS_CYCLES" ]]; then
      log "max no-progress cycles reached ($CONSECUTIVE_NO_PROGRESS/$MAX_NO_PROGRESS_CYCLES); stopping loop"
      STOP_REASON="max_no_progress_cycles_reached"
      write_state "running" "$cycle" "$consecutive_failures" "max no-progress cycles reached ($CONSECUTIVE_NO_PROGRESS/$MAX_NO_PROGRESS_CYCLES)"
      break
    fi
  fi

  cycle=$((cycle + 1))

  if [[ "$DRY_RUN" == "true" ]]; then
    log "dry-run finished after first cycle"
    STOP_REASON="dry_run"
    break
  fi

  if [[ "$SLEEP_SECONDS" -gt 0 ]]; then
    sleep "$SLEEP_SECONDS"
  fi
done

finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
summary_file="$SESSION_DIR/session-summary.md"
finish_log="$SESSION_DIR/finish.log.txt"

if [[ "$STOP_REASON" == "running" ]]; then
  STOP_REASON="loop_exited"
fi

if [[ "$AUTO_FINISH" == "true" ]]; then
  log "auto-finish start target=$FINISH_TARGET_BRANCH auto_merge=$FINISH_AUTO_MERGE"
  if run_auto_finish "$finish_log" "$FINISH_TIMEOUT_SECONDS"; then
    AUTO_FINISH_RESULT="success"
    log "auto-finish succeeded"
  else
    AUTO_FINISH_RESULT="failed"
    log "auto-finish failed (see $finish_log)"
  fi
else
  AUTO_FINISH_RESULT="skipped"
fi

notify_session_event "end" "중단사유=${STOP_REASON}, 자동마무리결과=${AUTO_FINISH_RESULT}, 실패연속=${consecutive_failures}, 무진척연속=${CONSECUTIVE_NO_PROGRESS}, 마지막진척시각=${LAST_PROGRESS_AT_UTC}"

FINISH_LOG_VALUE="n/a"
if [[ "$AUTO_FINISH" == "true" ]]; then
  FINISH_LOG_VALUE="$finish_log"
fi

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
- max_no_progress_cycles: $MAX_NO_PROGRESS_CYCLES
- checkpoint_every_cycles: $CHECKPOINT_EVERY_CYCLES
- stale_minutes: $STALE_MINUTES
- consecutive_failures_at_end: $consecutive_failures
- consecutive_no_progress_at_end: $CONSECUTIVE_NO_PROGRESS
- stop_reason: $STOP_REASON
- last_progress_at: $LAST_PROGRESS_AT_UTC
- auto_finish: $AUTO_FINISH
- auto_finish_result: $AUTO_FINISH_RESULT
- finish_target_branch: $FINISH_TARGET_BRANCH
- finish_issue: ${FINISH_ISSUE:-n/a}
- finish_auto_merge: $FINISH_AUTO_MERGE
- finish_log: $FINISH_LOG_VALUE
- logs: $SESSION_DIR
- memory_files:
  - $PROMPT_FILE
  - $PLAN_FILE
  - $IMPLEMENT_FILE
  - $DOC_FILE
EOF

if [[ "$DRY_RUN" == "true" ]]; then
  echo "+ ./scripts/long-horizon-kpi.sh --session-dir $SESSION_DIR --jsonl-file $KPI_JSONL_FILE --csv-file $KPI_CSV_FILE --append"
elif [[ -x "$ROOT_DIR/scripts/long-horizon-kpi.sh" ]]; then
  "$ROOT_DIR/scripts/long-horizon-kpi.sh" \
    --session-dir "$SESSION_DIR" \
    --jsonl-file "$KPI_JSONL_FILE" \
    --csv-file "$KPI_CSV_FILE" \
    --append \
    >/dev/null || true
fi

if [[ "$AUTO_FINISH_RESULT" == "failed" ]]; then
  write_state "failed" "$cycle" "$consecutive_failures" "session completed; auto-finish failed"
else
  write_state "completed" "$cycle" "$consecutive_failures" "session completed; auto-finish=$AUTO_FINISH_RESULT"
fi
log "summary=$summary_file"
log "done"
