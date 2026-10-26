# Hobocode analytics privacy notice (2026-10-24, contract updated 2026-10-26)

Issue: https://github.com/aroido/aroido-site/issues/75

## Why

The public policy only said version 0.1.1(101) does not enable PostHog analytics. From 0.1.2 the app sends optional, consented usage analytics to PostHog (US). Version 0.1.3 changes the contract to two opt-in levels (basic and detailed) chosen explicitly in the app. The policy must describe the shipped contract before that version ships.

## Contract (version 0.1.3)

Source of truth: the app copy (last first-run step, Settings privacy section) and `docs/analytics/*` in the hobocode repo.

- Nothing is sent and nothing is preselected before a choice. After the introduction, location and notification screens, the last first-run step offers "Turn On Basic Statistics and Start" (ko "기본 통계 켜고 시작") or "Turn Off and Start" ("끄고 시작"). Every feature works either way. Basic statistics is never enabled by default or by an update; an existing completion, existing OFF or existing detailed choice is not changed by updating.
- Settings offers Don't send statistics / Basic statistics / Detailed statistics (ko "통계 보내지 않음 / 기본 통계 / 상세 통계"). Detailed statistics is a separate explicit choice, never turned on by the basic choice; newly turning it on requires choosing it in Settings. A user who agreed to usage analytics in an earlier version keeps that choice as detailed statistics (legacy consent restores as detailed) and can change or turn it off in Settings.
- After a level is turned on, data goes to PostHog Inc. (US, privacy@posthog.com) over HTTPS only while the app is in the foreground.
- Basic statistics: counts only for app opens, screen opens (Home, Library, Map, Settings), memo save successes and memo save failures, plus app version, build, environment and the UTC date. Each event has its own random UUID (reused only when the same event is retried) that is also its distinct id. No persistent installation id, permission states, first-launch/first-save times, return-visit or cohort data, or Apple Ads attribution.
- Detailed statistics keeps the previously disclosed fields unchanged: screen opens, start of writing, save success/failure with save path, revisits, permission states, notification opens and target displays, app version/build/environment, event time with per-event UUID, first-launch and first-save times, new/existing/late-consent cohort with day count and consent version, Apple Ads attribution classification and campaign/ad group/keyword numeric IDs, linked by a random per-device identifier (not anonymous).
- Neither level sends memo text, photos, coordinates, addresses, place names, search terms or account information. IP addresses can still be processed in transit; the notice does not claim full anonymity or IP removal.
- Turning statistics off stops new sends at once and discards the queue and the device identifier if one exists. Switching detailed to basic also discards the queue and detailed identifier and stops ad attribution. Already-sent data is not deleted automatically; contact admin@aroido.com. Basic statistics has no device identifier, so earlier data may be hard to find.
- Free plan viewing/retention basis is 1 year; immediate deletion afterwards is not guaranteed.
- The notice describes app behavior. It does not state that data processing agreements, cross-border transfer terms or legal review are complete.
- Firebase Analytics stays disabled. AdMob/ATT, maps, storage, relay and contact sections are unchanged. No privacy manifest change.

## Change

- Section "App usage analytics" on `/hobocode/privacy/` now has: intro/choice paragraph (`hobocode_privacy_analytics_intro`), basic statistics (`hobocode_privacy_analytics_data`), detailed statistics (new `hobocode_privacy_analytics_detailed`), withdrawal and switching (`..._withdraw`), retention (`..._retention`), in en, ko, ja, zh-Hans. Translations live in `i18n/messages.json`; `hobocode/privacy/index.html` carries the English fallback.
- Button and setting names follow the app strings (en/ko/ja); zh-Hans adds the app's English names because the app has no zh-Hans UI.
- Effective date set to October 26, 2026 in all four languages.
- Localized pages regenerated with `scripts/generate-localized-pages.mjs`.

## Acceptance

- Four languages carry equivalent content; `generate-localized-pages.mjs --check` and `verify-localized-output.mjs` pass.
- No other policy sections changed.

## Change log

- 2026-10-24: created.
- 2026-10-24: review fixes (full event list, toggle names, zh-Hans Remote Config/ATT parity).
- 2026-10-26: contract updated for 0.1.3 (basic/detailed levels, last-step explicit choice, minimal basic payload, no persistent id in basic, effective date October 26, 2026).
- 2026-10-26: review fix: new-choice vs legacy-consent distinction for detailed statistics (legacy consent stays detailed).
