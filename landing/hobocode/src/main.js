// Hobocode landing: progressive enhancement only. Without JS or with reduced motion,
// every section already shows its final, readable state.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = v => Math.min(1, Math.max(0, v));
const ease = t => 1 - Math.pow(1 - t, 3);

// 1. Hero film: play once, slow down at the chalk mark, then pop the painted note (app onboarding step 1).
const hero = document.querySelector('[data-hero]');
if (hero) {
  const video = hero.querySelector('video'), memo = hero.querySelector('.paint-memo'), ring = hero.querySelector('.arrive-ring'), replay = hero.querySelector('.replay');
  const VW = 720, VH = 1280, SLOW_FROM = 5.0, STOP_AT = 5.9, MARK = {cx: 0.408, top: 0.27, bottom: 0.472};
  let raf = 0, arrived = false;
  const place = () => {
    const W = hero.clientWidth, H = hero.clientHeight;
    if (!W || !H) return;
    const s = Math.max(W / VW, H / VH), ox = (VW * s - W) / 2, room = VH * s - H;
    const oy = Math.max(0, Math.min(room, MARK.top * VH * s - Math.max(16, H * 0.08)));
    video.style.objectPosition = '50% ' + (room > 0 ? (oy / room * 100).toFixed(1) : 50) + '%';
    const mw = Math.round(Math.min(W * 0.8, 320));
    memo.style.width = mw + 'px';
    const mh = memo.offsetHeight, cx = MARK.cx * VW * s - ox;
    memo.style.left = Math.max(12, Math.min(W - mw - 12, cx - mw / 2)) + 'px';
    memo.style.top = Math.max(12, Math.min(H - mh - 12, MARK.bottom * VH * s - oy + 18)) + 'px';
    const rr = (MARK.bottom - MARK.top) / 2 * VH * s, cy = (MARK.top + MARK.bottom) / 2 * VH * s - oy;
    Object.assign(ring.style, {left: cx - rr + 'px', top: cy - rr + 'px', width: 2 * rr + 'px', height: 2 * rr + 'px'});
  };
  const arrive = () => {
    if (arrived) return;
    arrived = true;
    cancelAnimationFrame(raf);
    place();
    hero.dataset.arrived = '';
    replay.hidden = false;
  };
  const holdAtMark = () => {
    // The poster covers browsers or servers that cannot seek; a successful seek shows the same frame.
    if (video.currentTime < 1) video.poster = video.dataset.stopPoster;
    const hold = () => {
      video.pause();
      video.playbackRate = 1;
      const s = video.seekable;
      if (s.length && s.end(s.length - 1) >= STOP_AT) { try { video.currentTime = STOP_AT; } catch {} }
      arrive();
    };
    if (video.readyState >= 1) hold(); else video.addEventListener('loadedmetadata', hold, {once: true});
  };
  const tick = () => {
    const t = video.currentTime;
    if (t >= SLOW_FROM) video.playbackRate = Math.max(0.12, 1 - (t - SLOW_FROM) / (STOP_AT - SLOW_FROM) * 0.9);
    if (t >= STOP_AT - 0.02) { video.pause(); video.playbackRate = 1; arrive(); return; }
    raf = requestAnimationFrame(tick);
  };
  const play = () => {
    arrived = false;
    delete hero.dataset.arrived;
    replay.hidden = true;
    place();
    try { video.currentTime = 0; } catch {}
    video.play().then(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }).catch(holdAtMark);
  };
  video.addEventListener('ended', arrive);
  video.addEventListener('error', () => setTimeout(arrive, 600));
  replay.addEventListener('click', play);
  addEventListener('resize', () => { if (arrived) place(); });
  if (reduced) { video.removeAttribute('autoplay'); holdAtMark(); }
  else if (!video.paused) { place(); raf = requestAnimationFrame(tick); }
  else play();
}

// 2. Memo wall drifts like the app home; pausable (WCAG 2.2.2) and idle when off screen.
const wall = document.querySelector('[data-wall]');
if (wall && !reduced) {
  const toggle = wall.querySelector('.motion-toggle');
  wall.dataset.moving = '';
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const paused = wall.toggleAttribute('data-paused');
    toggle.textContent = paused ? toggle.dataset.play : toggle.dataset.pause;
  });
  new IntersectionObserver(([entry]) => wall.toggleAttribute('data-offscreen', !entry.isIntersecting)).observe(wall);
}

// 3. Arrival scene: scroll walks the dot into the alert radius, then the notification drops in.
const scene = document.querySelector('[data-arrive]');
if (scene && !reduced) {
  scene.dataset.motion = '';
  const svg = scene.querySelector('.scene-overlay'), q = s => svg.querySelector(s);
  const trail = q('.trail'), dot = q('.dot'), glow = q('.glow'), radius = q('.radius'), cam = q('.cam');
  const PIN = {x: 262, y: 236}, R = 56, L = trail.getTotalLength();
  trail.style.strokeDasharray = L + ' ' + L;
  let last = -1, queued = false;
  const update = () => {
    queued = false;
    const box = scene.getBoundingClientRect(), span = box.height - innerHeight;
    const p = clamp(span > 0 ? -box.top / span : 1);
    if (Math.abs(p - last) < 0.0004) return;
    last = p;
    const show = clamp((p - 0.04) / 0.14), walk = clamp((p - 0.2) / 0.55);
    radius.style.transform = 'scale(' + ease(show) + ')';
    radius.style.opacity = show > 0 ? 1 : 0;
    const pt = trail.getPointAtLength(L * walk);
    for (const c of [dot, glow]) { c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1)); }
    trail.style.strokeDashoffset = (L * (1 - walk)).toFixed(1);
    cam.setAttribute('transform', 'translate(' + PIN.x + ' ' + PIN.y + ') scale(' + (1 + 0.2 * ease(walk)).toFixed(3) + ') translate(' + -PIN.x + ' ' + -PIN.y + ')');
    const inside = Math.hypot(pt.x - PIN.x, pt.y - PIN.y) <= R;
    scene.toggleAttribute('data-arrived', inside);
    scene.dataset.step = inside ? '2' : walk > 0 ? '1' : '0';
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, {passive: true});
  addEventListener('resize', () => { last = -1; request(); });
  update();
}

// 4. Gentle reveal for the app screens.
if (!reduced && 'IntersectionObserver' in window) {
  document.documentElement.dataset.reveal = '';
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -12% 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

