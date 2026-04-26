#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MESSAGES_FILE="${1:-$ROOT_DIR/i18n/messages.json}"

if [[ ! -f "$MESSAGES_FILE" ]]; then
  echo "i18n file not found: $MESSAGES_FILE" >&2
  exit 1
fi

ROOT_DIR="$ROOT_DIR" MESSAGES_FILE="$MESSAGES_FILE" node --input-type=module <<'NODE'
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_LOCALE,
  PUBLIC_LOCALES,
  STATIC_I18N_ROUTES,
} from "./scripts/i18n-locales.mjs";

const rootDir = process.env.ROOT_DIR;
const messagesFile = process.env.MESSAGES_FILE;
const messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
const errors = [];
const expectedLocaleCodes = ["en", "ko", "ja", "zh-Hans"];
const requiredLocaleFields = [
  "code",
  "label",
  "prefix",
  "htmlLang",
  "ogLocale",
  "jsonLdLanguage",
  "hreflang",
  "mediaKey",
];

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function walkFiles(directoryPath, predicate, results = []) {
  if (!fs.existsSync(directoryPath)) {
    return results;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") {
        continue;
      }
      walkFiles(fullPath, predicate, results);
    } else if (entry.isFile() && predicate(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

if (DEFAULT_LOCALE !== "en") {
  errors.push(`DEFAULT_LOCALE must remain en; got ${DEFAULT_LOCALE}`);
}

const configuredCodes = PUBLIC_LOCALES.map((locale) => locale.code);
for (const expectedCode of expectedLocaleCodes) {
  if (!configuredCodes.includes(expectedCode)) {
    errors.push(`missing locale metadata for ${expectedCode}`);
  }
}

for (const locale of PUBLIC_LOCALES) {
  for (const field of requiredLocaleFields) {
    if (!Object.prototype.hasOwnProperty.call(locale, field)) {
      errors.push(`locale ${locale.code || "(unknown)"} missing metadata field ${field}`);
    }
  }
}

for (const route of STATIC_I18N_ROUTES) {
  if (!route.sourcePath || !route.routePath) {
    errors.push(`invalid STATIC_I18N_ROUTES entry: ${JSON.stringify(route)}`);
  }
}

for (const localeCode of expectedLocaleCodes) {
  if (!isPlainObject(messages[localeCode])) {
    errors.push(`missing locale table: ${localeCode}`);
  }
}

const defaultKeys = Object.keys(messages[DEFAULT_LOCALE] || {}).sort();
for (const localeCode of expectedLocaleCodes) {
  const table = messages[localeCode] || {};
  const localeKeys = Object.keys(table).sort();
  const missing = defaultKeys.filter((key) => !localeKeys.includes(key));
  const extra = localeKeys.filter((key) => !defaultKeys.includes(key));
  const empty = Object.entries(table)
    .filter(([, value]) => typeof value === "string" && value.length === 0)
    .map(([key]) => key);

  if (missing.length > 0) {
    errors.push(`${localeCode} missing keys: ${missing.join(", ")}`);
  }
  if (extra.length > 0) {
    errors.push(`${localeCode} extra keys: ${extra.join(", ")}`);
  }
  if (empty.length > 0) {
    errors.push(`${localeCode} empty strings: ${empty.join(", ")}`);
  }
}

const usedKeys = new Set();
const htmlFiles = walkFiles(rootDir, (filePath) => filePath.endsWith(".html"));
for (const filePath of htmlFiles) {
  const source = fs.readFileSync(filePath, "utf8");
  const regexes = [
    /data-i18n="([^"]+)"/g,
    /data-i18n-aria-label="([^"]+)"/g,
    /data-title-key="([^"]+)"/g,
    /data-description-key="([^"]+)"/g,
  ];

  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(source))) {
      usedKeys.add(match[1]);
    }
  }
}

const defaultTable = messages[DEFAULT_LOCALE] || {};
const missingUsedKeys = Array.from(usedKeys)
  .filter((key) => !Object.prototype.hasOwnProperty.call(defaultTable, key))
  .sort();

if (missingUsedKeys.length > 0) {
  errors.push(`HTML references missing i18n keys: ${missingUsedKeys.join(", ")}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`i18n audit passed: ${messagesFile}`);
NODE
