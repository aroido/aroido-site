# Hobocode landing

Independent static landing, with a lazy React/Three.js scene only. Existing site remains plain HTML/CSS/JS.

- Install/build: `cd landing/hobocode && npm ci && npm run build`
- Serve repository root: `python3 -m http.server 4173 --bind 127.0.0.1`
- Korean: http://127.0.0.1:4173/ko/hobocode/
- English canonical: /hobocode/
- Compare: /ko/hobocode/?review&opening=in and ?review&opening=out
- Static illustration: ?flat (diagnostic, no WebGL import)
- Reduced motion / no JavaScript: the same product content and a static globe are available without camera motion.

`content.mjs` is the four-locale content source, `generate.mjs` produces HTML; `src/main.jsx` loads Motion scroll tracking, `src/scene.jsx` is lazy Three/R3F/drei. Build outputs are checked in for existing static Vercel deployment. No root package.json or whole-site framework migration.

No browser location, map API, notification request, downloads, user data or analytics. Images are noninteractive product demonstrations. World coastlines are world-atlas/Natural Earth public-domain geography. Current chalk mask, wordmark, fonts and map/detail captures come from aroido/hobocode main 5fb41577; see ASSETS.md. OS Island captures were supplied through Library; originals remain unchanged. Map capture uses an isolated simulator and synthetic local-only data; screenshot is not a functional web map.

Flow: empathy → opening globe → actual map/detail → revisit reminder → return globe → release status. Globe instances are independent and lazy-loaded near the viewport. SVG connectors project actual canvas coordinates through the SVG screen transform and start at card borders.

Geometry regression: `node --test landing/hobocode/src/geometry.test.mjs` from repository root.

The building zoom uses an original fictional town mesh (roads, parcels, buildings, roofs and parking), explicitly captioned in all four languages. A continuous camera travels into it; this is not a zoomed world bitmap or a replacement for the real app screenshots. Projected mark bounds are limited to 28 CSS px (selected) / 22 px (others), including perspective and resize.
