#!/usr/bin/env bash
set -euo pipefail

REPO="${WORK_SESSION_REPO:-}"
DRY_RUN="false"

usage() {
  cat <<USAGE
Usage: work-session-bootstrap-labels.sh [options]

Options:
  --repo <owner/repo>   Target repository (optional)
  --dry-run             Show planned creations only
  -h, --help            Show help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO="${2:-}"
      shift 2
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

if ! command -v glab >/dev/null 2>&1; then
  echo "glab is required"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

if [[ -n "$REPO" ]]; then
  existing="$(glab label list --repo "$REPO" -P 200 -F json | jq -r '.[].name // empty')"
else
  existing="$(glab label list -P 200 -F json | jq -r '.[].name // empty')"
fi

ensure_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if printf '%s\n' "$existing" | rg -Fx -- "$name" >/dev/null; then
    echo "[skip] $name already exists"
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[plan] create label: $name"
    return
  fi

  if [[ -n "$REPO" ]]; then
    glab label create --repo "$REPO" --name "$name" --color "$color" --description "$description" >/dev/null
  else
    glab label create --name "$name" --color "$color" --description "$description" >/dev/null
  fi
  echo "[create] $name"
}

ensure_label "Ready" "1D76DB" "Work Session ready queue"
ensure_label "In progress" "0E8A16" "Work Session in progress"
ensure_label "In review" "FBCA04" "Waiting for review/merge checks"
ensure_label "Done" "5319E7" "Completed and merged"
ensure_label "blocked" "B60205" "Blocked by external dependency"
ensure_label "failed" "D93F0B" "Failed in current work session"

echo "done"
