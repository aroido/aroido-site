#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

STATE_FILE="$ROOT_DIR/.codex/.last-session.json"
SUMMARY_FILE="$ROOT_DIR/.work-session-summary.md"
JSON_REPORT_FILE="$ROOT_DIR/.codex/.work-session-kpi.json"
APPEND_MODE=true

usage() {
  cat <<USAGE
Usage: work-session-kpi.sh [options]

Options:
  --state-file <path>     Session state JSON path (default: $STATE_FILE)
  --summary-file <path>   Summary markdown path (default: $SUMMARY_FILE)
  --json-report <path>    KPI JSON output path (default: $JSON_REPORT_FILE)
  --overwrite-summary     Overwrite summary file instead of append
  -h, --help              Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --state-file)
      STATE_FILE="${2:-}"
      shift 2
      ;;
    --summary-file)
      SUMMARY_FILE="${2:-}"
      shift 2
      ;;
    --json-report)
      JSON_REPORT_FILE="${2:-}"
      shift 2
      ;;
    --overwrite-summary)
      APPEND_MODE=false
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

if [[ ! -f "$STATE_FILE" ]]; then
  echo "State file not found: $STATE_FILE"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

mkdir -p "$(dirname "$SUMMARY_FILE")"
mkdir -p "$(dirname "$JSON_REPORT_FILE")"

KPI_JSON="$(jq -n --slurpfile state "$STATE_FILE" --arg state_file "$STATE_FILE" '
  def safe_len(path): (($state[0] | path) // []) | length;
  def parse_ts(v): (v | fromdateiso8601?);
  def minutes_since(ts): (parse_ts(ts) as $epoch | if $epoch == null then null else ((now - $epoch) / 60) end);

  $state[0] as $s |
  (safe_len(.completed_task_ids)) as $completed |
  (safe_len(.failed_task_ids)) as $failed |
  (safe_len(.skipped_due_to_owner_lock_ids)) as $owner_lock_skipped |
  (safe_len(.skipped_due_to_dependency_ids)) as $dependency_skipped |
  (($s.retry_count // 0)) as $retry |
  ((parse_ts($s.started_at) // now)) as $start_epoch |
  ((parse_ts($s.updated_at) // now)) as $end_epoch |
  ((($end_epoch - $start_epoch) / 60) | if . <= 0 then 1 else floor end) as $duration_minutes |
  ($completed + $failed + $owner_lock_skipped + $dependency_skipped) as $total_attempted |
  (
    [($s.pending_review_items // [])[]? | minutes_since(.in_review_since)]
    | map(select(. != null))
  ) as $pending_minutes |
  {
    generated_at: (now | todateiso8601),
    state_file: $state_file,
    started_at: ($s.started_at // null),
    updated_at: ($s.updated_at // null),
    duration_minutes: $duration_minutes,
    type_filter: ($s.type_filter // "all"),
    parallel_workers: ($s.parallel_workers // 1),
    completed_count: $completed,
    failed_count: $failed,
    owner_lock_skipped_count: $owner_lock_skipped,
    dependency_skipped_count: $dependency_skipped,
    retry_count: $retry,
    in_review_pending_count: ($pending_minutes | length),
    throughput_per_hour: ((($completed * 60) / $duration_minutes) | tonumber),
    retry_rate_percent: (if $total_attempted > 0 then (($retry * 100) / $total_attempted) else 0 end),
    owner_lock_skip_rate_percent: (if $total_attempted > 0 then (($owner_lock_skipped * 100) / $total_attempted) else 0 end),
    in_review_pending_max_minutes: (if ($pending_minutes | length) > 0 then ($pending_minutes | max | floor) else 0 end),
    in_review_pending_avg_minutes: (if ($pending_minutes | length) > 0 then (($pending_minutes | add) / ($pending_minutes | length) | floor) else 0 end)
  }
')"

printf '%s\n' "$KPI_JSON" > "$JSON_REPORT_FILE"

BLOCK_CONTENT="$(cat <<EOT
## Work Session KPI ($(date -u +%Y-%m-%dT%H:%M:%SZ))

- started_at: $(echo "$KPI_JSON" | jq -r '.started_at // ""')
- finished_at: $(echo "$KPI_JSON" | jq -r '.updated_at // ""')
- duration_minutes: $(echo "$KPI_JSON" | jq -r '.duration_minutes')
- type_filter: $(echo "$KPI_JSON" | jq -r '.type_filter')
- parallel_workers: $(echo "$KPI_JSON" | jq -r '.parallel_workers')
- completed: $(echo "$KPI_JSON" | jq -r '.completed_count')
- failed: $(echo "$KPI_JSON" | jq -r '.failed_count')
- skipped_due_to_owner_lock: $(echo "$KPI_JSON" | jq -r '.owner_lock_skipped_count')
- skipped_due_to_dependency: $(echo "$KPI_JSON" | jq -r '.dependency_skipped_count')
- in_review_pending: $(echo "$KPI_JSON" | jq -r '.in_review_pending_count')
- kpi_throughput_per_hour: $(echo "$KPI_JSON" | jq -r '.throughput_per_hour | @text')
- kpi_retry_rate_percent: $(echo "$KPI_JSON" | jq -r '.retry_rate_percent | @text')
- kpi_owner_lock_skip_rate_percent: $(echo "$KPI_JSON" | jq -r '.owner_lock_skip_rate_percent | @text')
- kpi_in_review_pending_max_minutes: $(echo "$KPI_JSON" | jq -r '.in_review_pending_max_minutes')
- kpi_in_review_pending_avg_minutes: $(echo "$KPI_JSON" | jq -r '.in_review_pending_avg_minutes')
- kpi_json_report: $JSON_REPORT_FILE
EOT
)"

if [[ "$APPEND_MODE" == "true" ]]; then
  if [[ -f "$SUMMARY_FILE" ]]; then
    printf '\n\n%s\n' "$BLOCK_CONTENT" >> "$SUMMARY_FILE"
  else
    printf '%s\n' "$BLOCK_CONTENT" > "$SUMMARY_FILE"
  fi
else
  printf '%s\n' "$BLOCK_CONTENT" > "$SUMMARY_FILE"
fi

echo "kpi_json_report: $JSON_REPORT_FILE"
echo "summary_file: $SUMMARY_FILE"

exit 0
