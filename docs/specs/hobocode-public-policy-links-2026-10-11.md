# Hobocode public policy and support transition

Updated: 2026-10-11
Issue: https://github.com/aroido/aroido-site/issues/22

## Scope
Add Hobocode privacy/support routes in en, ko, ja, zh-Hans; migrate branding, SEO, language links, mail subjects, sitemap and homepage discovery. Preserve existing Ramgnote pages at their original URLs with their own canonical and policy text; add separate links to Hobocode because the apps are distinct. Connect verified public URLs in the app separately.

## Non-goals
No new Terms/EULA, no AdMob introduction, no app/server behavior changes, no credential reads or new legal retention/transfer promises. Existing unrelated site content and original checkout remain unchanged.

## Requirements
- MUST keep admin@aroido.com and operator 송희섭 unchanged.
- MUST use /hobocode/privacy/ and /hobocode/support/ with the site's locale prefixes.
- MUST update translation source, static HTML, canonical/hreflang, JSON-LD and sitemap together.
- MUST retain previous URL compatibility and validate new public destinations before updating ASC.
- MUST return substantive policy differences with source evidence before publishing them. Existing legacy policy incorrectly describes current photo sync, NAVER and automatic relay status.
- MUST not describe proposed AdMob as active collection.
- MUST use PRs with no direct protected-branch push. The app keeps develop→main; this website has only main, so create a develop baseline to follow the user's requested staged flow without changing production configuration.

## Acceptance Criteria
- Eight new localized pages render correctly and old eight URLs continue to serve their original app policy/support with explicit cross-links.
- No Ramgnote branding reappears from runtime translations on new pages.
- Main homepage exposes Hobocode support/privacy links without invented marketing claims.
- Full repository verification and focused policy/link checks pass.
- Actual live verification and ASC login blockers are recorded separately.

## Evidence
Website main d516dfdd8592ae8fedf07cbc5fc4629eb929066d; legacy paths and 49 ramgnote keys per locale exist. New routes and Terms routes currently absent. App main 744a2193 has empty public URL defaults. Public reviewer reports eight legacy pages HTTP 200 and new paths 404. Source-derived material draft is recorded separately and is not a new legal promise.

## Review correction
2026-10-11: Independent review rejected permanent old→new redirects because Ramgnote remains a separate app. Removed the proposed redirect config; retained old pages and their original effective dates, adding explicit cross-links. New Hobocode policy copy is prepared in four languages for review before publication. Publication date must be checked again if the merge occurs after October 11.

## Verification at review checkpoint
Full verification: 8 passed, 0 failed (22 routes × 4 locales). Focused checks cover 16 old/new privacy/support pages, per-app canonical/date, new static copy equal to runtime locale values, unchanged original Ramgnote translation values and no cross-app redirects. Independent review found the generator does not rewrite English source; explicitly synchronized it before regenerating locales. Live deployment and ASC writes remain not performed.
