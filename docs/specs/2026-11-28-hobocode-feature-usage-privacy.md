# Hobocode privacy policy for app 0.1.9 feature-use statistics (2026-11-28)

Source of truth: hobocode repo `docs/analytics/README.md` ("기능 사용", `hobocode_feature_used`) and `docs/change-proposals.md` CP-40, app 0.1.9 behavior.

## Why

App 0.1.9 adds a detailed-statistics event `hobocode_feature_used` that records which app feature was used (public memos, share links, map, places, trash, settings, sign-in/out and account deletion with the sign-in method) and how an arrival alert was delivered (regular notification or Dynamic Island). The policy listed neither, and said the app never sends "account information", which now has to be narrowed because the sign-in method is sent.

## Change

- `hobocode_privacy_updated`: effective date November 28, 2026 in all four languages.
- `hobocode_privacy_analytics_detailed`: adds arrival-alert delivery and kind of feature used; states that feature-use data holds only the feature kind and a fixed option value (no counts or radius values); narrows the exclusion to account IDs, email addresses, nicknames, and memo/place/link IDs.
- Unchanged: basic statistics (feature-use events are dropped there), intro, withdrawal, retention, ad measurement.
- English static page edited directly; ko, ja and zh-hans pages regenerated with `scripts/generate-localized-pages.mjs`. Sitemap lastmod for the four privacy URLs set to 2026-11-28.

## Acceptance

- Four privacy pages show the new items and the November 28 effective date.
- `./scripts/run-ai-verify --mode full` passes.
