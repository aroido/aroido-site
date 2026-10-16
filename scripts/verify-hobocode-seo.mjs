#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {PUBLIC_LOCALES, STATIC_I18N_ROUTES, localizePath} from './i18n-locales.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const sitemap = read('sitemap.xml');
const paths = PUBLIC_LOCALES.map(l => localizePath('/hobocode/', l.code));
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
  for (const alternate of paths) assert(html.includes(`href="https://aroido.com${alternate}"`));
  for (const suffix of ['privacy/', 'support/']) assert(html.includes(`href="${route}${suffix}"`), `Localized footer: ${route}${suffix}`);
  const prefix = route.slice(0, -'hobocode/'.length);
  for (const parent of ['', 'projects/']) assert(read((prefix + parent).slice(1) + 'index.html').includes(`href="${route}" data-i18n="hobocode_public_landing_link"`), `Discovery link: ${prefix}${parent}`);
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
console.log('Hobocode SEO: 4 locales, discovery links, localized footers, and generator isolation passed.');
