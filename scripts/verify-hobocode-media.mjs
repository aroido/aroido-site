#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {copy} from '../landing/hobocode/content.mjs';
const root = new URL('../',import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('landing/hobocode/captures-2026-10-19.json',root)));
assert.deepEqual(manifest.supportedAppLanguages,['ko','en']);
assert.deepEqual(manifest.pendingAppLanguages,['ja']);
assert.deepEqual(manifest.unsupportedAppLanguages,['zh-Hans']);
assert.equal(manifest.captureSources.ja.status,'development-preview-code-review');
assert.equal(manifest.captureSources.ja.commit,'8255c2cc4247127cbe2d56fc83b9783f4a1b5f72');
assert.equal(manifest.appCommit,'e6d813ab376894cec556441c5d153b924f2c0532');
for(const asset of manifest.assets){
 const bytes=fs.readFileSync(new URL(asset.path,root));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256,asset.path);
}
for(const c of Object.values(copy)){
 const html=fs.readFileSync(new URL((c.prefix+'/hobocode/index.html').slice(1),root),'utf8');
 const locale=c.lang==='ko'?'ko':c.lang==='ja'?'ja':'en';assert.equal(c.mediaLocale,locale);
 assert(html.includes('property="og:image:alt" content="'+c.ogAlt+'"'));
 assert(html.includes('name="twitter:image:alt" content="'+c.ogAlt+'"'));
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
 const app=data['@graph'].find(x=>x['@type']==='SoftwareApplication');
 assert.deepEqual(app.inLanguage,['ko','en']);
 assert.equal(app.operatingSystem,'iOS 18.0 or later');
 for(const key of ['offers','price','aggregateRating','review','datePublished','downloadUrl'])assert(!(key in app));
 for(const key of ['home','map','alert','editor','mark','onboarding'])assert(html.includes(`/hobocode/media/${locale}/screen-${key}.webp`));
 assert(html.includes(`/hobocode/media/${locale}/notification.webp`));
 assert(html.includes(`<video controls playsinline preload="none"`));
 assert(html.includes(`/hobocode/media/${locale}/walkthrough.mp4`));
 for(const path of [c.prefix+'/',c.prefix+'/projects/',c.prefix+'/hobocode/support/',c.prefix+'/hobocode/privacy/'])assert(html.includes(`href="${path}"`));
 for(const kind of ['support','privacy']){
  const policy=fs.readFileSync(new URL((c.prefix+`/hobocode/${kind}/index.html`).slice(1),root),'utf8');
  assert(policy.includes(`href="${c.prefix}/hobocode/" data-i18n="hobocode_public_landing_link"`));
 }
}
console.log(`Hobocode media: ${manifest.assets.length} hashes, 4 localized routes, honest app-language scope, schema and return links passed.`);
