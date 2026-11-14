# Hobocode identifier-free Google measurement without ad consent (2026-11-14)

Source of truth: hobocode PR #423 (CP-38 addition), app copy (first-run statistics step, Settings "광고 성과 측정"), `docs/ad-install-measurement.md` and `docs/analytics/privacy-draft.md` in the hobocode repo.

## Why

Without ad measurement consent the app sent Google nothing, so the Google Ads app campaign could not count or model any install. From 0.1.7 the app keeps Firebase Analytics collecting after the first run with Google consent mode's analytics storage, ad storage, ad user data and ad personalization denied. Meta stays consent-only.

## Change

- `hobocode_privacy_admeasure_data`: adds the identifier-free Google signals (what is sent, no Firebase app instance ID or IDFA, IP in transit, not sent to Meta, GDPR regions wait for consent) and updates the Meta screen-text feature description to the 0.1.6 on-device switch.
- `hobocode_privacy_admeasure_withdraw`: withdrawal now returns Google to identifier-free signals and deletes on-device measurement data; events recorded before withdrawal may still be sent with the identifier right after.
- `hobocode_privacy_protection_body`: Firebase Analytics is used only for app install ad measurement.
- Effective date November 14, 2026 in all four languages; localized pages regenerated.

## Evidence

Simulator traffic was intercepted with mitmproxy and the `app-analytics-services.com/a` bundles decoded: without consent there is no Firebase installation ID, IDFV or IDFA; with consent the installation ID is attached; a bundle created during consent was uploaded with the ID right after withdrawal; `first_open` was not recorded again after withdrawal.

## Merge timing

The text is version-scoped ("from 0.1.7"), so it can be published before that version ships.

