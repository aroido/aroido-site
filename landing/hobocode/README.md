# Hobocode landing

Independent static landing, with a lazy React/Three.js scene only. Existing site remains plain HTML/CSS/JS.

- Install/build: `cd landing/hobocode && npm ci && npm run build`
- Serve repository root: `python3 -m http.server 4173 --bind 127.0.0.1`
- Korean: http://127.0.0.1:4173/ko/hobocode/
- English canonical: /hobocode/
- Compare: /ko/hobocode/?review&opening=in and ?review&opening=out
- Static illustration: ?flat (diagnostic, no WebGL import)
- Reduced motion / no JavaScript: all chapter copy is available without camera motion.

`content.mjs` is the four-locale content source, `generate.mjs` produces HTML; `src/main.jsx` loads Motion scroll tracking, `src/scene.jsx` is lazy Three/R3F/drei. Build outputs are checked in for existing static Vercel deployment. No root package.json or whole-site framework migration.

No browser location, map API, notification request, downloads, user data or analytics. Images are noninteractive product demonstrations. World coastlines are world-atlas/Natural Earth public-domain geography. Source brand SVGs come from aroido/hobocode main 7d7aebd. OS Island captures were supplied through Library; originals remain unchanged. Map capture uses an isolated simulator and synthetic local-only data; screenshot is not a functional web map.
