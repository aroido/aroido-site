#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {copy} from '../landing/hobocode/content.mjs';
const root = new URL('../',import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('landing/hobocode/captures-2026-10-19.json',root)));
assert.deepEqual(manifest.supportedAppLanguages,['ko','en','ja']);
assert.deepEqual(manifest.pendingAppLanguages,[]);
assert.deepEqual(manifest.unsupportedAppLanguages,['zh-Hans']);
assert.equal(manifest.captureSources.ja.status,'current-main');
assert.equal(manifest.captureSources.ja.commit,'65767a6b44c5fba27e20f97ea48a6da21760aab5');
assert.equal(manifest.appCommit,'65767a6b44c5fba27e20f97ea48a6da21760aab5');
assert.equal(manifest.personalDataUsed,false);
assert.equal(manifest.fictionalNotes,true);
assert.equal(manifest.locations.en.city,'San Francisco');
assert.equal(manifest.locations.en.name,'Ferry Building');
assert.equal(manifest.locations.ja.city,'Tokyo');
assert.equal(manifest.locations.ja.name,'東京国立博物館');
for(const locale of ['en','ja']){
 assert(manifest.captureSources[locale].locationMode.includes('--composer-native-location'));
 assert(manifest.captureSources[locale].locationMode.includes('--service-region-international'));
 for(const asset of manifest.assets.filter(x=>x.contentLanguage===locale)){
  const context=asset.path.includes('onboarding')?'built-in-fictional-onboarding':manifest.locations[locale].city;
  assert.equal(asset.placeContext,context);
  if(!asset.path.includes('onboarding'))assert.equal(asset.captureDataPatchSHA256,manifest.captureDataPatches[locale]);
 }
}

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
 assert.deepEqual(app.inLanguage,['ko','en','ja']);
 assert.equal(app.operatingSystem,'iOS 18.0 or later');
 for(const key of ['offers','price','aggregateRating','review','datePublished','downloadUrl'])assert(!(key in app));
 for(const key of ['home','map','alert','editor','mark','onboarding'])assert(html.includes(`/hobocode/media/${locale}/screen-${key}.webp`));
 assert(html.includes(`/hobocode/media/${locale}/notification.webp`));
 assert(html.includes(`<video controls playsinline preload="none"`));
 assert(html.includes(`/hobocode/media/${locale}/walkthrough.mp4`));
 assert(html.includes(`/hobocode/media/${locale}/promo.mp4`)&&html.includes(`/hobocode/media/${locale}/promo-poster.webp`)&&html.includes('<p class="demo-disclosure">'+c.filmNote+'</p>'));
 for(const path of [c.prefix+'/',c.prefix+'/projects/',c.prefix+'/hobocode/support/',c.prefix+'/hobocode/privacy/'])assert(html.includes(`href="${path}"`));
 for(const kind of ['support','privacy']){
  const policy=fs.readFileSync(new URL((c.prefix+`/hobocode/${kind}/index.html`).slice(1),root),'utf8');
  assert(policy.includes(`href="${c.prefix}/hobocode/" data-i18n="hobocode_public_landing_link"`));
 }
}
console.log(`Hobocode media: ${manifest.assets.length} hashes, 4 localized routes, honest app-language scope, schema and return links passed.`);
