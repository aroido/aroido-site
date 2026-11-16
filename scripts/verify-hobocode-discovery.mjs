#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
const messages = JSON.parse(fs.readFileSync('i18n/messages.json', 'utf8'));
for (const [locale, prefix, storefront] of [['en', '', 'us'], ['ko', 'ko/', 'kr'], ['ja', 'ja/', 'jp'], ['zh-Hans', 'zh-hans/', 'cn']]) {
  for (const route of ['index.html', 'projects/index.html']) {
    const file = prefix + route;
    const html = fs.readFileSync(file, 'utf8');
    const section = html.match(/<section id="hobocode"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, file);
    for (const key of ['eyebrow', 'status', 'release', 'download']) {
      assert.ok(section.includes(messages[locale][`hobocode_discovery_${key}`]), `${file}: ${key}`);
    }
    assert.ok(section.includes(`href="https://apps.apple.com/${storefront}/app/id6820969894" data-hobocode-store`), `${file}: default store CTA`);
    assert.ok(!/ppid=|utm_|Coming soon|출시 예정|近日公開|暂未|not available yet|다운로드할 수 없습니다/.test(section), `${file}: stale or campaign copy`);
    for (const suffix of ['', 'support/', 'privacy/']) {
      assert.ok(section.includes(`href="/${prefix}hobocode/${suffix}"`), `${file}: retained ${suffix || 'landing'}`);
    }
    assert.ok(section.includes(messages[locale].hobocode_discovery_languages), `${file}: language scope`);
  }
}
console.log('Hobocode discovery: 8 cards, localized default store links, released copy, support/privacy and language scope passed.');
