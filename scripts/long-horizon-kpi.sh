#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

SESSION_DIR=""
JSONL_FILE="${LONG_HORIZON_KPI_JSONL_FILE:-$ROOT_DIR/.codex/.long-horizon-kpi.jsonl}"
CSV_FILE="${LONG_HORIZON_KPI_CSV_FILE:-$ROOT_DIR/.codex/.long-horizon-kpi.csv}"
APPEND="false"
PRINT_OUTPUT="true"

usage() {
  cat <<USAGE
Usage: ./scripts/long-horizon-kpi.sh [options]

Aggregate one long-horizon session metrics from cycle-report files.

Options:
  --session-dir <path>          Session dir (required, e.g. .codex/long-horizon/<session-id>)
  --jsonl-file <path>           JSONL output file (default: $JSONL_FILE)
  --csv-file <path>             CSV output file (default: $CSV_FILE)
  --append                      Append aggregated record to jsonl/csv outputs
  --no-print                    Do not print json summary to stdout
  -h, --help                    Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --session-dir)
      SESSION_DIR="${2:-}"
      shift 2
      ;;
    --jsonl-file)
      JSONL_FILE="${2:-}"
      shift 2
      ;;
    --csv-file)
      CSV_FILE="${2:-}"
      shift 2
      ;;
    --append)
      APPEND="true"
      shift
      ;;
    --no-print)
      PRINT_OUTPUT="false"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$SESSION_DIR" ]]; then
  echo "--session-dir is required" >&2
  exit 1
fi

if [[ ! -d "$SESSION_DIR" ]]; then
  echo "session dir not found: $SESSION_DIR" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

session_id="$(basename "$SESSION_DIR")"
summary_file="$SESSION_DIR/session-summary.md"

extract_field() {
  local field="$1"
  local file="$2"
  if [[ ! -f "$file" ]]; then
    echo ""
    return
  fi
  awk -F': ' -v key="- ${field}" '$1 == key {print $2; exit}' "$file"
}

started_at="$(extract_field "started_at" "$summary_file")"
finished_at="$(extract_field "finished_at" "$summary_file")"
branch="$(extract_field "branch" "$summary_file")"

metrics_tmp="$(mktemp)"
record_tmp="$(mktemp)"
trap 'rm -f "$metrics_tmp" "$record_tmp"' EXIT

report_files=()
while IFS= read -r -d '' report_file; do
  report_files+=("$report_file")
done < <(find "$SESSION_DIR" -type f -name 'cycle-report.json' -print0)

if [[ "${#report_files[@]}" -eq 0 ]]; then
  echo "no cycle-report.json files found under: $SESSION_DIR" >&2
  exit 1
fi

jq -s '
    def avgarr:
      if length == 0 then 0
      else (add / length)
      end;

    . as $rows
    | ($rows | length) as $total
    | ($rows | map(select(.status == "success"))) as $success_rows
    | ($rows | map(select(.status == "failed"))) as $failed_rows
    | ($rows | map(select(.has_changes == true or .head_changed == true))) as $progress_rows
    | ($rows | map(select(.checkpoint_triggered == true))) as $checkpoint_rows
    | ($rows | map(select(.checkpoint_triggered == true and .checkpoint_ok != true))) as $checkpoint_failed_rows
    | ($failed_rows | map(.failure_stage) | group_by(.) | map({stage: .[0], count: length}) | sort_by(-.count)) as $failure_reasons
    | {
        total_cycles: $total,
        success_cycles: ($success_rows | length),
        failed_cycles: ($failed_rows | length),
        success_rate_percent: (
          if $total == 0 then 0
          else (((($success_rows | length) * 10000) / $total) | round / 100)
          end
        ),
        avg_cycle_duration_sec: ($rows | map(.duration_sec) | avgarr),
        avg_success_cycle_duration_sec: ($success_rows | map(.duration_sec) | avgarr),
        avg_failed_cycle_duration_sec: ($failed_rows | map(.duration_sec) | avgarr),
        progress_cycles: ($progress_rows | length),
        checkpoint_triggered_cycles: ($checkpoint_rows | length),
        checkpoint_failed_cycles: ($checkpoint_failed_rows | length),
        failure_reasons: $failure_reasons
      }
  ' "${report_files[@]}" > "$metrics_tmp"

generated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

jq -n \
  --arg generated_at "$generated_at" \
  --arg session_id "$session_id" \
  --arg session_dir "$SESSION_DIR" \
  --arg started_at "$started_at" \
  --arg finished_at "$finished_at" \
  --arg branch "$branch" \
  --slurpfile metrics "$metrics_tmp" \
  '{
    generated_at: $generated_at,
    session_id: $session_id,
    session_dir: $session_dir,
    started_at: (if $started_at == "" then null else $started_at end),
    finished_at: (if $finished_at == "" then null else $finished_at end),
    branch: (if $branch == "" then null else $branch end),
    metrics: $metrics[0]
  }' > "$record_tmp"

if [[ "$APPEND" == "true" ]]; then
  mkdir -p "$(dirname "$JSONL_FILE")"
  mkdir -p "$(dirname "$CSV_FILE")"

  cat "$record_tmp" >> "$JSONL_FILE"
  echo >> "$JSONL_FILE"

  if [[ ! -f "$CSV_FILE" ]]; then
    cat > "$CSV_FILE" <<'EOF'
generated_at,session_id,branch,started_at,finished_at,total_cycles,success_cycles,failed_cycles,success_rate_percent,avg_cycle_duration_sec,progress_cycles,checkpoint_triggered_cycles,checkpoint_failed_cycles,top_failure_stage,top_failure_count
EOF
  fi

  jq -r '
    [
      .generated_at,
      .session_id,
      (.branch // ""),
      (.started_at // ""),
      (.finished_at // ""),
      .metrics.total_cycles,
      .metrics.success_cycles,
      .metrics.failed_cycles,
      .metrics.success_rate_percent,
      .metrics.avg_cycle_duration_sec,
      .metrics.progress_cycles,
      .metrics.checkpoint_triggered_cycles,
      .metrics.checkpoint_failed_cycles,
      (.metrics.failure_reasons[0].stage // ""),
      (.metrics.failure_reasons[0].count // 0)
    ] | @csv
  ' "$record_tmp" >> "$CSV_FILE"
fi

if [[ "$PRINT_OUTPUT" == "true" ]]; then
  cat "$record_tmp"
fi
