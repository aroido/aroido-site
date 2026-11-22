# Hobocode privacy policy for app 0.1.8 default-on measurement and IDFA (2026-11-22)

Source of truth: hobocode repo `docs/analytics/privacy-draft.md` (CP-38) and `docs/ad-install-measurement.md` ("처리방침으로 옮길 상세 고지"), app 0.1.8 behavior.

## Why

From 0.1.8 a new installation outside the EEA, UK and Switzerland starts with detailed statistics and ad measurement on, a single Settings switch controls both, and the advertising identifier (IDFA) can be sent when the user allows ATT. The policy said measurement was optional, off by default, and never used the IDFA.

## Change

- `hobocode_privacy_updated`: effective date November 22, 2026 in all four languages.
- `hobocode_privacy_analytics_intro`, `_detailed`, `_withdraw`: version-scoped first-run behavior (0.1.8 default-on outside EEA/UK/Switzerland, choice step inside them, existing installations unchanged, 0.1.7 and earlier unchanged) and the "Send Usage Information" switch.
- `hobocode_privacy_admeasure_intro`, `_data`, `_withdraw`: default-on and consent by version, items sent, IDFA only with ATT allowed (not from consent given in 0.1.7 or earlier), Google personalized-ad signals off without ATT, withdrawal behavior, and per-version Google behavior when off (0.1.8 nothing, 0.1.7 identifier-free signals, 0.1.6 and earlier stop).
- Unchanged: PostHog item lists, retention, SKAdNetwork, contact, ads_* and protection_body (still accurate).
- English static page edited directly; ko, ja and zh-hans pages regenerated with `scripts/generate-localized-pages.mjs`. Sitemap lastmod for the four privacy URLs set to 2026-11-22.

## Notes

The Settings switch label is rendered as "Send Usage Information" (en), "사용 정보 보내기" (ko), "利用情報を送信" (ja), "发送使用信息" (zh-Hans); the ja and zh-Hans labels are translations and should match the app strings.

