# Tokenmon Install Conversion Refresh Spec

Updated: 2026-04-25  
Owner: Aroido Web  
Issue: https://github.com/aroido/aroido-site/issues/5  
Source request: direct maintainer request to make Tokenmon clearer and more install-oriented on the Aroido site.

## 1) Scope

- Improve the public Tokenmon presentation on `aroido.com`.
- Make the Tokenmon project page explain the installable product faster.
- Refresh Tokenmon preview and social assets from real product screenshots.
- Keep public runtime decisions English-first while maintaining Korean debug parity.

## 2) Non-goals

- Do not redesign the whole Aroido site.
- Do not change Tokenmon product behavior, release channels, or repository claims.
- Do not imply cloud sync, accounts, teams, PvP, or manual battle controls.
- Do not add a CMS or backend.

## 3) Current Problem

Tokenmon is already present on the Aroido site, but the page reads more like a product explanation than a conversion-focused install page. Visitors should understand faster that:

- Tokenmon is a real macOS menu bar app.
- Claude Code and Codex usage becomes passive encounters and Dex progress.
- It is low-friction to try through a DMG or Homebrew.
- The core trust line is local-first, no account, and no prompt text needed for gameplay.

## 4) Positioning Decision

Primary public line:

> Keep coding. Tokenmon collects quietly.

Supporting line:

> Claude Code and Codex usage becomes passive encounters, automatic results, and local Dex progress in your Mac menu bar.

This should make Tokenmon feel like an installable macOS companion rather than an abstract playful experiment.

## 5) Must-have Changes

1. Refresh Tokenmon project-page hero copy around the direct installable-product promise.
2. Make the primary CTA point to the latest GitHub release as `Download DMG`.
3. Keep Homebrew available as a clear secondary install path.
4. Improve home and projects Tokenmon card copy so the collection-loop value is visible in one pass.
5. Generate and use a site hero asset and an OG image grounded in real Tokenmon screenshots.
6. Update `en` and `ko` i18n keys together.

## 6) Acceptance Criteria

1. `/projects/tokenmon/` presents Tokenmon as an installable macOS menu bar companion in the first viewport.
2. The first viewport has direct DMG and Homebrew-oriented CTAs.
3. `/projects/` and the homepage describe Tokenmon with the same collection-loop promise.
4. `assets/og/tokenmon-og.png` remains 1200x630.
5. `/projects/tokenmon/` embeds the public Tokenmon intro video with a lazy inline player, a noscript fallback, and a direct YouTube link.
6. `./scripts/run-ai-verify --mode full` passes.

## 7) Change Log

- 2026-04-25: Initial spec for Tokenmon install-conversion refresh.
- 2026-04-25: Implemented refreshed copy, generated site/OG assets, and aligned `en`/`ko` i18n keys.
- 2026-04-28: Added the public Tokenmon intro video to the project page and localized the new video copy across all public locales.

## 8) Verification Evidence

- `./scripts/i18n-audit.sh` passed.
- `./scripts/run-ai-verify --mode full` passed.
- CDP render smoke passed at 1440px and 390px with `scrollWidth == innerWidth`.
- Generated assets:
  - `assets/tokenmon/tokenmon-site-hero.png`: 2400x1350.
  - `assets/og/tokenmon-og.png`: 1200x630.
- 2026-04-28 video addition:
  - `./scripts/i18n-audit.sh` passed.
  - `node scripts/generate-localized-pages.mjs --check` passed.
  - `node scripts/verify-localized-output.mjs` passed.
  - Chrome CDP smoke passed at 390px with `documentScrollWidth == innerWidth`; clicking the intro trigger created `https://www.youtube-nocookie.com/embed/d49hy6cjauk?autoplay=1&playsinline=1&rel=0`.
  - `./scripts/run-ai-verify --mode full` passed.
