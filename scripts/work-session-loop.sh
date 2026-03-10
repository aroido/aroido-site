#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

SPEC_PATH="${WORK_SESSION_SPEC_PATH:-$ROOT_DIR/docs/specs/site-redesign-content-gap-spec-v2.md}"
LOG_ROOT="${WORK_SESSION_LOG_ROOT:-$ROOT_DIR/.codex/work-session-loop}"
STOP_FILE="${WORK_SESSION_STOP_FILE:-$ROOT_DIR/.codex/STOP_WORK_SESSION_LOOP}"
SESSION_ID="${WORK_SESSION_SESSION_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"

CYCLES="${WORK_SESSION_CYCLES:-2}"
FOREVER="false"
SLEEP_SECONDS="${WORK_SESSION_SLEEP_SECONDS:-20}"
MAX_FAILURES="${WORK_SESSION_MAX_FAILURES:-3}"
MODEL="${WORK_SESSION_MODEL:-}"
DRY_RUN="false"
ALLOW_MAIN="false"
NOTIFY_TOKEN="${MOSHI_WEBHOOK_TOKEN:-}"

RESEARCH_WEB_MODE="${WORK_SESSION_RESEARCH_WEB_MODE:-live}"
BUILD_WEB_MODE="${WORK_SESSION_BUILD_WEB_MODE:-live}"
FEEDBACK_WEB_MODE="${WORK_SESSION_FEEDBACK_WEB_MODE:-cached}"
FIX_WEB_MODE="${WORK_SESSION_FIX_WEB_MODE:-disabled}"

RESEARCH_TIMEOUT_SECONDS="${WORK_SESSION_RESEARCH_TIMEOUT_SECONDS:-360}"
BUILD_TIMEOUT_SECONDS="${WORK_SESSION_BUILD_TIMEOUT_SECONDS:-1200}"
FEEDBACK_TIMEOUT_SECONDS="${WORK_SESSION_FEEDBACK_TIMEOUT_SECONDS:-480}"
FIX_TIMEOUT_SECONDS="${WORK_SESSION_FIX_TIMEOUT_SECONDS:-1200}"
VERIFY_TIMEOUT_SECONDS="${WORK_SESSION_VERIFY_TIMEOUT_SECONDS:-300}"

usage() {
  cat <<USAGE
Usage: scripts/work-session-loop.sh [options]

Runs iterative cycles:
  research -> improve -> self-feedback -> fix -> verify

Options:
  --spec <path>                  Spec file path (default: $SPEC_PATH)
  --cycles <n>                   Number of cycles in finite mode (default: $CYCLES)
  --forever                      Run until stop file is detected
  --sleep <sec>                  Pause between cycles (default: $SLEEP_SECONDS)
  --max-failures <n>             Stop after consecutive failures (default: $MAX_FAILURES)
  --model <name>                 Optional codex model override
  --research-web <mode>          live|cached|disabled (default: $RESEARCH_WEB_MODE)
  --build-web <mode>             live|cached|disabled (default: $BUILD_WEB_MODE)
  --feedback-web <mode>          live|cached|disabled (default: $FEEDBACK_WEB_MODE)
  --fix-web <mode>               live|cached|disabled (default: $FIX_WEB_MODE)
  --research-timeout <sec>       Timeout for research step (default: $RESEARCH_TIMEOUT_SECONDS)
  --build-timeout <sec>          Timeout for build step (default: $BUILD_TIMEOUT_SECONDS)
  --feedback-timeout <sec>       Timeout for feedback step (default: $FEEDBACK_TIMEOUT_SECONDS)
  --fix-timeout <sec>            Timeout for fix step (default: $FIX_TIMEOUT_SECONDS)
  --verify-timeout <sec>         Timeout for verify step (default: $VERIFY_TIMEOUT_SECONDS)
  --notify-token <token>         Moshi token for cycle completion alerts
  --allow-main                   Allow execution on main/master branch
  --dry-run                      Print planned commands only
  -h, --help                     Show help

Environment:
  WORK_SESSION_SPEC_PATH
  WORK_SESSION_CYCLES
  WORK_SESSION_SESSION_ID
  WORK_SESSION_LOG_ROOT
  WORK_SESSION_STOP_FILE
  WORK_SESSION_SLEEP_SECONDS
  WORK_SESSION_MAX_FAILURES
  MOSHI_WEBHOOK_TOKEN

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

validate_web_mode() {
  local value="$1"
  if [[ ! "$value" =~ ^(live|cached|disabled)$ ]]; then
    echo "invalid web mode: $value (expected live|cached|disabled)" >&2
    exit 1
  fi
}

validate_timeout() {
  local value="$1"
  local label="$2"
  if [[ ! "$value" =~ ^[0-9]+$ ]]; then
    echo "$label must be a non-negative integer" >&2
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
    --title "Loop $status" \
    --message "워크세션 루프 ${cycle}회차 ${status}: ${message}" \
    >/dev/null || true
}

run_codex_exec() {
  local web_mode="$1"
  local prompt_file="$2"
  local last_message_file="$3"
  local transcript_file="$4"
  local timeout_seconds="$5"

  local -a cmd=(
    codex exec
    --dangerously-bypass-approvals-and-sandbox
    --ephemeral
    -c "web_search=\"$web_mode\""
    --output-last-message "$last_message_file"
    -
  )

  if [[ -n "$MODEL" ]]; then
    cmd+=(--model "$MODEL")
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    printf '+ %q ' "${cmd[@]}"
    echo "< $prompt_file | tee $transcript_file"
    return 0
  fi

  (
    "${cmd[@]}" < "$prompt_file" | tee "$transcript_file"
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
    echo "+ ./scripts/run-ai-verify --mode full | tee $output_file"
    return 0
  fi

  (
    ./scripts/run-ai-verify --mode full | tee "$output_file"
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

while [[ $# -gt 0 ]]; do
  case "$1" in
    --spec)
      SPEC_PATH="${2:-}"
      shift 2
      ;;
    --cycles)
      CYCLES="${2:-}"
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
    --research-web)
      RESEARCH_WEB_MODE="${2:-}"
      shift 2
      ;;
    --build-web)
      BUILD_WEB_MODE="${2:-}"
      shift 2
      ;;
    --feedback-web)
      FEEDBACK_WEB_MODE="${2:-}"
      shift 2
      ;;
    --fix-web)
      FIX_WEB_MODE="${2:-}"
      shift 2
      ;;
    --research-timeout)
      RESEARCH_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --build-timeout)
      BUILD_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --feedback-timeout)
      FEEDBACK_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --fix-timeout)
      FIX_TIMEOUT_SECONDS="${2:-}"
      shift 2
      ;;
    --verify-timeout)
      VERIFY_TIMEOUT_SECONDS="${2:-}"
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

