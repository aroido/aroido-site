#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_files=(
  "README.md"
  "projects/vibesmith/index.html"
  "i18n/messages.json"
  "script.js"
)

for file in "${required_files[@]}"; do
  test -f "$file"
done

rg -q --fixed-strings "https://github.com/aroido/homebrew-vibesmith.git" README.md projects/vibesmith/index.html i18n/messages.json
rg -q --fixed-strings "data-community-release-status" projects/vibesmith/index.html
rg -q --fixed-strings "vibe_download_release_status_prerelease" i18n/messages.json
rg -q --fixed-strings "communityReleaseStatusNode" script.js

if rg -q --fixed-strings "brew tap aroido/vibesmith https://github.com/aroido/vibesmith" README.md projects/vibesmith/index.html i18n/messages.json; then
  echo "Found stale Homebrew tap command pointing at the app repository." >&2
  exit 1
fi
