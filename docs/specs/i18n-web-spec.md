# Public Web i18n Spec

Updated: 2026-04-26

## Scope

- `aroido-site` public pages MUST support `en`, `ko`, `ja`, and `zh-Hans`.
- English remains the default canonical URL set with unprefixed paths.
- Localized public URLs use `/ko/`, `/ja/`, and `/zh-hans/` prefixes.
- v1 localized scope includes home, products overview, product detail pages, team, contact, and blog chrome.
- Blog article bodies remain English for v1, while navigation, metadata, archive UI, article navigation, and shared chrome are localized.

## Locale Metadata

| Locale | Path prefix | HTML lang | OG locale | JSON-LD inLanguage | hreflang |
| --- | --- | --- | --- | --- | --- |
| `en` | none | `en-US` | `en_US` | `en-US` | `en` |
| `ko` | `/ko` | `ko-KR` | `ko_KR` | `ko-KR` | `ko` |
| `ja` | `/ja` | `ja-JP` | `ja_JP` | `ja-JP` | `ja` |
| `zh-Hans` | `/zh-hans` | `zh-Hans` | `zh_CN` | `zh-Hans` | `zh-Hans` |

## Requirements

1. UI text MUST provide matching keys for all four locales in `i18n/messages.json`.
2. Public localized pages MUST render static localized copy without requiring JavaScript.
3. Language controls MUST be visible, keyboard-accessible, and expose the active language with `aria-current` or equivalent state.
4. Language switching MUST preserve the equivalent page path and hash.
5. Internal site links on localized pages MUST stay within the same locale prefix, while asset links remain root-safe.
6. Each localized page MUST emit correct `html[lang]`, title, description, canonical, `hreflang`, OG locale, and JSON-LD `inLanguage`.
7. `sitemap.xml` MUST include all public localized URLs.
8. `/debug/ko/` MUST remain `noindex` and noncanonical.

## Non-goals

- Blog article body translation.
- Translation management SaaS integration.
- Server-side locale negotiation.

## Acceptance Criteria

- `node --check script.js` passes.
- `node scripts/build-blog.mjs --check` passes.
- `node scripts/generate-localized-pages.mjs --check` passes.
- `./scripts/i18n-audit.sh` passes for all four locales.
- `./scripts/run-ai-verify --mode full` passes.
- Browser QA confirms no missing localized chrome, broken language switch URLs, horizontal overflow, or clipped first-viewport controls on desktop and mobile.
