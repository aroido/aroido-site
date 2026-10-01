# Ramgnote privacy and support pages

Issue: https://github.com/aroido/aroido-site/issues/20

## Scope and acceptance

Reuse the Mongle static page shell for `/ramgnote/privacy/` and `/ramgnote/support/`, with complete en, ko, ja, zh-Hans versions, language links and sitemap entries. Do not modify Mongle or unrelated pages. Operator: 송희섭; contact: admin@aroido.com. Publish via the existing GitHub PR/main → Vercel workflow, after full verification and preview checks. Confirm production HTTP 200, Korean mobile rendering, email links and unchanged existing pages. No accounts, secrets, paid services or app changes.

## Evidence and public claims

App source examined: ramgnote `8baa6a8f703cd3ec4d4a11b41e1af491c9d7fb0c`.

- SQLiteNotebookStore stores scoped notes/places, drafts, recovery inputs, deletion markers and sync metadata. Trash and explicit drafts use 30-day expiration with execution-opportunity cleanup. Editor recovery is not the same 30-day draft promise. Local files use iOS protection.
- MemoEditor uses PhotosPicker, re-encodes selected pixels as JPEG without copying original EXIF/GPS/IPTC, stores app-owned photos and supports up to six. No camera/video promise.
- NotebookSyncRuntime requires configured/approved CloudKit and fresh identity plus opt-in for the current run/account. Initial text sync covers existing notes/places/trash/deletions, excluding drafts and photo files. The photo transport exists but Release ICloudNotebookController does not set photosApproved: current normal configuration cannot enable it. A separate photo consent describes existing saved/trash attachments if a supported version enables that transport. Do not advertise photo cloud backup as currently available.
- Core Location compares locally for opt-in Always/precise/notification reminders, storing per-place episode/timing metadata. Siri opens foreground and requires unlock. Local notifications omit note text. Manual ActivityKit sessions can show body excerpts; place names remain visible when the body is hidden. No automatic Island relay.
- Apple MapKit/MKLocalSearch and saved Apple place ID relookup can contact Apple. Apple place-reference notes do not support arrival reminders. Naver conditional proxy code exists but no configured Info.plist path in this baseline; no operational Naver claims.
- No connected advertising/tracking/third-party analytics SDK found in baseline. CP-01 advertising plan is not an implemented service. Do not claim no servers or no personal data processing.
- Requests to admin@aroido.com are separate from app storage. Support retention was confirmed by the operator before production. No placeholder policy may be published.

## Delivery record

2026-10-01: specification created before implementation. Existing site source `3c2fa5c`; GitHub canonical repository and existing Vercel `aroido-site` connection verified read-only. Production deployment at that commit reported by vercel[bot]. Existing `.omx/` in primary checkout untouched.

## Local validation and outstanding decision

- Full repository gate `./scripts/run-ai-verify --summary --mode full`: PASS, 8/8 checks.
- Independent read-only review against app 8baa6a8: no P0/P1 findings. Existing translation values and Mongle HTML remain unchanged.
- Chromium at 390 × 844: all eight locale/page combinations return local HTTP 200, no horizontal overflow, expected localized titles/headings and admin@aroido.com mail links. Korean privacy/support screenshots visually inspected.
- Generated sitemap normalizes four existing Mongle privacy lastmod entries from 2026-07-28 to their source history date 2026-07-31; no Mongle content or routing changes.
- 2026-10-01: operator confirmed keeping inquiry emails and attachments only while needed for inquiry handling, deleting unnecessary material after the purpose is achieved, with exceptions only for legally required retention. All four locales were finalized accordingly. Production publication is authorized through the existing PR/Vercel workflow.
