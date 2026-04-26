#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_LOCALE,
  PUBLIC_LOCALES,
  SITE_URL,
  STATIC_I18N_ROUTES,
  buildHreflangLinks,
  localizePath,
  localizeUrl,
} from "./i18n-locales.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITEMAP_PATH = path.join(ROOT_DIR, "sitemap.xml");
const errors = [];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function listHtmlFiles(directoryPath, results = []) {
  if (!fs.existsSync(directoryPath)) {
    return results;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      listHtmlFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

function routePathFromIndexFile(relativePath) {
  if (relativePath === "index.html") {
    return "/";
  }

  return `/${relativePath.replace(/\/index\.html$/, "/")}`;
}

function relativeIndexPath(routePath, localeCode) {
  const localizedPath = localizePath(routePath, localeCode);
  const trimmed = localizedPath.replace(/^\/|\/$/g, "");
  return trimmed ? path.join(trimmed, "index.html") : "index.html";
}

function collectBlogRoutes() {
  return listHtmlFiles(path.join(ROOT_DIR, "blog"))
    .map((filePath) => path.relative(ROOT_DIR, filePath))
    .sort()
    .map(routePathFromIndexFile);
}

function getMetaContent(html, selectorAttribute, selectorValue) {
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${selectorAttribute}="${escapeRegex(selectorValue)}")[^>]*\\bcontent="([^"]*)"`,
    "i"
  );
  const match = html.match(pattern);
  return match ? match[1] : "";
}

function assertContains(label, haystack, needle) {
  if (!haystack.includes(needle)) {
    errors.push(`${label} missing ${needle}`);
  }
}

function verifyPage(routePath, locale) {
  const relativePath = relativeIndexPath(routePath, locale.code);
  const absolutePath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`missing localized page: ${relativePath}`);
    return;
  }

  const html = fs.readFileSync(absolutePath, "utf8");
  const label = `${relativePath}`;
  const canonicalUrl = localizeUrl(routePath, locale.code);

  assertContains(label, html, `<html lang="${locale.htmlLang}`);
  assertContains(label, html, `<link rel="canonical" href="${canonicalUrl}"`);
  assertContains(label, html, `<meta property="og:locale" content="${locale.ogLocale}"`);
  assertContains(label, html, `"inLanguage": "${locale.jsonLdLanguage}"`);

  for (const link of buildHreflangLinks(routePath)) {
    assertContains(
      label,
      html,
      `<link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`
    );
  }

  if (/\?lang=/.test(html)) {
    errors.push(`${label} contains stale ?lang= hreflang or link artifact`);
  }

  if (/noindex/i.test(html)) {
    errors.push(`${label} must not be noindex`);
  }

  if (locale.code !== DEFAULT_LOCALE) {
    const anchorPattern = /<a\b[^>]*\shref="(\/(?:projects|team|contact|blog)(?:\/[^"]*|\/?|#[^"]*)?)"[^>]*>/g;
    let anchorMatch;
    while ((anchorMatch = anchorPattern.exec(html))) {
      const anchorHtml = anchorMatch[0];
      if (/\bclass="[^"]*\blang-btn\b/.test(anchorHtml) || /\sdata-lang="/.test(anchorHtml)) {
        continue;
      }
      errors.push(`${label} contains unlocalized internal link ${anchorMatch[1]}`);
    }
  }

  const ogLocale = getMetaContent(html, "property", "og:locale");
  if (ogLocale !== locale.ogLocale) {
    errors.push(`${label} has og:locale=${ogLocale || "(missing)"}, expected ${locale.ogLocale}`);
  }
}

function verifySitemap(routePaths) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    errors.push("missing sitemap.xml");
    return;
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  for (const routePath of routePaths) {
    for (const locale of PUBLIC_LOCALES) {
      const expectedUrl = localizeUrl(routePath, locale.code);
      assertContains("sitemap.xml", sitemap, `<loc>${expectedUrl}</loc>`);
    }
  }
}

function main() {
  const routePaths = Array.from(
    new Set([...STATIC_I18N_ROUTES.map((route) => route.routePath), ...collectBlogRoutes()])
  ).sort();

  for (const routePath of routePaths) {
    for (const locale of PUBLIC_LOCALES) {
      verifyPage(routePath, locale);
    }
  }

  verifySitemap(routePaths);

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(`Localized output verified for ${routePaths.length} routes across ${PUBLIC_LOCALES.length} locales.`);
}

main();
