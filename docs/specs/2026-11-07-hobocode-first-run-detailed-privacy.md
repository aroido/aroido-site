# Hobocode first-run statistics choice privacy notice (2026-11-07)

Source of truth: hobocode CP-39 (`docs/change-proposals.md`), first-run statistics step and tracking stage in app version 0.1.5.

## Why

From Hobocode 0.1.5 the first run adds an ad (ATT) stage and the last step offers "상세 통계·광고 측정 켜고 시작 / 기본 통계만 켜고 시작 / 끄고 시작". The first button turns on detailed statistics and ad measurement. The policy named the old buttons and said detailed statistics could only be turned on in Settings.

## Change

- `hobocode_privacy_analytics_intro`, `hobocode_privacy_analytics_detailed` and `hobocode_privacy_admeasure_intro` describe the 0.1.5 buttons and keep the earlier versions' buttons, so the text is accurate for every released version.
- Effective date November 7, 2026 in all four languages; localized pages regenerated with `scripts/generate-localized-pages.mjs`.

## Merge timing

The text covers both 0.1.5 and earlier versions, so it can be merged before 0.1.5 is released.

