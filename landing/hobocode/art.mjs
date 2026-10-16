// Deterministic drawing helpers shared by generate.mjs.
// Ported from the app's HoboRandom (mulberry32), PaintPatch and the home/onboarding web mocks
// in aroido/hobocode (docs/redesign/home-grunge-mock/hobo-home.html, onboarding-story/prototype-v6.html).
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = v => Number(v.toFixed(1));

// White paint patch: wobbly edges plus 1-4 short drips (app PaintPatch).
export function paintPath(w, h, seed) {
  const r = rng((0x9A1 + Math.imul(seed, 17)) >>> 0);
  const ph = [0, 1, 2, 3].map(() => r() * 6);
  const edge = (t, k) => 1.0 * Math.sin(t * 0.07 + ph[k]) + 0.6 * Math.sin(t * 0.19 + ph[(k + 1) % 4]) + (r() - 0.5) * 0.6;
  const p = [];
  for (let x = 0; x <= w; x += 5) p.push([x, edge(x, 0)]);
  for (let y = 0; y <= h; y += 5) p.push([w + edge(y, 1), y]);
  for (let x = w; x >= 0; x -= 5) p.push([x, h + edge(x, 2)]);
  for (let y = h; y >= 0; y -= 5) p.push([edge(y, 3), y]);
  let d = 'M' + p.map(q => n(q[0]) + ' ' + n(q[1])).join('L') + 'Z';
  const drips = 1 + Math.floor(r() * 4);
  for (let i = 0; i < drips; i++) {
    const x = 14 + r() * (w - 28), len = 3 + r() * r() * 8, wd = 1.5 + r() * 2, rr = wd / 2;
    d += 'M' + n(x - rr) + ' ' + (h - 2) + 'h' + n(wd) + 'v' + n(len + 2 - rr) + 'a' + n(rr) + ' ' + n(rr) + ' 0 0 1 ' + n(-wd) + ' 0Z';
    if (len > 5) { const rad = wd * (0.7 + r() * 0.3); d += 'M' + n(x - rad) + ' ' + n(h + len) + 'a' + n(rad) + ' ' + n(rad) + ' 0 1 0 ' + n(2 * rad) + ' 0a' + n(rad) + ' ' + n(rad) + ' 0 1 0 ' + n(-2 * rad) + ' 0Z'; }
  }
  return d;
}

