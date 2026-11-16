# Hobocode discovery release status

## Request
Correct the obsolete upcoming/unavailable status in the home and product overview discovery card, in en, ko, ja and zh-Hans. The released default app is 6820969894, not its targeted CPP.

## Issue linkage
Issue: https://github.com/aroido/aroido-site/issues/87

The owner authorized publishing this issue and a draft PR. Merge and deployment remain outside scope.

## Scope and acceptance
- Released-neutral heading, available status and App Store download CTA in eight entry pages.
- Reuse the existing storefront mapping (us/kr/jp/cn), no tracking or CPP identifier.
- Retain product landing, support/privacy links and the Chinese app-language caveat.
- Generate translations from shared messages; preserve unrelated content and PR #82.
- Pass generation checks and full repository verification. Independently verify the eight card links and status strings.

## Validation
- `node scripts/verify-hobocode-discovery.mjs`: passed for all eight cards.
- `./scripts/run-ai-verify --mode full`: 11 passed, 1 failed. The unrelated `static:blog-generated` check reports 29 stale artifacts. Pristine base commit 644c88a0e4ebdd2ece076af2421645c7ee63fcdb reproduces exactly the same stale artifact list (10 passed, 1 failed before the new check). No unrelated generated pages were changed.
- `git diff --check`: passed.
- Playwright render was attempted but Chromium could not launch because the runtime disallowed its socket creation. Visual rendering, mobile overflow and keyboard behavior are not verified.
- Production verification requires a separately authorized deployment. The full completion gate is not green.

## Remaining scope
The existing site-wide claim of three public products excludes Hobocode and remains unchanged in this focused card fix. A wider portfolio reclassification would require a separate editorial scope decision.

With full Git history, refreshed the generated sitemap dates for the discovery pages and the already-updated privacy page. No blog content or generated blog page changed.
