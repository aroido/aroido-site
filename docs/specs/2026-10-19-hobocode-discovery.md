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

## Authorized website release stage (2026-10-19)

- The user now authorizes website push, PR, merge, and deployment. App merges remain unauthorized. The preceding validation and delivery notes describe the earlier local-only stage and remain historical evidence.
- Website source baseline remains `8580398043c77967a8ebc0af610416a5c3e8f105`; the previous work is preserved in commit `ecabe677`.
- Updated app main baseline: `e6d813ab376894cec556441c5d153b924f2c0532`, supporting Korean and English. Japanese is implemented as a development preview in open PR #341, head `8255c2cc4247127cbe2d56fc83b9783f4a1b5f72`, and remains under code review rather than merged or released. Chinese is unsupported.
- Home and products cards in all four website languages now state current Korean/English app support, the Japanese development preview under code review, and unsupported Chinese. Existing Coming soon/App Store availability statements, links, and layout remain unchanged.
- The parent task owns actual main Korean/English and pending Japanese PR-head UI captures, final verification, website publication, and deployment evidence. Pending-branch media must disclose its development preview status.
- Focused card follow-up checks passed: `./scripts/i18n-audit.sh`, `node --check script.js`, `git diff --check`, and scoped generation/parity for the six localized home/projects artifacts. This follow-up did not run the full verification gate or perform any git/network publication action.

### Existing WebKit home crash

- Independent investigation reproduces the crash on unchanged `8580398`, the modified branch, and live Aroido home, with JavaScript disabled and external requests blocked.
- WebKit 2370 throws `bad_optional_access` in `WebCore::FlexFormattingContext::computeFlexBaseSize` during grid intrinsic sizing of `.media-video`, which inherits column flex from `.media-card`.
- Setting `.media-video { display: block; }` prevents the crash at 390/1280px on the current site and at 390px on baseline/live. This small layout fix is included; no script/font changes.
- Site-level CSS isolation is established. A reduced standalone engine reproduction and physical Safari testing are not claimed.

- Explicit `width: 100%` also preserves the media card dimensions during the video-to-iframe transition. Independent WebKit 390/1280 and Chromium 390 checks passed without crash/overflow; external YouTube playback itself was not part of that isolated sizing probe.


### Final website release validation

- Korean/English were recaptured from main `e6d813a`; Japanese was captured from open PR #341 head `8255c2c`, with visible code-review/development-preview disclosure. Chinese remains an explicitly labeled English-media fallback. Dedicated synthetic data only; capture patches do not change production UI.
- App builds both succeeded. Japanese main UI/Live Activity/App Shortcuts catalog coverage matches English-bearing entries; English `CFBundleName` brand fallback remains. Photographed UI is not full i18n, TestFlight, physical-device, GPS or APNs validation. Japanese Seoul map/address labels remain external Korean geographical data.
- Final full gate: 11 passed, 0 failed. Chromium and WebKit: all20 target pages at390px passed links, metadata, image/video decoding and overflow/error checks. Existing studio WebKit crash is fixed by the isolated video-card block/width rules.
- Independent code and media review: No findings. All27 hashes/byte sizes/source commits match;18 screens,3 default-private actual OS notifications, and9 sampled video frames verified. Korean banner crop was corrected against its actual position; Japanese uses a real Notification Center card.
- Existing20 page SEO titles/meta/canonical/hreflang are preserved; only localized OG/Twitter image-alt tags were added. Robots is unchanged. Existing generator updates lastmod to2026-10-19 for the20 modified sitemap entries; URL list and discovery rules remain unchanged.
- Final local mobile lab measurement:390px, cold cache,1.6Mbps/150ms,4x CPU,3 runs; median LCP 2172ms, maximum CLS 0.00044. Original text-free1,047,985-byte autoplay intro remains; localized walkthroughs use manual playback/preload none. Shared-host laboratory results are indicative, not field Core Web Vitals.
- Final responsive regression:64 Chromium/WebKit × viewport375/390/430/1280 × four locales × normal/reduced-motion cases passed, including diagonal mobile touch, sticky stages, and desktop layout. The optional browser test now waits up to3s for the asynchronous frame state instead of assuming60ms is sufficient under shared-host load; page JavaScript is unchanged.
