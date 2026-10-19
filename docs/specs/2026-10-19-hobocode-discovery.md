# Hobocode discovery and release preparation

- Date: 2026-10-19
- Issue: https://github.com/aroido/aroido-site/issues/65
- Branch: `codex/hobocode-localized-seo`

## Goal

Make Hobocode discoverable from the Aroido home and products pages as an iPhone location-note app preparing for release. Give visitors useful product context before they follow the landing, support, or privacy links.

## Requirements

- Place a visible Hobocode product card immediately after each page's hero, before the remaining portfolio content.
- Explain that Hobocode connects notes and selected photos to places so visitors can find the context again when they return.
- Show an explicit Coming soon / release preparation state, iPhone with iOS 18 or later, and current app support for Korean and English only.
- Link to the matching locale's Hobocode landing, support, and privacy pages in `en`, `ko`, `ja`, and `zh-Hans`. Website translations do not imply Japanese or Simplified Chinese app support.
- Preserve three released products, existing SEO titles/descriptions, canonical URLs, hreflang, robots, and sitemap behavior.
- Preserve keyboard-accessible links, readable status text, and responsive wrapping. Do not add dependencies or advertise an available App Store download.

## Scope and ownership

Home/projects source HTML, shared CSS and translation resources, and their generated home/projects locale artifacts. Hobocode landing and policy content remain with the main implementation owner.

## Acceptance evidence

- Run `scripts/i18n-audit.sh` for locale/key parity.
- Generate the six localized home/projects artifacts through the existing static page generator and check generated parity.
- Verify all eight home/projects pages contain the card, release state, platform/app-language boundary, and localized links.
- Parent task runs final full verification and browser review before declaring the entire issue complete.

## Implemented evidence (2026-10-19)

- Home and projects now place `#hobocode` directly after the hero; the previous trailing link-only sections were removed.
- Seven new discovery keys have matching `en`/`ko`/`ja`/`zh-Hans` values. Existing English/Korean runtime fallbacks include the card and link copy.
- `./scripts/i18n-audit.sh`: passed.
- `node --check script.js`: passed.
- Scoped generation wrote only the six localized home/projects outputs; `node scripts/generate-localized-pages.mjs --check`: passed.
- HTML parser assertions passed on all eight home/projects pages: one card, three localized destination links, platform/language/release text, one h1, and unchanged metadata/canonical/hreflang compared with HEAD.
- `git diff --check`: passed. Full verification and visual review remain with the parent task.

## Change log

- 2026-10-19: Initial issue-linked spec, written before implementation; distinguishes release preparation from the existing released-products lane.

## Landing and media scope

- Latest app `main` verified from a fresh GitHub clone: `0ec5fe8a7c8b2b394553090a82d0b58a6c67fa92`. Site baseline: `8580398043c77967a8ebc0af610416a5c3e8f105`.
- Only Korean and English app catalogs exist. Japanese and Simplified Chinese site pages explicitly identify English app media and the unsupported app language; no completion claim for those app translations.
- Capture current home, map, place alerts, note editor, sign picker and onboarding, using isolated synthetic records, and real OS notifications through the app's synthetic arrival fixture. Capture UI walkthrough videos for manual playback. Keep the text-free official onboarding intro.
- Add landing footer links to localized maker home/products and return links from support/privacy. Add descriptive Organization/SoftwareApplication JSON-LD with actual `ko`/`en` support, no price, rating, or release date.
- Initial 390px cold-cache measurement (1.6Mbps/150ms/4x CPU): production median LCP 3396ms, local baseline 2232ms. Large logo/icon assets were 211,562/304,911 bytes despite small display sizes; create 10KB/21KB display renditions. Do not remove the 1MB autoplay intro without evidence that changing its behavior is needed.

## Final validation (2026-10-19)

- `./scripts/run-ai-verify --summary --mode full`: **11 passed, 0 failed**, exit 0. Includes locale generation, key parity, SEO isolation, 19 media hashes, localized support/privacy return links and schema app-language scope.
- Chromium: **20 pages** (home, products, landing, support, privacy × four locales) at 390px: links, title/canonical, one h1, image decoding, manual video playback, zero horizontal overflow and no JavaScript exceptions passed. Desktop Korean/English landing galleries at 1280px also checked.
- WebKit 27.2 / matching Playwright 1.64.1: **four landing pages** passed the same 390px media/layout checks. Studio home crashes in WebKit on both untouched main and this branch; it remains an existing browser verification limitation, not marked passed. Minimum HTML probe works.
- Raw HTML comparison: all existing metadata/canonical/hreflang attributes unchanged on 20 pages. `robots.txt` and `sitemap.xml` are byte-for-byte unchanged. No new search-engine submission.
- Mobile measurement, 390px, cold cache, 1.6Mbps down/150ms latency/4× CPU, 3 samples: local median LCP **2232 → 2080ms**, CLS **0.00044**. Original production median was 3396ms. Production after-change metrics remain unmeasured because no deployment occurred. The 1,047,985-byte text-free intro remains unchanged; the new localized walkthroughs are manual-play/preload none (English 240,736 bytes; Korean 403,183 bytes).
- Two independent review passes: **No findings**, including media manifest/dimensions and visual Korean/English notification privacy. Captures show current app UI; no text overlays or generated app screens.
- Final remote read confirms site main `8580398` and app main `0ec5fe8` are still the source baselines. TestFlight 0.1.1 (96) refresh is unverified: ASC CLI has no API credentials in this execution. No physical-device/GPS/APNs validation claimed.
- Deliverable remains a local branch/commit and Library review bundle. No push, PR, merge or deployment was performed; existing checkouts were not edited.
