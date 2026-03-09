#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAND_KIT_DIR="${AROIDO_BRAND_KIT_DIR:-$HOME/code/aroido-brand-kit}"
SOURCE_DIR="$BRAND_KIT_DIR/source"
EXPORT_DIR="$BRAND_KIT_DIR/exports/flame-raster"
SITE_BRAND_DIR="$ROOT_DIR/assets/aroido-brand"

if [[ ! -d "$SOURCE_DIR" || ! -d "$EXPORT_DIR" ]]; then
  echo "Brand kit not found at $BRAND_KIT_DIR" >&2
  exit 1
fi

mkdir -p "$SITE_BRAND_DIR/flame-source" "$SITE_BRAND_DIR/flame-raster"
cp "$SOURCE_DIR"/aroido-flame-*.png "$SITE_BRAND_DIR/flame-source/"
cp "$EXPORT_DIR"/* "$SITE_BRAND_DIR/flame-raster/"

echo "Synced Aroido flame assets from $BRAND_KIT_DIR"
