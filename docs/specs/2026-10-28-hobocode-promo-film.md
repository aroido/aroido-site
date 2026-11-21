# Hobocode landing promo film (2026-10-28)

Issue: https://github.com/aroido/aroido-site/issues/81

## Problem

The landing pages have no promo video, while a 25-second promo now exists in Korean, English and Japanese (made with the Lemo-Opuscar Pictogram Motion style, picture and score generated in code; Hobocode repo PR #394 `docs/video/promo-v1.md` §14).

## Behavior

- A new section sits between the arrival scene and the app screens: heading, one line of copy, the video, and a disclosure line.
- Video per page language: `media/{ko,en,ja}/promo.mp4`; zh-Hans uses `media/en/` like the walkthrough. H.264 720×1280 30 fps, CRF 25, AAC 96 kbps stereo, faststart, about 1.8 MB each. Poster `promo-poster.webp` is the 4.6 s frame (first place card with the island open).
- Manual play: `controls playsinline preload="none"`. No autoplay, no added page weight before play except the ~27 KB poster.
- Disclosure: places and memos are examples; memo text in the Dynamic Island needs the app's Show Memo Text setting (`docs/marketing/strategy.md` §7 in the Hobocode repo).
- Copy lives in `landing/hobocode/content.mjs` (`filmTitle`, `filmBody`, `filmLabel`, `filmNote`) for all four locales.

## Acceptance

- `node generate.mjs --check` and `./scripts/run-ai-verify --summary --mode full` pass on the final diff.
- `verify-hobocode-media.mjs` asserts each locale links its promo video and poster.
- Screenshots of the section at desktop and mobile widths (ko, en, ja) in the PR.
- After merge: public HTTP check of the four localized routes and the three video files.

## Change log

- 2026-10-28: Created when the user asked to put the new promo videos into every Hobocode channel.
