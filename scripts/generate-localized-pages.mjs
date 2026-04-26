#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_LOCALE,
  PUBLIC_LOCALES,
  SITE_URL,
  STATIC_I18N_ROUTES,
  buildHreflangLinks,
  getLocale,
  localizeHref,
  localizePath,
  localizeUrl,
} from "./i18n-locales.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_PATH = path.join(ROOT_DIR, "i18n", "messages.json");
const CHECK_ONLY = process.argv.includes("--check");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readMessages() {
  return JSON.parse(fs.readFileSync(MESSAGES_PATH, "utf8"));
}

function getMessage(messages, localeCode, key) {
  const localeTable = messages[localeCode] || {};
  const defaultTable = messages[DEFAULT_LOCALE] || {};
  const value = Object.prototype.hasOwnProperty.call(localeTable, key)
    ? localeTable[key]
    : defaultTable[key];

  return typeof value === "string" ? value : "";
}

function getRequiredAttribute(html, attributeName, fallback = "") {
  const match = html.match(new RegExp(`\\s${attributeName}="([^"]+)"`));
  return match ? match[1] : fallback;
}

function replaceTagText(html, tagName, value) {
  return html.replace(
    new RegExp(`(<${tagName}\\b[^>]*>)([\\s\\S]*?)(<\\/${tagName}>)`, "i"),
    (_match, openTag, _content, closeTag) => `${openTag}${escapeHtml(value)}${closeTag}`
  );
}

function replaceMetaContentByAttribute(html, attributeName, attributeValue, value) {
  const pattern = new RegExp(
    `(<meta\\b(?=[^>]*\\b${attributeName}="${attributeValue}")[^>]*\\bcontent=")[^"]*(")`,
    "is"
  );
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

function replaceHtmlRoot(html, locale) {
  return html.replace(/<html\b([^>]*)>/i, (_match, attrs) => {
    let nextAttrs = attrs.replace(/\sdata-locale="[^"]*"/i, "");
    if (/\slang="[^"]*"/i.test(nextAttrs)) {
      nextAttrs = nextAttrs.replace(/\slang="[^"]*"/i, ` lang="${locale.htmlLang}"`);
    } else {
      nextAttrs = ` lang="${locale.htmlLang}"${nextAttrs}`;
    }

    return `<html${nextAttrs} data-locale="${locale.code}">`;
  });
}

function buildSeoLinkBlock(routePath, localeCode, indent) {
  const canonicalUrl = localizeUrl(routePath, localeCode);
  const alternateLinks = buildHreflangLinks(routePath)
    .map(
      (link) =>
        `${indent}<link rel="alternate" hreflang="${escapeHtml(link.hreflang)}" href="${escapeHtml(
          link.href
        )}" />`
    )
    .join("\n");

  return `${indent}<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n${alternateLinks}`;
}

function replaceSeoLinks(html, routePath, localeCode) {
  const lines = html.split("\n");
  const canonicalIndex = lines.findIndex((line) => /<link rel="canonical"[^>]*\/>/.test(line));
  const match = canonicalIndex >= 0 ? lines[canonicalIndex].match(/^(\s*)/) : null;
  const indent = match ? match[1] : "    ";
  const block = buildSeoLinkBlock(routePath, localeCode, indent);

  if (canonicalIndex >= 0) {
    let endIndex = canonicalIndex + 1;
    while (endIndex < lines.length && /<link rel="alternate"[^>]*\/>/.test(lines[endIndex])) {
      endIndex += 1;
    }
    lines.splice(canonicalIndex, endIndex - canonicalIndex, ...block.split("\n"));
    return lines.join("\n");
  }

  return html.replace(/<\/title>\s*/i, `</title>\n${block}\n`);
}

