# Hobocode public policy: remove iCloud sync description

Date: 2026-10-16
Issue: 미연결 (부모가 PR 생성 시 aroido-site 이슈와 연결)

## Requested outcome

Align the public Hobocode privacy policy and support page with the app after `aroido/hobocode#264` removed iCloud (CloudKit) sync.

## Facts from the app change

- iCloud sync is removed. Notes, places, photos, drafts and trash stay in app-private storage on this iPhone. The app does not check the iCloud account, does not separate record spaces by account, and does not send the received-reminder total to iCloud. There is still no separate sign-up.
- Earlier test versions (TestFlight) had optional iCloud sync. Data already sent to iCloud is no longer read or deleted by the app; users can delete it in iPhone Settings > [name] > iCloud > Manage Storage (Manage Account Storage). After updating, existing on-iPhone records move into on-device app storage and stay visible; the app does not delete files.
- iOS system backups (iCloud Backup, device backup) are Apple features separate from the app and may still be mentioned.

## Scope

- Source of truth: `hobocode/privacy/index.html`, `hobocode/support/index.html` (English) and `i18n/messages.json` keys `hobocode_privacy_*`, `hobocode_support_*`, `hobocode_updated`. `ko`, `ja`, `zh-hans` pages are generated with `node scripts/generate-localized-pages.mjs`.
- Removed: "Optional iCloud record sync" and "Photos included in iCloud sync" sections; iCloud/CloudKit/sync-status/per-account-space wording in meta and JSON-LD descriptions, intro, local storage, maps, retention, protection, rights, support storage/backup/delete.
- Added: one short "iCloud data from earlier test versions" paragraph (keys `hobocode_privacy_earlier_test_title/body`, replacing the removed `hobocode_privacy_cloud_*` keys) in all four languages.
- Apple service list drops iCloud; Siri, APNs, maps and search stay.
- Effective date set to 2026-10-16 on the privacy page (`hobocode_privacy_updated`) and on the support page (`hobocode_updated`, because support copy changed materially).
- Unchanged: NAVER/Apple search, location, notifications, Live Activity relay, AdMob, web analytics, contact and operator details, other products (Mongle, Ramgnote), `docs/specs/hobocode-policy-material-draft-2026-10-11.md` (historical unpublished draft).

## Acceptance

- `rg -n -i 'icloud|cloudkit'` on Hobocode policy pages and `hobocode_*` i18n keys shows only the earlier-test-version paragraph and Apple system-backup wording.
- `node scripts/generate-localized-pages.mjs --check`, `./scripts/i18n-audit.sh` and `./scripts/ai-verify --mode full` pass.
- No guarantee wording is added. Public deployment is not verified by this change.

## Change history

- 2026-10-16: Created. Reason: app removed iCloud sync (aroido/hobocode#264); public copy must not describe sync that no longer exists.