if [[ "$FOREVER" == "false" ]]; then
  if [[ ! "$CYCLES" =~ ^[0-9]+$ ]] || [[ "$CYCLES" -lt 1 ]]; then
    echo "--cycles must be a positive integer" >&2
    exit 1
  fi
fi

if [[ ! "$SLEEP_SECONDS" =~ ^[0-9]+$ ]]; then
  echo "--sleep must be a non-negative integer" >&2
  exit 1
fi

if [[ ! "$MAX_FAILURES" =~ ^[0-9]+$ ]] || [[ "$MAX_FAILURES" -lt 1 ]]; then
  echo "--max-failures must be a positive integer" >&2
  exit 1
fi

validate_web_mode "$RESEARCH_WEB_MODE"
validate_web_mode "$BUILD_WEB_MODE"
validate_web_mode "$FEEDBACK_WEB_MODE"
validate_web_mode "$FIX_WEB_MODE"
validate_timeout "$RESEARCH_TIMEOUT_SECONDS" "--research-timeout"
validate_timeout "$BUILD_TIMEOUT_SECONDS" "--build-timeout"
validate_timeout "$FEEDBACK_TIMEOUT_SECONDS" "--feedback-timeout"
validate_timeout "$FIX_TIMEOUT_SECONDS" "--fix-timeout"
validate_timeout "$VERIFY_TIMEOUT_SECONDS" "--verify-timeout"

require_command codex
require_command git

if [[ ! -f "$SPEC_PATH" ]]; then
  echo "spec file not found: $SPEC_PATH" >&2
  exit 1
fi

if [[ ! -x "$ROOT_DIR/scripts/run-ai-verify" ]]; then
  echo "missing executable: $ROOT_DIR/scripts/run-ai-verify" >&2
  exit 1
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$ALLOW_MAIN" != "true" && ( "$branch" == "main" || "$branch" == "master" ) ]]; then
  echo "refusing to run on $branch. use a task branch or pass --allow-main." >&2
  exit 1
fi

SESSION_DIR="$LOG_ROOT/$SESSION_ID"
mkdir -p "$SESSION_DIR"

log "session_id=$SESSION_ID"
log "spec=$SPEC_PATH"
log "branch=$branch"
log "log_dir=$SESSION_DIR"

cycle=1
consecutive_failures=0
started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

while true; do
  if [[ "$FOREVER" == "false" && "$cycle" -gt "$CYCLES" ]]; then
    log "completed requested cycles ($CYCLES)"
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

  research_prompt="$cycle_dir/research.prompt.md"
  research_last="$cycle_dir/research.last.md"
  research_log="$cycle_dir/research.log.txt"

  build_prompt="$cycle_dir/build.prompt.md"
  build_last="$cycle_dir/build.last.md"
  build_log="$cycle_dir/build.log.txt"

  feedback_prompt="$cycle_dir/feedback.prompt.md"
  feedback_last="$cycle_dir/feedback.last.md"
  feedback_log="$cycle_dir/feedback.log.txt"

  fix_prompt="$cycle_dir/fix.prompt.md"
  fix_last="$cycle_dir/fix.last.md"
  fix_log="$cycle_dir/fix.log.txt"

  verify_log="$cycle_dir/verify.log.txt"
  git_status_file="$cycle_dir/git-status.txt"

  cat > "$research_prompt" <<EOF
