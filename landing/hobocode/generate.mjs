import fs from 'node:fs';
import {copy} from './content.mjs';
import {paintPath, silhouette, townSvg, wearSvg} from './art.mjs';

// Builds /hobocode/ (4 locales) as static HTML plus generated SVG art. --check compares instead of writing.
const root = '../..', m = '/hobocode/media/';
const VIEW = '20 170 380 400', PIN = [262, 236], ROUTE = 'M120 556L120 300L262 300L262 268';
const files = new Map();
const tilt = [-1, 0.8, -0.6, 1.1, -1.2, 0.5];
const town = '<svg class="town-tile" viewBox="0 0 1280 150" width="1280" height="150" focusable="false">' + silhouette() + '</svg>';
const mark = sign => '<i class="mk" style="--sign:url(' + m + (sign ? 'sign-' + sign : 'chalk-mark') + '.png)"></i>';
const face = (sign, place, dist, body, date) => '<div class="face"><p class="memo-row">' + mark(sign) + '<span class="memo-place">' + place + '</span><span class="memo-dist" aria-hidden="true">' + dist + '</span></p><p class="memo-body">' + body + '</p><p class="memo-date">' + date + '</p></div>';
const memos = c => c.memos.map(([sign, place, dist, body, date], i) => '<li class="memo" style="--tilt:' + tilt[i] + 'deg"><svg class="patch" viewBox="0 0 280 156" preserveAspectRatio="none" focusable="false" aria-hidden="true"><path d="' + paintPath(280, 156, i + 1) + '"/></svg>' + face(sign, place, dist, body, date) + '</li>').join('');

