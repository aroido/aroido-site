# Hobocode analytics privacy notice (2026-10-24)

Issue: https://github.com/aroido/aroido-site/issues/75

## Why

The public policy only says version 0.1.1(101) does not enable PostHog analytics. From 0.1.2 the app sends optional, consented usage analytics to PostHog (US). The policy must describe this before that version ships.

## Contract

Source of truth: the app copy (settings toggle, first-run disclosure) and `docs/analytics/privacy-draft.md` in the hobocode repo.

- Off by default; opt-in only; every feature works if declined.
- After consent, while the app is in use: screen opens, start of writing, memo save success/failure with save path (editor / Siri / App Intent), revisits, permission states, notification opens and target displays, app version / build / environment, event time and a per-event random UUID, first-launch and first-save times, new / existing / late-consent cohort with day count and consent version, Apple Ads attribution classification and campaign / ad group / keyword numeric IDs. Linked by a random per-device UUID (not anonymous).
- Never sent: memo text, photos, coordinates, addresses, place names, search terms, account information.
- Withdrawing stops new sends at once, discards queued events and the device UUID. Already-sent data is not deleted automatically; contact admin@aroido.com. After withdrawal, earlier data may be hard to identify.
- Free plan viewing/retention basis is 1 year; immediate deletion afterwards is not guaranteed.
- Firebase Analytics stays disabled. AdMob/ATT, maps, storage, relay and contact sections are unchanged.

## Change

- New section "App usage analytics" on `/hobocode/privacy/` in en, ko, ja, zh-Hans (`hobocode_privacy_analytics_*` keys); the 0.1.1(101) sentence in the protection section now states that Firebase Analytics stays off and refers to the new section.
- Toggle names follow the app strings: ko "앱 개선을 위한 사용 정보 보내기", ja "アプリの改善のために使用情報を送信", zh-Hans adds the app's English "Send Usage Info to Improve the App" (the app has no zh-Hans UI).
- zh-Hans protection and ATT/ads-intro text corrected to match en (Firebase Remote Config processing; ATT is requested and IDFA is used only if allowed). No other advertising wording changed.
- Effective date set to October 24, 2026 in all four languages.
- Localized pages regenerated with `scripts/generate-localized-pages.mjs`.

## Acceptance

- Four languages carry equivalent content; localized-output check passes.
- Existing AdMob/ATT/map/storage text is preserved except for correcting the stale zh-Hans ATT and Remote Config disclosures to match the other locales.

## Change log

- 2026-10-24: created.
- 2026-10-24: review fixes (full event list, toggle names, zh-Hans Remote Config/ATT parity).
