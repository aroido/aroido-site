# Hobocode advertising disclosure and authorized seller

Date: 2026-10-14
Issue: https://github.com/aroido/aroido-site/issues/48

## Requested outcome

Prepare the public privacy notice for the user-approved Hobocode home/library native ads and memo-detail banner. Current published copy says AdMob is unimplemented. The app integration is prepared separately in `aroido/hobocode`, with production requests gated until public notice, consent and app approval prerequisites are ready.

## Scope and constraints

- Update only Hobocode privacy text in en, ko, ja and zh-Hans and their runtime translation source. Describe SDK handling conditionally for advertising-enabled builds; do not announce production serving or revenue.
- Preserve the separate Ramgnote policy, all support-page effective dates, analytics/deployment settings, canonical URLs, language navigation, operator and contact details.
- Explain non-personalized requests, no ATT/IDFA authorization prompt, no app-provided memo/photo/exact-coordinate/address/search/account identifier, and SDK IP/device-or-app identifier/diagnostic/ad interaction processing. Do not equate non-personalized ads with no collection or promise immediate deletion of provider-held data.
- Explain UMP consent-state checks and privacy choices when required. Do not claim that all consent choices disable all requests; UMP and applicable message configuration determine whether requests may proceed.
- Add the one public authorized-seller entry to root `app-ads.txt`: `google.com, pub-3754887896850155, DIRECT, f08c47fec0942fa0`. No other sellers, new analytics, credentials or account-wide changes.
- No website deployment, app rollout or AdMob consent-message publication is performed by preparing this patch. The final publication date must match the coordinated release.

## Acceptance and evidence

- English static source and all generated localized privacy pages equal their locale keys.
- The shared support effective-date key and all Ramgnote policy keys remain unchanged.
- Root seller file contains the verified AdMob account's public publisher ID and standard Google certificate ID.
- Run the existing complete repository verifier once on the final source state; preserve actual exit code and log. Independently review disclosure against the final app integration and Google's SDK documentation.
- Record actual public deployment/crawler verification and consent publication separately; neither a local pass nor a PR confirms them.

## Primary references

- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy
- https://developers.google.com/admob/ios/privacy/strategies
- https://support.google.com/admob/answer/7676680
- https://support.google.com/admanager/answer/9422161

## Console observation

The three Hobocode units exist in AdMob, and a Hobocode-only European consent message is saved as a draft with a decline option. The current public policy still says the advertising SDK is unimplemented. Message publication, website deployment and live app serving remain unverified.

## Validation checkpoint

2026-10-14: Full repository verifier passed 9 checks, 0 failed; actual exit code 0. Log: `/var/folders/d7/qbq7g7rs4jz_1tjx33dxqgkh0000gn/T/codex-ai-verify.dNjnWv`. Static output covers 22 routes in four locales. A separate scope check confirmed all unrelated translation keys and the shared support effective dates remain unchanged, and the seller entry equals the verified public publisher ID. App/website independent review is in progress; no publication or crawler success is claimed.
