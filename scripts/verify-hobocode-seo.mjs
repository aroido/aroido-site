#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {PUBLIC_LOCALES, STATIC_I18N_ROUTES, localizePath} from './i18n-locales.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const sitemap = read('sitemap.xml');
const paths = PUBLIC_LOCALES.map(l => localizePath('/hobocode/', l.code));
const storefronts = {'/hobocode/': 'us', '/ko/hobocode/': 'kr', '/ja/hobocode/': 'jp', '/zh-hans/hobocode/': 'cn'};
assert(!STATIC_I18N_ROUTES.some(r => r.routePath === '/hobocode/'), 'Custom landing must not become translation input');
assert(!sitemap.includes('<loc>https://aroido.com/hobocode/get/</loc>'), 'noindex redirect must stay out of sitemap');
const snapshots = new Map();
for (const route of paths) {
  const file = route.slice(1) + 'index.html';
  const html = read(file);
  snapshots.set(file, html);
  assert.equal(sitemap.split(`<loc>https://aroido.com${route}</loc>`).length - 1, 1, `Sitemap entry: ${route}`);
  assert(html.includes(`<link rel="canonical" href="https://aroido.com${route}">`), `Canonical: ${route}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert(!/<meta[^>]+content="[^"]*noindex/i.test(html));
  const storeUrl = `https://apps.apple.com/${storefronts[route]}/app/id6820969894`;
  const storeLinks = [...html.matchAll(/<a\b[^>]*href="(https:\/\/apps\.apple\.com\/[^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(storeLinks, [storeUrl, storeUrl], `Header and closing App Store links: ${route}`);
  assert(html.includes(`<a class="badge" href="${storeUrl}">`), `Semantic header download link: ${route}`);
  for (const alternate of paths) assert(html.includes(`href="https://aroido.com${alternate}"`));
  for (const suffix of ['privacy/', 'support/']) assert(html.includes(`href="${route}${suffix}"`), `Localized footer: ${route}${suffix}`);
  const prefix = route.slice(0, -'hobocode/'.length);
  for (const parent of ['', 'projects/']) assert(read((prefix + parent).slice(1) + 'index.html').includes(`href="${route}" data-i18n="hobocode_public_landing_link"`), `Discovery link: ${prefix}${parent}`);
}

// Execute the generated share-page script with browser inputs, without making network requests.
const redirectScript = read('hobocode/get/index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
const appStore = country => `https://apps.apple.com/${country}/app/id6820969894`;
const redirectCases = [
  {ua: 'iPhone', languages: ['ko-KR', 'en-US'], expected: appStore('kr')},
  {ua: 'iPhone', languages: ['ja-JP'], expected: appStore('jp')},
  {ua: 'Macintosh', touch: 5, languages: ['ja-JP'], expected: appStore('jp')},
  {ua: 'iPhone', languages: ['en-US', 'ko-KR'], expected: appStore('us')},
  {ua: 'iPhone', languages: ['fr-FR', 'ja-JP'], expected: appStore('jp')},
  {ua: 'iPhone', languages: ['zh-CN'], expected: appStore('cn')},
  {ua: 'iPhone', languages: ['fr-FR'], expected: appStore('us')},
  {ua: 'iPhone', languages: [], language: 'ko-KR', expected: appStore('kr')},
  {ua: 'Android', languages: ['ja-JP'], expected: '/ja/hobocode/?utm_source=test'},
  {ua: 'Macintosh', touch: 0, languages: ['ko-KR'], expected: '/ko/hobocode/?utm_source=test'},
  {ua: 'desktop', languages: ['fr-FR'], expected: '/hobocode/?utm_source=test'},
];
for (const test of redirectCases) {
  const destinations = [];
  runInNewContext(redirectScript, {
    navigator: {userAgent: test.ua, maxTouchPoints: test.touch || 0, languages: test.languages, language: test.language || ''},
    location: {search: '?utm_source=test', replace: url => destinations.push(url)},
  });
  assert.deepEqual(destinations, [test.expected], `Shared App Store routing: ${JSON.stringify(test)}`);
}

// Exercise both generators in an isolated fixture. They must never rewrite custom landings.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'hobocode-seo-'));
try {
  for (const dir of ['scripts', 'content', 'i18n']) fs.cpSync(path.join(root, dir), path.join(fixture, dir), {recursive: true});
  for (const file of [...STATIC_I18N_ROUTES.map(r => r.sourcePath), ...snapshots.keys()]) {
    fs.mkdirSync(path.dirname(path.join(fixture, file)), {recursive: true});
    fs.copyFileSync(path.join(root, file), path.join(fixture, file));
  }
  for (const script of ['generate-localized-pages.mjs', 'build-blog.mjs']) execFileSync(process.execPath, [path.join(fixture, 'scripts', script)], {cwd: fixture, stdio: 'pipe'});
  for (const [file, html] of snapshots) assert.equal(fs.readFileSync(path.join(fixture, file), 'utf8'), html, `Generator overwrote ${file}`);
  const generatedSitemap = fs.readFileSync(path.join(fixture, 'sitemap.xml'), 'utf8');
  for (const route of paths) assert.equal(generatedSitemap.split(`<loc>https://aroido.com${route}</loc>`).length - 1, 1);
} finally {
  fs.rmSync(fixture, {recursive: true, force: true});
}
console.log('Hobocode SEO: 4 locales, localized store CTAs, 11 share-link routes, discovery links, footers, and generator isolation passed.');
