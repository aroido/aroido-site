#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

TARGET_BRANCH="main"
BRANCH_NAME=""
WORKTREE_PATH=""
MR_TITLE=""
MR_DESCRIPTION_FILE=""
CREATE_MR="true"
DRY_RUN="false"

usage() {
  cat <<USAGE
Usage: ./scripts/long-horizon-bootstrap.sh [options]

Create isolated branch/worktree for one long-horizon session and open Draft MR.

Options:
  --target <branch>             Target branch (default: $TARGET_BRANCH)
  --branch <name>               New branch name (default: chore/long-horizon-<utc>)
  --worktree <path>             Worktree path (default: ../wt-<branch-slug>)
  --title <text>                Draft MR title
  --description-file <path>     MR description file
  --no-mr                       Skip MR creation
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

normalize_path() {
  local input_path="$1"

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$input_path" <<'PY'
import os
import sys
print(os.path.abspath(sys.argv[1]))
PY
    return
  fi

  if command -v realpath >/dev/null 2>&1; then
    realpath "$input_path"
    return
  fi

  echo "$input_path"
}

require_clean_worktree() {
  local dirty=""
  dirty="$(git status --porcelain)"
  if [[ -n "$dirty" ]]; then
    echo "working tree is not clean. commit/stash before bootstrap." >&2
    exit 1
  fi
}

glab_user() {
  env -u GITLAB_TOKEN -u GITLAB_ACCESS_TOKEN -u OAUTH_TOKEN glab "$@"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET_BRANCH="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH_NAME="${2:-}"
      shift 2
      ;;
    --worktree)
      WORKTREE_PATH="${2:-}"
      shift 2
      ;;
    --title)
      MR_TITLE="${2:-}"
      shift 2
      ;;
    --description-file)
      MR_DESCRIPTION_FILE="${2:-}"
      shift 2
      ;;
    --no-mr)
      CREATE_MR="false"
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

if [[ -z "$BRANCH_NAME" ]]; then
  BRANCH_NAME="chore/long-horizon-$(date -u +%Y%m%dT%H%M%SZ)"
fi

branch_slug="${BRANCH_NAME//\//-}"
if [[ -z "$WORKTREE_PATH" ]]; then
  WORKTREE_PATH="../wt-$branch_slug"
fi

if [[ -z "$MR_TITLE" ]]; then
  MR_TITLE="Draft: long-horizon session $branch_slug"
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "must run inside a git repository" >&2
  exit 1
fi

if [[ "$TARGET_BRANCH" == "$BRANCH_NAME" ]]; then
  echo "--target and --branch must be different" >&2
  exit 1
fi

WORKTREE_PATH="$(normalize_path "$WORKTREE_PATH")"

if [[ -e "$WORKTREE_PATH" ]]; then
  echo "worktree path already exists: $WORKTREE_PATH" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "local branch already exists: $BRANCH_NAME" >&2
  exit 1
fi

require_clean_worktree

run_cmd git fetch origin

if [[ "$DRY_RUN" != "true" ]]; then
  if ! git rev-parse --verify --quiet "origin/$TARGET_BRANCH" >/dev/null; then
    echo "target branch not found on origin: $TARGET_BRANCH" >&2
    exit 1
  fi
fi

run_cmd git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" "origin/$TARGET_BRANCH"

if [[ "$CREATE_MR" == "true" ]]; then
  if ! command -v glab >/dev/null 2>&1; then
    echo "glab is required for MR creation" >&2
    exit 1
  fi

  if [[ "$DRY_RUN" != "true" ]]; then
    glab_user auth status >/dev/null
  fi

  run_shell "cd '$WORKTREE_PATH' && git push -u origin '$BRANCH_NAME'"

  mr_desc_file_runtime="$MR_DESCRIPTION_FILE"
  if [[ -z "$mr_desc_file_runtime" ]]; then
    mr_desc_file_runtime="$WORKTREE_PATH/.codex/.long-horizon-mr-description.md"
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "+ cat > '$mr_desc_file_runtime' <<'EOF' ... EOF"
    else
      cat > "$mr_desc_file_runtime" <<EOF
## Long-Horizon Session

- mode: dedicated long-horizon loop
- branch: $BRANCH_NAME
- worktree: $WORKTREE_PATH

## Run

\`\`\`bash
./scripts/long-horizon-loop.sh --hours 24
\`\`\`

## Checkpoint Rule

Each milestone:
1. \`./scripts/long-horizon-checkpoint.sh --session-id <session-id>\`
2. confirm verify passed and MR note posted
EOF
    fi
  fi

  run_shell "cd '$WORKTREE_PATH' && env -u GITLAB_TOKEN -u GITLAB_ACCESS_TOKEN -u OAUTH_TOKEN glab mr create --source-branch '$BRANCH_NAME' --target-branch '$TARGET_BRANCH' --title '$MR_TITLE' --description-file '$mr_desc_file_runtime' --draft --remove-source-branch --yes"
fi

echo
echo "Bootstrap complete"
echo "- branch: $BRANCH_NAME"
echo "- worktree: $WORKTREE_PATH"
if [[ "$CREATE_MR" == "true" ]]; then
  echo "- draft MR: created (or command printed in dry-run)"
else
  echo "- draft MR: skipped (--no-mr)"
fi
echo
echo "Next:"
echo "1) cd $WORKTREE_PATH"
echo "2) ./scripts/long-horizon-loop.sh --hours 24"
echo "3) ./scripts/long-horizon-checkpoint.sh --session-id <session-id>"