function transformJsonLdValue(value, localeCode) {
  const locale = getLocale(localeCode);

  if (Array.isArray(value)) {
    return value.map((entry) => transformJsonLdValue(entry, localeCode));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const nextValue = {};
  for (const [key, entryValue] of Object.entries(value)) {
    if (key === "inLanguage") {
      nextValue[key] = locale.jsonLdLanguage;
      continue;
    }

    if (
      typeof entryValue === "string" &&
      (key === "url" || key === "mainEntityOfPage" || key === "@id") &&
      entryValue.startsWith(SITE_URL)
    ) {
      const parsed = new URL(entryValue);
      nextValue[key] = localizeUrl(`${parsed.pathname}${parsed.search}${parsed.hash}`, localeCode);
      continue;
    }

    nextValue[key] = transformJsonLdValue(entryValue, localeCode);
  }

  return nextValue;
}

function replaceStructuredData(html, localeCode) {
  return html.replace(
    /(<script type="application\/ld\+json">\s*)([\s\S]*?)(\s*<\/script>)/gi,
    (match, openTag, rawJson, closeTag) => {
      try {
        const parsed = JSON.parse(rawJson.trim());
        const transformed = transformJsonLdValue(parsed, localeCode);
        return `${openTag}${JSON.stringify(transformed, null, 8)}${closeTag}`;
      } catch (_error) {
        return match;
      }
    }
  );
}

function replaceDataI18nText(html, messages, localeCode) {
  return html.replace(
    /<([a-z0-9-]+)\b([^>]*\sdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tagName, attrs, key) => {
      const value = getMessage(messages, localeCode, key);
      if (!value) {
        return match;
      }

      return `<${tagName}${attrs}>${escapeHtml(value)}</${tagName}>`;
    }
  );
}

function replaceAriaLabels(html, messages, localeCode) {
  return html.replace(
    /<([a-z0-9-]+)\b([^>]*\sdata-i18n-aria-label="([^"]+)"[^>]*)>/gi,
    (match, tagName, attrs, key) => {
      const value = getMessage(messages, localeCode, key);
      if (!value) {
        return match;
      }

      const escapedValue = escapeHtml(value);
      const nextAttrs = /\saria-label="[^"]*"/i.test(attrs)
        ? attrs.replace(/\saria-label="[^"]*"/i, ` aria-label="${escapedValue}"`)
        : `${attrs} aria-label="${escapedValue}"`;

      return `<${tagName}${nextAttrs}>`;
    }
  );
}

function removeExistingLanguageSwitch(html) {
  return html.replace(/\n\s*<nav class="lang-switch"[\s\S]*?<\/nav>/g, "");
}

function buildLanguageSwitch(messages, localeCode, routePath) {
  const activeLocale = getLocale(localeCode);
  const ariaLabel = getMessage(messages, localeCode, "aria_language_switch") || "Language switch";
  const links = PUBLIC_LOCALES.map((locale) => {
    const activeAttributes =
      locale.code === activeLocale.code ? ' aria-current="true" aria-pressed="true"' : "";
    return `            <a class="lang-btn" href="${escapeHtml(
      localizePath(routePath, locale.code)
    )}" data-lang="${escapeHtml(locale.code)}" hreflang="${escapeHtml(
      locale.hreflang
    )}" lang="${escapeHtml(locale.htmlLang)}"${activeAttributes}>${escapeHtml(locale.label)}</a>`;
  }).join("\n");

  return `          <nav class="lang-switch" aria-label="${escapeHtml(
    ariaLabel
  )}" data-i18n-aria-label="aria_language_switch">\n${links}\n          </nav>`;
}

function insertLanguageSwitch(html, messages, localeCode, routePath) {
  const withoutSwitch = removeExistingLanguageSwitch(html);
  const languageSwitch = buildLanguageSwitch(messages, localeCode, routePath);

  return withoutSwitch.replace(
    /(\n\s*)<div class="theme-switch"(?=\s|>)/i,
    `$1${languageSwitch}$1<div class="theme-switch"`
  );
}

function rewriteInternalLinks(html, localeCode) {
  return html.replace(/\shref="([^"]+)"/g, (match, href) => {
    const nextHref = localizeHref(href, localeCode);
    if (nextHref === href) {
      return match;
    }
    return ` href="${escapeHtml(nextHref)}"`;
  });
}

function makeRootSafeAssets(html) {
  return html
    .replace(/\shref="(?:\.\/|\.\.\/|\.\.\/\.\.\/)*styles\.css"/g, ' href="/styles.css"')
    .replace(/\ssrc="(?:\.\/|\.\.\/|\.\.\/\.\.\/)*script\.js"/g, ' src="/script.js"');
}

