# Hobocode share link /hobocode/get (2026-10-16)

Issue: https://github.com/aroido/aroido-site/issues/53

## Why

Marketing needs one link for QR codes, ads and profiles that opens the right store for the visitor's phone (request from 정재윤, 2026-10-16).

## Behavior

- iPhone, iPad (including iPadOS desktop-mode UA with touch) → App Store URL selected by the first supported browser language; Android → Google Play URL. Both come from `STORE_URLS` in `landing/hobocode/generate.mjs`.
- Empty store URL (now: prerelease, and no Android app) or other devices → landing page in the first supported browser language (`ko`, `ja`, `zh*` → `/zh-hans`, otherwise English canonical), keeping the query string (utm).
- `location.replace` so Back does not loop. `noindex`, canonical to `/hobocode/`. Without JavaScript the page shows the wordmark link and the four locale links.
- No tracking, cookies or external requests.

## Acceptance

- `node generate.mjs --check` and full `ai-verify` pass.
- Browser checks: iPhone ko, iPad ja, Android zh, desktop en/fr with empty and filled store URLs; no-JS fallback.
- Production `/hobocode/get` and `/hobocode/get/` return 200 after merge.

## Change log

- 2026-10-16: created.
- 2026-10-24: App Store released; `STORE_URLS.ios` set to `https://apps.apple.com/kr/app/id6820969894` (app ID from the store link the user gave). Android stays empty. Campaign `ct` is not forwarded yet (needs the provider token).
- 2026-10-27: Match the landing and iOS share-link storefronts to language: ko→KR, ja→JP, en/default→US, zh→CN. See [locale-link specification](2026-10-27-hobocode-storefront-locales.md), issue #78. No new campaign forwarding.
