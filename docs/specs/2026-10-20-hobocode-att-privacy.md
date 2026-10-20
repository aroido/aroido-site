# Hobocode ATT privacy policy alignment

Date: 2026-10-20
Issue: https://github.com/aroido/aroido-site/issues/71

## Authorized outcome and evidence

Publish the approved ATT policy draft for the English, Korean and Japanese Hobocode privacy pages through the existing GitHub PR/main/Vercel path. Do not submit or publish an app. Before work, the repository was clean, no web PR was open and no duplicate merge/push/verification process was running.

The draft is `/Users/macmini/Documents/Codex/2026-10-19/task-4/ATT-POLICY-PUBLICATION-DRAFT.md`. Its five sentences in each language replace the old unconditional non-personalized/no-ATT sentence. Preserve existing ad formats, ad-data exclusions and provider-processing disclosures.

Build 0.1.1(101) originates from app commit `0f1be5ae36e1a99ea8e73823dac8b667bd83f8dc`. The existing Store IPA was independently read for this website task: SHA256 `5b6bfa54d31ab201eb3b81cb2398b9ad1b05fe02f8977b93a445dccf0429e2a8`, ATT usage description present, Firebase Analytics collection deactivated, PostHog `NO`. Update only the existing three build-specific analytics statements from 99 to 101 and policy effective dates to October 20, 2026.

## Required distinctions

- ATT authorization permits IDFA access; it does not grant or override regional/UMP consent or guarantee personalized ads.
- Denied, restricted and undetermined answers force non-personalized requests without IDFA. Source `AdPersonalization.resolve` returns `.nonPersonalized` except when authorized; request extras use `npa=1`, SDK personalization is disabled and first-party publisher ID is off.
- `ConsentInformation.shared.canRequestAds` remains an independent gate for SDK initialization and ad loading. Add a short clarification to each existing consent paragraph without replacing existing consent-choice/deletion limitations.
- Do not promise absence of all tracking, IDFV/RTB non-sharing or account settings/network behavior that were not verified. Core feature access and permission changes follow the approved draft.

## Scope boundaries

Change only three policy HTML files, their twelve existing translation values (ad introduction, consent clarification, build-specific analytics statement, effective date) and this required specification. The explicit en/ko/ja scope overrides the usual four-language copy rule. Preserve Chinese values/pages, other pages, SEO/canonical/hreflang, scripts/assets, all PR70 Remote Config wording except the verified build number and existing retention/country/deletion statements.

## Acceptance

- Each approved five-sentence draft occurs exactly once in its locale's static HTML and runtime value; the old no-ATT sentence is absent.
- Scope comparison proves exactly twelve changed translation values and no unrelated HTML changes. Remote Config text is identical after normalizing the sole 99-to-101 change.
- Full repository gate passes, independent reviewer reports findings or No findings, and isolated Chromium/WebKit verify three languages at 390px and 1280px.
- After successful production deployment, directly read all three public privacy responses, compare full bytes and runtime translation JSON, verify new ATT/UMP wording and dates and record the deployed commit.

Primary terminology checks: https://developers.google.com/admob/ios/privacy/strategies , https://developers.google.com/admob/ios/privacy , https://developer.apple.com/documentation/apptrackingtransparency . These references do not independently verify AdMob account configuration or production network behavior.