function localizeStaticPage(sourceHtml, messages, localeCode, routePath) {
  const locale = getLocale(localeCode);
  const titleKey = getRequiredAttribute(sourceHtml, "data-title-key", "page_title");
  const descriptionKey = getRequiredAttribute(sourceHtml, "data-description-key", "meta_description");
  const title = getMessage(messages, localeCode, titleKey);
  const description = getMessage(messages, localeCode, descriptionKey);

  let html = sourceHtml;
  html = removeExistingLanguageSwitch(html);
  html = rewriteInternalLinks(html, localeCode);
  html = insertLanguageSwitch(html, messages, localeCode, routePath);
  html = replaceHtmlRoot(html, locale);
  html = replaceTagText(html, "title", title);
  html = replaceMetaContentByAttribute(html, "id", "metaDescription", description);
  html = replaceSeoLinks(html, routePath, localeCode);
  html = replaceMetaContentByAttribute(html, "property", "og:locale", locale.ogLocale);
  html = replaceMetaContentByAttribute(html, "property", "og:title", title);
  html = replaceMetaContentByAttribute(html, "property", "og:description", description);
  html = replaceMetaContentByAttribute(html, "property", "og:url", localizeUrl(routePath, localeCode));
  html = replaceMetaContentByAttribute(html, "name", "twitter:title", title);
  html = replaceMetaContentByAttribute(html, "name", "twitter:description", description);
  html = replaceStructuredData(html, localeCode);
  html = replaceDataI18nText(html, messages, localeCode);
  html = replaceAriaLabels(html, messages, localeCode);

  if (localeCode !== DEFAULT_LOCALE) {
    html = makeRootSafeAssets(html);
  }

  return html;
}

function buildOutputMap() {
  const messages = readMessages();
  const output = new Map();

  for (const route of STATIC_I18N_ROUTES) {
    const sourcePath = path.join(ROOT_DIR, route.sourcePath);
    const sourceHtml = fs.readFileSync(sourcePath, "utf8");

    for (const locale of PUBLIC_LOCALES.filter((entry) => entry.code !== DEFAULT_LOCALE)) {
      const relativePath = path.join(locale.pathSegment, route.sourcePath);
      output.set(relativePath, localizeStaticPage(sourceHtml, messages, locale.code, route.routePath));
    }
  }

  return output;
}

function listHtmlFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isDirectory()) {
        return listHtmlFiles(fullPath);
      }
      return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
    });
}

function compareOutputs(outputMap) {
  const differences = [];

  for (const [relativePath, expected] of outputMap.entries()) {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(absolutePath)) {
      differences.push(`Missing localized file: ${relativePath}`);
      continue;
    }

    const current = fs.readFileSync(absolutePath, "utf8");
    if (current !== expected) {
      differences.push(`Outdated localized file: ${relativePath}`);
    }
  }

  const expectedSet = new Set(
    Array.from(outputMap.keys()).filter((entry) => /^(ko|ja|zh-hans)\//.test(entry))
  );
  for (const locale of PUBLIC_LOCALES.filter((entry) => entry.code !== DEFAULT_LOCALE)) {
    const localeRoot = path.join(ROOT_DIR, locale.pathSegment);
    for (const htmlFile of listHtmlFiles(localeRoot)) {
      const relativePath = path.relative(ROOT_DIR, htmlFile);
      if (relativePath.startsWith(`${locale.pathSegment}/blog/`)) {
        continue;
      }
      if (!expectedSet.has(relativePath)) {
        differences.push(`Unexpected localized file: ${relativePath}`);
      }
    }
  }

  return differences;
}

function writeOutputs(outputMap) {
  for (const locale of PUBLIC_LOCALES.filter((entry) => entry.code !== DEFAULT_LOCALE)) {
    fs.rmSync(path.join(ROOT_DIR, locale.pathSegment, "projects"), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT_DIR, locale.pathSegment, "team"), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT_DIR, locale.pathSegment, "contact"), { recursive: true, force: true });
    fs.rmSync(path.join(ROOT_DIR, locale.pathSegment, "index.html"), { force: true });
  }

  for (const [relativePath, content] of outputMap.entries()) {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content, "utf8");
  }
}

function main() {
  const outputMap = buildOutputMap();

  if (CHECK_ONLY) {
    const differences = compareOutputs(outputMap);
    if (differences.length > 0) {
      console.error(differences.join("\n"));
      process.exit(1);
    }
    console.log("Localized static pages are up to date.");
    return;
  }

  writeOutputs(outputMap);
  console.log(`Generated ${outputMap.size} localized static page artifacts.`);
}

main();
