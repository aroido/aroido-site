# Hobocode locale-specific App Store links

Issue: https://github.com/aroido/aroido-site/issues/78

## Problem

All four landing pages currently use a country-neutral App Store URL. Their displayed language does not select the intended web storefront. The header download CTA is also generated as a `span` with an `href` and an unmatched closing anchor, so it is not a usable link.

## Behavior

- Both download CTAs use the page language: `ko` → `/kr/`, `ja` → `/jp/`, `en` → `/us/`, `zh-Hans` → `/cn/`. The app ID remains `6820969894`.
- `/hobocode/get/` uses its existing first-supported browser-language selection for the iPhone/iPad App Store destination as well as the landing fallback. Unsupported languages default to English/US.
- The top CTA is a semantic anchor. English stays at `/hobocode/`; localized routes and language-switch links retain their current paths.
- Android has no store URL. Android/desktop landing fallback retains the query string. No analytics, account, app code or user-facing copy changes.
- Storefronts were checked against Apple's lookup endpoint: KR, JP, US and CN each return this app. A website language does not promise an additional in-app language or change the user's Apple account region.

## Acceptance

- Generate the four pages and the shared redirect from `landing/hobocode/generate.mjs`; generated parity passes.
- Verify both CTAs on each locale and exercise iPhone, iPad desktop mode, preferred-language order, unsupported languages, Android and desktop fallbacks.
- `./scripts/run-ai-verify --summary --mode full` passes on the final diff.
- Independent review, GitHub PR preview, merge under repository rules, then public HTTP verification of all four locales and the shared redirect.

## Change log

- 2026-10-27: Created for the user's language/storefront mismatch report.