for (const c of Object.values(copy)) {
  const path = c.prefix + '/hobocode/', h = c.heroMemo;
  const html = '<!doctype html><html lang="' + c.lang + '"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + c.title + '</title><meta name="description" content="' + c.description + '"><meta name="theme-color" content="#0e0e0e">' +
    '<meta property="og:title" content="' + c.title + '"><meta property="og:description" content="' + c.description + '"><meta property="og:type" content="website"><meta property="og:url" content="https://aroido.com' + path + '"><meta property="og:image" content="https://aroido.com' + m + 'og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">' +
    '<link rel="canonical" href="https://aroido.com' + path + '">' + Object.values(copy).map(l => '<link rel="alternate" hreflang="' + l.lang + '" href="https://aroido.com' + l.prefix + '/hobocode/">').join('') + '<link rel="alternate" hreflang="x-default" href="https://aroido.com/hobocode/">' +
    '<link rel="icon" href="' + m + 'app-icon.png"><link rel="preload" as="image" href="' + m + 'intro-start.jpg"><link rel="stylesheet" href="/hobocode/landing.css"></head><body>' +
    '<a class="skip" href="#main">' + c.skip + '</a><header><a class="brand" href="' + path + '" aria-label="Hobocode"><img class="brand-symbol" src="' + m + 'chalk-mark.png" width="34" height="34" alt=""><img class="brand-wordmark" src="' + m + 'wordmark.png" width="1144" height="231" alt="hobo code"></a><nav class="toplinks" aria-label="Hobocode"><a class="about" href="#how">' + c.about + '</a><span class="badge">' + c.soon + '</span></nav></header><main id="main">' +
    // 1. Hero: the app's onboarding intro film, stopping at the chalk mark with a painted note.
    '<section class="hero" aria-labelledby="hero-title"><div class="hero-visual" data-hero><video class="hero-video" src="' + m + 'intro.mp4" poster="' + m + 'intro-start.jpg" data-stop-poster="' + m + 'intro-end.jpg" width="720" height="1280" autoplay muted playsinline preload="auto" aria-hidden="true"></video><div class="arrive-ring" aria-hidden="true"></div>' +
    '<div class="paint-memo" aria-hidden="true"><svg class="patch" viewBox="0 0 300 150" preserveAspectRatio="none" focusable="false"><path d="' + paintPath(300, 150, 1000) + '"/></svg>' + face('', h.place, h.dist, h.body, h.date) + '</div><button class="replay" type="button" hidden>' + c.replay + '</button></div>' +
    '<div class="hero-copy"><p class="eyebrow">' + c.eyebrow + '</p><h1 id="hero-title">' + c.hero + '</h1><p class="hero-intro">' + c.intro + '</p><a class="down" href="#how">' + c.explore + '<span aria-hidden="true">↓</span></a></div></section>' +
    // 2. Memo wall: rail-town silhouette with white paint notes, like the app home.
    '<section class="wall" id="how" aria-labelledby="wall-title"><div class="section-copy"><h2 id="wall-title">' + c.wallTitle + '</h2><p>' + c.wallBody + '</p></div><div class="wall-band" data-wall><div class="town-track" aria-hidden="true">' + town + town + '</div>' +
    '<div class="memo-track" tabindex="0" role="region" aria-label="' + c.wallLabel + '"><ul class="memos">' + memos(c) + '</ul><ul class="memos" aria-hidden="true">' + memos(c) + '</ul></div><button class="motion-toggle" type="button" data-pause="' + c.pause + '" data-play="' + c.play + '" hidden>' + c.pause + '</button></div></section>' +
    // 3. Arrival: illustrated map driven by scroll, ending with an actual Lock Screen notification.
    '<section class="arrive" id="alerts" aria-labelledby="arrive-title" data-arrive data-arrived data-step="2"><div class="arrive-stage"><div class="arrive-copy"><h2 id="arrive-title">' + c.arriveTitle + '</h2><ol class="steps">' + c.steps.map((s, i) => '<li data-i="' + i + '"><b>' + s[0] + '</b><span>' + s[1] + '</span></li>').join('') + '</ol><p class="conditions">' + c.conditions + '</p></div>' +
    '<div class="arrive-scene"><img class="town" src="' + m + 'town.svg" width="380" height="400" alt="" loading="lazy"><svg class="scene-overlay" viewBox="' + VIEW + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g class="cam">' +
    '<path class="trail" d="' + ROUTE + '"/><circle class="radius" cx="' + PIN[0] + '" cy="' + PIN[1] + '" r="56"/><circle class="arr-ring" cx="' + PIN[0] + '" cy="' + PIN[1] + '" r="24"/><text class="place" x="' + (PIN[0] - 22) + '" y="' + (PIN[1] + 4) + '" text-anchor="end">' + c.place + '</text>' +
    '<image href="' + m + 'chalk-mark.png" x="' + (PIN[0] - 15) + '" y="' + (PIN[1] - 15) + '" width="30" height="30"/><g transform="translate(' + (PIN[0] + 13) + ' ' + (PIN[1] - 21) + ')"><rect x="-1" width="16" height="15" rx="3" fill="#CC6633"/><text class="count" x="7" y="11.5" text-anchor="middle">1</text></g>' +
    '<circle class="glow" cx="262" cy="268" r="20"/><circle class="dot" cx="262" cy="268" r="7"/></g></svg>' +
    '<div class="notif"><img src="' + m + 'notification.webp" width="1201" height="284" alt="' + c.notifAlt + '" loading="lazy"></div></div></div></section>' +
    // 4. Actual development screens.
    '<section class="screens" aria-labelledby="screens-title"><div class="section-copy"><h2 id="screens-title">' + c.screensTitle + '</h2><p>' + c.screensBody + '</p></div><ul class="screen-list" tabindex="0" aria-label="' + c.screensTitle.replace(/<[^>]+>/g, '') + '">' +
    c.screens.map(([k, name, text, alt], i) => '<li class="reveal" style="--d:' + i * 120 + 'ms"><figure><div class="phone"><img src="' + m + 'screen-' + k + '.webp" width="660" height="1434" alt="' + alt + '" loading="lazy" decoding="async"></div><figcaption><b>' + name + '</b><span>' + text + '</span></figcaption></figure></li>').join('') + '</ul><p class="demo-disclosure">' + c.disclosure + '</p></section>' +
    // 5. Closing.
    '<section class="closing"><img src="' + m + 'chalk-mark.png" alt="" width="76" height="76" loading="lazy"><h2>' + c.end + '</h2><span class="badge">' + c.soon + '</span><p>' + c.endBody + '</p></section></main>' +
    '<footer><span>© 2026 Aroido · Hobocode</span><nav aria-label="' + c.support + '"><a href="' + c.prefix + '/hobocode/privacy/">' + c.privacy + '</a><a href="' + c.prefix + '/hobocode/support/">' + c.support + '</a></nav><nav class="locale" aria-label="Language"><a href="/hobocode/" lang="en">EN</a><a href="/ko/hobocode/" lang="ko">한국어</a><a href="/ja/hobocode/" lang="ja">日本語</a><a href="/zh-hans/hobocode/" lang="zh-Hans">中文</a></nav></footer>' +
    '<script type="module" src="/hobocode/landing.js"></script></body></html>\n';
  files.set(root + path + 'index.html', html);
}
// /hobocode/get: one share link (QR, ads, profile). Sends phones to their store once the
// store URLs exist; until then everyone lands on the landing page in their language.
// Query strings (utm_*) are kept for the landing page.
const STORE_URLS = {ios: '', android: ''}; // e.g. https://apps.apple.com/kr/app/id..., https://play.google.com/store/apps/details?id=...
files.set(root + '/hobocode/get/index.html', '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hobocode</title><meta name="robots" content="noindex"><meta name="theme-color" content="#0e0e0e"><link rel="canonical" href="https://aroido.com/hobocode/"><link rel="icon" href="' + m + 'app-icon.png">' +
  '<script>(function(){var S=' + JSON.stringify(STORE_URLS) + ',u=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1),and=/Android/i.test(u),ls=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""]),p="";' +
  'for(var i=0;i<ls.length;i++){var l=String(ls[i]).toLowerCase();if(l.indexOf("ko")===0){p="/ko";break}if(l.indexOf("ja")===0){p="/ja";break}if(l.indexOf("zh")===0){p="/zh-hans";break}if(l.indexOf("en")===0)break}' +
  'location.replace((ios&&S.ios)||(and&&S.android)||(p+"/hobocode/"+location.search))})()</script>' +
  '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0e0e0e;color:#f2f2f2;font:15px/1.6 -apple-system,system-ui,sans-serif;text-align:center}img{width:64px;height:64px;background:#111;border:1px solid #2c2c2c;border-radius:8px;padding:10px}a{color:inherit}nav{display:flex;gap:18px;justify-content:center;margin-top:8px}nav a{min-height:44px;display:inline-flex;align-items:center}</style></head>' +
  '<body><main><img src="' + m + 'chalk-mark.png" alt="" width="64" height="64"><h1 style="font-size:20px;margin:16px 0 4px"><a href="/hobocode/">hobo code</a></h1><nav aria-label="Language"><a href="/hobocode/" lang="en">EN</a><a href="/ko/hobocode/" lang="ko">한국어</a><a href="/ja/hobocode/" lang="ja">日本語</a><a href="/zh-hans/hobocode/" lang="zh-Hans">中文</a></nav></main></body></html>\n');
files.set(root + '/hobocode/media/town.svg', townSvg(VIEW));
files.set(root + '/hobocode/media/wear.svg', wearSvg(300, 160, 1000, 700));
files.set(root + '/hobocode/landing.css', fs.readFileSync('style.css', 'utf8'));
files.set(root + '/hobocode/landing.js', fs.readFileSync('src/main.js', 'utf8'));

if (process.argv.includes('--check')) {
  for (const [file, body] of files) if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== body) throw new Error('Outdated ' + file);
} else {
  for (const [file, body] of files) { fs.mkdirSync(file.slice(0, file.lastIndexOf('/')), {recursive: true}); fs.writeFileSync(file, body); }
}

