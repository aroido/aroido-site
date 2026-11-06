# Hobocode ad install measurement privacy notice (2026-11-06)

Source of truth: hobocode PR #412 (CP-38), app copy (first-run statistics step, Settings "광고 성과 측정"), `docs/ad-install-measurement.md` and `docs/analytics/privacy-draft.md` CP-38 section in the hobocode repo.

## Why

Hobocode adds optional install measurement for Meta and Google app-install campaigns: Firebase Analytics (Google) and the Meta SDK, behind a consent that is separate from PostHog statistics. The policy must name the recipients (Google LLC, Meta Platforms, Inc., both US), purpose, data, withdrawal behavior and the SKAdNetwork registration.

## Change

- New section "App install ad measurement (Meta and Google)" on `/hobocode/privacy/` (keys `hobocode_privacy_admeasure_{title,intro,data,withdraw,skan}`), between usage analytics and advertising.
- "Firebase Analytics stays disabled" in the protection and analytics paragraphs replaced with accurate statements.
- Effective date November 6, 2026 in all four languages; localized pages regenerated.

## Merge timing

Merge when the app version containing CP-38 is submitted, so the public policy matches the shipped binary.
