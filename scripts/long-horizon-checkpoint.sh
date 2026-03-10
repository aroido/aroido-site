#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

TARGET_BRANCH="main"
COMMIT_MSG=""
SESSION_ID=""
MR_IID=""
CREATE_MR_IF_MISSING="true"
ADD_MR_NOTE="true"
DRY_RUN="false"

usage() {
  cat <<USAGE
Usage: ./scripts/long-horizon-checkpoint.sh [options]

Run one milestone checkpoint:
  verify -> commit -> push -> ensure MR -> post MR note

Options:
  --commit-msg <text>           Commit message
  --target <branch>             Target branch for MR lookup/create (default: $TARGET_BRANCH)
  --session-id <id>             Optional session id for MR note context
  --mr <iid>                    MR IID override
  --no-create-mr                Do not create MR when missing
  --no-note                     Do not post MR note
  --dry-run                     Print commands only
  -h, --help                    Show help
USAGE
}

run_cmd() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ $*"
  else
    "$@"
  fi
}

run_shell() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ $*"
  else
    bash -lc "$*"
  fi
}

glab_user() {
  env -u GITLAB_TOKEN -u GITLAB_ACCESS_TOKEN -u OAUTH_TOKEN glab "$@"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --commit-msg)
      COMMIT_MSG="${2:-}"
      shift 2
      ;;
    --target)
      TARGET_BRANCH="${2:-}"
      shift 2
      ;;
    --session-id)
      SESSION_ID="${2:-}"
      shift 2
      ;;
    --mr)
      MR_IID="${2:-}"
      shift 2
      ;;
    --no-create-mr)
      CREATE_MR_IF_MISSING="false"
      shift
      ;;
    --no-note)
      ADD_MR_NOTE="false"
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
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "must run inside a git repository" >&2
  exit 1
fi

if ! command -v glab >/dev/null 2>&1; then
  echo "glab is required" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

if [[ "$DRY_RUN" != "true" ]]; then
  glab_user auth status >/dev/null
fi

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" == "main" || "$branch" == "master" || "$branch" == "$TARGET_BRANCH" ]]; then
  echo "refusing checkpoint on protected/target branch: $branch" >&2
  exit 1
fi

if [[ -z "$COMMIT_MSG" ]]; then
  COMMIT_MSG="chore: long-horizon checkpoint $(date -u +%Y-%m-%dT%H:%M:%SZ)"
fi

echo "[1/5] Running full verification..."
run_shell "./scripts/run-ai-verify --mode full"

echo "[2/5] Staging changes..."
run_cmd git add -A

has_staged_changes="false"
if [[ "$DRY_RUN" == "true" ]]; then
  has_staged_changes="true"
else
  if ! git diff --cached --quiet; then
    has_staged_changes="true"
  fi
fi

if [[ "$has_staged_changes" == "true" ]]; then
  echo "[3/5] Creating checkpoint commit..."
  run_cmd git commit -m "$COMMIT_MSG"
else
  echo "[3/5] No staged changes; commit skipped."
fi

echo "[4/5] Pushing branch..."
run_cmd git push -u origin "$branch"

if [[ -z "$MR_IID" && "$DRY_RUN" != "true" ]]; then
  MR_IID="$(glab_user mr list --source-branch "$branch" --target-branch "$TARGET_BRANCH" --output json | jq -r '.[0].iid // empty')"
fi

if [[ -z "$MR_IID" && "$CREATE_MR_IF_MISSING" == "true" ]]; then
  echo "[5/5] Creating draft MR..."
  run_cmd env -u GITLAB_TOKEN -u GITLAB_ACCESS_TOKEN -u OAUTH_TOKEN glab mr create \
    --source-branch "$branch" \
    --target-branch "$TARGET_BRANCH" \
    --title "$COMMIT_MSG" \
    --description "Automated long-horizon checkpoint" \
    --draft \
    --remove-source-branch \
    --yes

  if [[ "$DRY_RUN" != "true" ]]; then
    MR_IID="$(glab_user mr list --source-branch "$branch" --target-branch "$TARGET_BRANCH" --output json | jq -r '.[0].iid // empty')"
  fi
else
  echo "[5/5] MR create step skipped (existing or disabled)."
fi

if [[ "$ADD_MR_NOTE" == "true" ]]; then
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "+ glab mr note <iid> --message '<checkpoint summary>'"
  elif [[ -n "$MR_IID" ]]; then
    note_message=$(
      cat <<EOF
Long-horizon checkpoint completed.

- branch: $branch
- verify: passed (\`./scripts/run-ai-verify --mode full\`)
- session_id: ${SESSION_ID:-n/a}
- time(UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
    )
    glab_user mr note "$MR_IID" --message "$note_message" >/dev/null
    echo "MR note posted: !${MR_IID}"
  else
    echo "MR note skipped: MR IID not available."
  fi
fi

echo "Done. branch=$branch target=$TARGET_BRANCH mr=${MR_IID:-n/a} dry_run=$DRY_RUN"