You are running cycle $cycle of an automated improvement loop for the Aroido site.

Context:
- Workspace root: $ROOT_DIR
- Spec to follow strictly: $SPEC_PATH
- Goal: improve product narrative quality, visual proof density, and VibeSmith detail depth.

Task:
1) Inspect the current repository state.
2) Search the web for up-to-date references relevant to:
   - 2026 landing page trends for AI/devtools products
   - high-conversion project storytelling structures
   - product page patterns that prove capability with visuals
3) Produce a short cycle plan with max 5 concrete improvements for THIS cycle.

Constraints:
- Do not edit files in this step.
- Include links for external references.
- Use at most 8 web searches and at most 6 cited links.
- Output in Korean.
EOF

  cat > "$build_prompt" <<EOF
You are in cycle $cycle of the Aroido improvement loop.

Use these inputs:
- Primary spec: $SPEC_PATH
- Research output: $research_last

Task:
- Implement the most impactful improvements from the cycle plan.
- Prioritize:
  1) stronger VibeSmith narrative depth
  2) clearer external-facing copy (avoid internal engineering jargon)
  3) more visual evidence blocks (screenshots/diagram placeholders with structured captions)
  4) clearer CTA branching for demo/pilot/docs
- Keep KO/EN content parity.
- Do not introduce personal names.
- Run ./scripts/run-ai-verify --mode full before finishing.

Output:
- changed files
- what improved
- remaining gaps
EOF

  cat > "$feedback_prompt" <<EOF
You are the self-reviewer for cycle $cycle.

Inputs:
- Spec: $SPEC_PATH
- Build summary: $build_last

Task:
1) Audit current working tree against the spec.
2) Score each category out of 100:
   - visual proof
   - narrative clarity
   - VibeSmith depth
   - conversion path clarity
3) List top 5 gaps with file references.
4) Provide a fix list with max 5 items for immediate next pass.

Constraints:
- Do not edit files in this step.
- Output in Korean.
EOF

  cat > "$fix_prompt" <<EOF
Apply a focused fix pass for cycle $cycle.

Inputs:
- Spec: $SPEC_PATH
- Self-feedback report: $feedback_last

Task:
- Fix the top-priority gaps from the self-feedback report.
- Keep changes targeted and high impact.
- Maintain KO/EN parity where text keys are affected.
- Run ./scripts/run-ai-verify --mode full before finishing.

Output:
- fixed items
- unresolved items
EOF

  cycle_failed="false"

  if ! run_codex_exec "$RESEARCH_WEB_MODE" "$research_prompt" "$research_last" "$research_log" "$RESEARCH_TIMEOUT_SECONDS"; then
    cycle_failed="true"
    log "cycle=$cycle_id failed during research"
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$BUILD_WEB_MODE" "$build_prompt" "$build_last" "$build_log" "$BUILD_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during build"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$FEEDBACK_WEB_MODE" "$feedback_prompt" "$feedback_last" "$feedback_log" "$FEEDBACK_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during feedback"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_codex_exec "$FIX_WEB_MODE" "$fix_prompt" "$fix_last" "$fix_log" "$FIX_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during fix"
    fi
  fi

  if [[ "$cycle_failed" == "false" ]]; then
    if ! run_verify "$verify_log" "$VERIFY_TIMEOUT_SECONDS"; then
      cycle_failed="true"
      log "cycle=$cycle_id failed during verify"
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
    log "cycle=$cycle_id failed (consecutive_failures=$consecutive_failures)"
    if [[ "$consecutive_failures" -ge "$MAX_FAILURES" ]]; then
      log "max failures reached; stopping loop"
      break
    fi
  else
    consecutive_failures=0
    notify_cycle "$cycle" "done" "검증 통과, 로그: $cycle_dir"
    log "cycle=$cycle_id success"
  fi

  cycle=$((cycle + 1))

  if [[ "$SLEEP_SECONDS" -gt 0 ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "+ sleep $SLEEP_SECONDS"
    else
      sleep "$SLEEP_SECONDS"
    fi
  fi
done

finished_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

summary_file="$SESSION_DIR/session-summary.md"
cat > "$summary_file" <<EOF
# Work Session Loop Summary

- session_id: $SESSION_ID
- started_at: $started_at
- finished_at: $finished_at
- spec: $SPEC_PATH
- branch: $branch
- finite_cycles: $CYCLES
- forever_mode: $FOREVER
- stop_file: $STOP_FILE
- max_failures: $MAX_FAILURES
- consecutive_failures_at_end: $consecutive_failures
- logs: $SESSION_DIR
EOF

log "summary=$summary_file"
log "done"