// Worn lettering mask (app HoboWear): opaque sheet with tiny holes, used as a CSS mask.
export function wearSvg(w, h, seed, specks) {
  const r = rng((0xC4A1 + seed) >>> 0);
  let d = 'M0 0H' + w + 'V' + h + 'H0Z';
  for (let i = 0; i < specks; i++) {
    const x = r() * w, y = r() * h, sw = 0.45 + r() * 0.6, sh = 0.45 + r() * 0.5;
    d += 'M' + n(x) + ' ' + n(y) + 'v' + n(sh) + 'h' + n(sw) + 'v' + n(-sh) + 'Z';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none"><path fill="#000" fill-rule="evenodd" d="' + d + '"/></svg>\n';
}

// One-layer black rail-town silhouette (app home memo wall). Tiles seamlessly every W.
export function silhouette({ W = 1280, H = 150, M = 126, R = 112, seed = 3 } = {}) {
  const fill = [], thick = [], thin = [];
  const seedOf = (k, salt) => (Math.imul((k + seed * 97) | 0, 2654435761) ^ salt) >>> 0;
  const rect = (x, y, w, h) => fill.push('M' + n(x) + ' ' + n(y) + 'h' + n(w) + 'v' + n(h) + 'h' + n(-w) + 'Z');
  const poly = pts => fill.push('M' + pts.map(p => n(p[0]) + ' ' + n(p[1])).join('L') + 'Z');
  const line = (arr, x1, y1, x2, y2) => arr.push('M' + n(x1) + ' ' + n(y1) + 'L' + n(x2) + ' ' + n(y2));
  rect(0, M, W, H - M);
  const house = (x, w, h, r) => {
    const wallH = h * (0.28 + r() * 0.2), roof = h * (0.16 + r() * 0.14), top = M - wallH;
    rect(x, top, w, wallH + 1);
    poly([[x - 3, top + 1], [x + w / 2, top - roof], [x + w + 3, top + 1]]);
    if (r() < 0.55) { const cx = x + w * (0.62 + r() * 0.14), ch = roof * 0.8; rect(cx, top - ch, 5, ch); rect(cx - 1, top - ch - 1.5, 7, 2); }
  };
  const shop = (x, w, h, r) => {
    const hh = h * (0.32 + r() * 0.18), top = M - hh;
    rect(x, top, w, hh + 1); rect(x + w * 0.2, top - 3, w * 0.6, 4);
    if (r() < 0.4) rect(x + w * 0.7, top - 8, 6, 6);
  };
  const shed = (x, w, h, r) => { const hh = h * (0.2 + r() * 0.08), lift = h * 0.08; poly([[x, M + 1], [x, M - hh - lift], [x + w, M - hh], [x + w, M + 1]]); };
  const fence = (x, w) => {
    const h = R * 0.16;
    for (let px = x + 1; px < x + w - 2; px += 5) poly([[px, M + 1], [px, M - h + 1], [px + 1.25, M - h - 1], [px + 2.5, M - h + 1], [px + 2.5, M + 1]]);
    rect(x, M - h * 0.7, w, 1.5);
  };
  const tower = x => {
    const tw = 24, th = R * 0.22, roof = R * 0.12, tankB = M - R * 0.58;
    [[x + 3, tankB, x - 2, M], [x + tw - 3, tankB, x + tw + 2, M], [x + 9, tankB, x + 8, M], [x + tw - 9, tankB, x + tw - 8, M], [x, tankB + R * 0.2, x + tw, tankB + R * 0.2],
      [x + 1, tankB + R * 0.28, x + tw - 3, tankB + 4], [x + tw - 1, tankB + R * 0.28, x + 3, tankB + 4], [x + tw, tankB - 5, x + tw + 9, tankB + 2]].forEach(l => line(thick, ...l));
    rect(x, tankB - th, tw, th);
    poly([[x - 2, tankB - th + 1], [x + tw / 2, tankB - th - roof], [x + tw + 2, tankB - th + 1]]);
    rect(x + tw / 2 - 0.75, tankB - th - roof - 4, 1.5, 4);
  };
  const silo = x => {
    const cw = 11, h = R * 0.72, top = M - h;
    for (let i = 0; i < 3; i++) { const t = top + (i % 2) * 2, l = x + i * cw; fill.push('M' + n(l) + ' ' + n(M + 1) + 'V' + n(t + 5.5) + 'a5.5 5.5 0 0 1 11 0V' + n(M + 1) + 'Z'); }
    const hx = x + 2 * cw - 3, hh = R * 0.2;
    rect(hx, top - hh, 16, hh + 2);
    poly([[hx - 1, top - hh], [hx + 8, top - hh - R * 0.07], [hx + 17, top - hh]]);
    line(thick, hx + 14, top - hh * 0.4, hx + 44, M - R * 0.16);
    rect(x + 3 * cw, M - R * 0.3, 30, R * 0.3 + 1);
  };
  const boxcars = x => { const w = 36, h = R * 0.26; for (let i = 0; i < 2; i++) { const cx = x + i * (w + 4); rect(cx, M - h - 2, w, h + 3); rect(cx + 2, M - h - 4, w - 4, 2); } };
  const r0 = rng(seedOf(0, 0x51));
  tower(90 + r0() * 40); silo(520 + r0() * 60); boxcars(930 + r0() * 60);
  const r = rng(seedOf(2, 0xF7));
  let x = 0, low = true;
  while (x < W - 70) {
    const t = low ? 0.24 + r() * 0.36 : r();
    low = t < 0.24 || t >= 0.6;
    if (t < 0.24) { const w = 22 + r() * 30; if (r() < 0.6) fence(x, w); x += w; continue; }
    const w = t < 0.6 ? 50 + r() * 30 : t < 0.82 ? 42 + r() * 28 : 28 + r() * 14;
    const k = t < 0.6 ? 0.95 + r() * 0.35 : 0.6 + r() * 0.5;
    if (t < 0.6) house(x, w, R * k, r); else if (t < 0.82) shop(x, w, R * k, r); else shed(x, w, R * k, r);
    x += w - 2;
  }
  fence(x, W - x);
  const pts = [];
  for (let k = 0; k < W / 160; k++) { const pr = rng(seedOf(k, 0x9C)); pts.push({ x: k * 160 + 40 + pr() * 60, top: M - R * (0.92 + pr() * 0.08), can: pr() < 0.35 }); }
  pts.forEach((p, i) => {
    rect(p.x - 1.2, p.top, 2.4, M - p.top + 1); rect(p.x - 10, p.top + 4, 20, 2); rect(p.x - 7, p.top + 11, 14, 1.6);
    if (p.can) rect(p.x + 1.5, p.top + 15, 5, 8);
    const q = i + 1 < pts.length ? pts[i + 1] : { x: pts[0].x + W, top: pts[0].top };
    [[-9, 5], [9, 5], [-6, 12], [6, 12]].forEach(([dx, dy], j) => {
      const x1 = p.x + dx, y1 = p.top + dy, x2 = q.x + dx, y2 = q.top + dy;
      thin.push('M' + n(x1) + ' ' + n(y1) + 'Q' + n((x1 + x2) / 2) + ' ' + n((y1 + y2) / 2 + 10 + j * 2) + ' ' + n(x2) + ' ' + n(y2));
    });
  });
  return '<path d="' + fill.join('') + '"/><path fill="none" stroke="#111" stroke-width="1.6" d="' + thick.join('') + '"/><path fill="none" stroke="#111" stroke-width=".9" d="' + thin.join('') + '"/>';
}

// Dark illustrated neighbourhood map from the onboarding prototype. Not a real place.
export function townSvg(viewBox) {
  const r = rng(0x70B0), out = [], bl = [];
  const rect = (arr, x, y, w, h, fill, rx) => arr.push('<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" fill="' + fill + '"' + (rx ? ' rx="' + rx + '"' : '') + '/>');
  const xs = [-160, 40, 120, 190, 262, 350, 430, 560], ys = [-160, 90, 180, 300, 410, 520, 640, 780];
  const halfX = x => x === 262 ? 7 : x === 120 ? 5.5 : 3.5, halfY = y => y === 300 ? 7 : y === 180 ? 5.5 : 3.5;
  const shade = () => { const v = 31 + Math.floor(r() * 7); return 'rgb(' + v + ',' + v + ',' + v + ')'; };
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const x0 = xs[i] + halfX(xs[i]), x1 = xs[i + 1] - halfX(xs[i + 1]), y0 = ys[j] + halfY(ys[j]), y1 = ys[j + 1] - halfY(ys[j + 1]);
    const park = i === 5 && j === 3;
    rect(out, x0, y0, x1 - x0, y1 - y0, park ? '#1C1F1C' : '#1A1A1A', 2);
    if (park) {
      for (let k = 0; k < 60; k++) bl.push('<circle cx="' + n(x0 + 6 + r() * (x1 - x0 - 12)) + '" cy="' + n(y0 + 6 + r() * (y1 - y0 - 12)) + '" r="' + n(1.6 + r() * 2.6) + '" fill="#242824"/>');
      bl.push('<path d="M' + (x0 + 4) + ' ' + (y1 - 20) + 'C' + (x0 + 30) + ' ' + (y0 + 20) + ' ' + (x1 - 30) + ' ' + (y1 - 10) + ' ' + (x1 - 4) + ' ' + (y0 + 18) + '" fill="none" stroke="#2C2F2C" stroke-width="2"/>');
      continue;
    }
    const pad = 2.5, dep = () => 8 + r() * 5;
    const rowH = (yy, flip) => { let x = x0 + pad; while (x < x1 - pad - 5) { const w = Math.min(7 + r() * 10, x1 - pad - x), d = dep(); if (r() > .1) rect(bl, x, flip ? yy - d : yy, w - 1.4, d, shade(), .6); x += w; } };
    const colV = (xx, flip) => { let y = y0 + pad + 14; while (y < y1 - pad - 18) { const h = Math.min(7 + r() * 10, y1 - pad - 14 - y), d = dep(); if (r() > .1) rect(bl, flip ? xx - d : xx, y, d, h - 1.4, shade(), .6); y += h; } };
    rowH(y0 + pad, false); rowH(y1 - pad, true); colV(x0 + pad, false); colV(x1 - pad, true);
    if ((x1 - x0) > 70 && (y1 - y0) > 70 && r() < .6) rect(bl, x0 + (x1 - x0) * .35, y0 + (y1 - y0) * .38, (x1 - x0) * .3, (y1 - y0) * .24, shade(), .6);
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid slice"><rect x="-200" y="-200" width="800" height="1000" fill="#2A2A2A"/>' + out.join('') + bl.join('') +
    '<path d="M-200 600C20 560 120 640 300 610S520 560 600 590L600 700L-200 700Z" fill="#101214"/>' +
    '<g fill="none"><path d="M-160 688L560 28" stroke="#2A2A2A" stroke-width="24"/><path d="M-160 688L560 28" stroke="#383838" stroke-width="16"/><path d="M-120 300H540M262 -140V760" stroke="#343434" stroke-width="13"/>' +
    '<path d="M-160 476L560 430" stroke="#2A2A2A" stroke-width="10"/><path d="M-160 473.6L560 427.6M-160 478.4L560 432.4" stroke="#4A4A4A" stroke-width="1.1"/><path d="M-160 476L560 430" stroke="#3E3E3E" stroke-width="7" stroke-dasharray="1.4 4.6"/></g></svg>\n';
}

