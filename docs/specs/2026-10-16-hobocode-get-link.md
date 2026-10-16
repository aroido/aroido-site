# Hobocode share link /hobocode/get (2026-10-16)

Issue: https://github.com/aroido/aroido-site/issues/53

## Why

Marketing needs one link for QR codes, ads and profiles that opens the right store for the visitor's phone (request from 정재윤, 2026-10-16).

## Behavior

- iPhone, iPad (including iPadOS desktop-mode UA with touch) → App Store URL; Android → Google Play URL. Both come from `STORE_URLS` in `landing/hobocode/generate.mjs`.
- Empty store URL (now: prerelease, and no Android app) or other devices → landing page in the first supported browser language (`ko`, `ja`, `zh*` → `/zh-hans`, otherwise English canonical), keeping the query string (utm).
- `location.replace` so Back does not loop. `noindex`, canonical to `/hobocode/`. Without JavaScript the page shows the wordmark link and the four locale links.
- No tracking, cookies or external requests.

## Acceptance

- `node generate.mjs --check` and full `ai-verify` pass.
- Browser checks: iPhone ko, iPad ja, Android zh, desktop en/fr with empty and filled store URLs; no-JS fallback.
- Production `/hobocode/get` and `/hobocode/get/` return 200 after merge.

## Change log

- 2026-10-16: created.
