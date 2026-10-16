# Hobocode landing v2 — onboarding-aligned story (2026-10-16)

Issue: https://github.com/aroido/aroido-site/issues/51

## Why

The app changed a lot after the landing launched: black-and-white + chalk ⊗ brand, the rail-town memo wall home, and a story-style first run (intro film → location → arrival alert, aroido/hobocode PR #257). The landing still showed a 3D New York scene, a globe shown twice, plain bordered note cards, earlier captures (map/detail, an older Dynamic Island) and a text-only hero. The 3D bundle alone was 1.2 MB.

## Scope

Replace the landing story with scenes taken from the app itself, in four locales:

1. Hero with the onboarding intro film that stops at the chalk ⊗, an arrival ring and a white paint note.
2. Memo wall: rail-town silhouette and white paint notes with hobo signs, drifting (pausable).
3. Scroll-driven illustrated map: alert radius → walk in → actual Lock Screen notification.
4. Three actual development screens (home, map, place alert) dated 2026-10-14.
5. Closing keeps “App Store 준비 중” only (user decision 2026-10-16).

Remove Three.js/R3F/drei, Motion, Vite and the NYC/globe assets. Keep the existing hero/closing copy that was already reviewed (#39). No location, map API, notification, user data or analytics on the page.

## Acceptance

- `node generate.mjs --check` and `./scripts/run-ai-verify --mode full` pass.
- Mobile 390×844 and desktop 1440×900 captures of every section; video stops at the ⊗ with the note; scroll scene reaches the notification.
- axe (WCAG 2.0/2.1/2.2 A/AA) has no violations on all four locales; no console errors; no horizontal overflow on mobile.
- Reduced motion and no JavaScript show the final state of every section.
- Physical iPhone Safari and the Vercel preview (video seeking with Range) are checked separately.

## Change log

- 2026-10-16: created.
