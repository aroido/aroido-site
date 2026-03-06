#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MESSAGES_FILE="${1:-$ROOT_DIR/i18n/messages.json}"

if [[ ! -f "$MESSAGES_FILE" ]]; then
  echo "i18n file not found: $MESSAGES_FILE" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

if ! jq empty "$MESSAGES_FILE" >/dev/null 2>&1; then
  echo "invalid json: $MESSAGES_FILE" >&2
  exit 1
fi

if [[ "$(jq -r 'has("en") and has("ko")' "$MESSAGES_FILE")" != "true" ]]; then
  echo "both en and ko locales are required" >&2
  exit 1
fi

en_keys_file="$(mktemp)"
ko_keys_file="$(mktemp)"
trap 'rm -f "$en_keys_file" "$ko_keys_file"' EXIT

jq -r '.en | keys[]' "$MESSAGES_FILE" | sort > "$en_keys_file"
jq -r '.ko | keys[]' "$MESSAGES_FILE" | sort > "$ko_keys_file"

if ! diff -u "$en_keys_file" "$ko_keys_file" >/dev/null; then
  echo "locale key mismatch between en and ko" >&2
  diff -u "$en_keys_file" "$ko_keys_file" || true
  exit 1
fi

if [[ "$(jq -r '[.en[] | strings | select(length == 0)] | length' "$MESSAGES_FILE")" != "0" ]]; then
  echo "empty string found in en locale" >&2
  exit 1
fi

if [[ "$(jq -r '[.ko[] | strings | select(length == 0)] | length' "$MESSAGES_FILE")" != "0" ]]; then
  echo "empty string found in ko locale" >&2
  exit 1
fi

echo "i18n audit passed: $MESSAGES_FILE"
