# Hobocode landing

Static landing for `/hobocode/` in four locales. No framework, bundler or runtime dependency: `generate.mjs` writes the HTML, generated SVG art, `/hobocode/landing.css` and `/hobocode/landing.js`. Build outputs are checked in for the existing static Vercel deployment.

- Build: `cd landing/hobocode && node generate.mjs` (`--check` is part of `./scripts/ai-verify`)
- Serve the repository root, e.g. `npx http-server -p 4173` (needs HTTP Range support for video seeking), then open http://127.0.0.1:4173/ko/hobocode/
- Fonts: `python subset-fonts.py /path/to/hobocode/App/Resources/Fonts` after copy changes (fonttools + brotli)

Files: `content.mjs` (four-locale copy), `art.mjs` (deterministic drawing ported from the app: HoboRandom, PaintPatch, HoboWear, rail-town silhouette, onboarding illustrated map), `generate.mjs`, `style.css`, `src/main.js`.

Flow mirrors the app's first run (aroido/hobocode `docs/redesign/onboarding-story`):

1. Hero: the onboarding intro film plays once, slows to a stop at the chalk ⊗, an arrival ring pulses and a white paint note pops.
2. Memo wall: black rail-town silhouette with white paint notes and hobo signs, drifting at two speeds. Pause button (WCAG 2.2.2); paused off screen and on hover/focus.
3. Arrival: sticky illustrated map driven by scroll. The alert radius appears, the location dot walks in, and the actual Lock Screen notification drops in.
4. Actual development screens (home, map, place alert).
5. Closing with the App Store status.

Without JavaScript or with reduced motion, every section renders its final state: hero holds on the stop frame with the note, the wall is a static horizontally scrollable row, and the arrival scene shows the dot inside the radius with the notification.

`/hobocode/get` (also generated) is the single share link for QR codes, ads and profiles. It redirects iPhone to the App Store and Android to Google Play once `STORE_URLS` in `generate.mjs` is filled; until then every device goes to the landing page in its browser language, keeping the query string. It is `noindex`.

No browser location, map API, notification request, user data or analytics on this page. See ASSETS.md for provenance.

Mobile screen cards use a single vertical column; desktop uses three columns. To check scroll containment, locale layouts, reduced motion, sticky stages and a diagonal touch gesture, serve the root and run `BASE_URL=http://127.0.0.1:4173 node scripts/verify-hobocode-scroll.cjs` from the root with Playwright Chromium and WebKit installed. `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE`, and `WEBKIT_EXECUTABLE` support an existing local browser runtime; optional `EVIDENCE_DIR` saves screenshots. This is mobile emulation, not physical iPhone testing.
