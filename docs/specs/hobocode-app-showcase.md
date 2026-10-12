# Hobocode app showcase

Issue: https://github.com/aroido/aroido-site/issues/34

## Scope
Make confirmed app UI the main evidence: full map and memo screenshots, then the latest expanded Dynamic Island capture. Explain saving a short location note, finding it on the map, and a return reminder without inventing new compose or place-picker UI. Retain the personal-note globe and both camera modes as a compact supporting sequence. Consolidate prerelease and demonstration disclosure. Preserve all existing routes and four locales.

## Acceptance
- Large readable app captures in normal scroll flow, including no-JS and reduced-motion.
- Consistent mobile typography, spacing, no horizontal overflow at 320/390/768/1440.
- No new app captures, fabricated controls, download URL, public user data, or web notification claims.
- Independent visual review; before/after desktop/mobile screenshots.
- Full repository verification, WebKit/mobile, reduced-motion, WebGL fallback, resize and return-scroll checks.
- Preview verification before main merge and production verification.

2026-10-13: Approved refinement of PR33 based on UI visibility and spacing feedback.

## Validation
+- Full gate: 9/9 passed; generated four locales and 22 site routes verified.
+- Chromium desktop, WebKit iPhone/320px/tablet, reduced-motion and no-JS: no overflow or runtime errors. Axe: zero findings in JS-enabled runs.
+- Actual app image widths: desktop 360px, mobile 300px, 320px viewport 256px. All images loaded; no new image assets.
+- Four locales × four widths × four camera phases: 64 layout cases passed. Both opening modes across 36 scroll cases: no overlapping cards/captions. No-WebGL fallback passed. Scroll return restored progress 0; resize passed.
+- Independent visual reviewer inspected actual desktop/mobile/320px pixels. Resolved consecutive identical hero screenshot, header skip link, repetitive journey copy, and lazy-image capture gap.
+- Physical iPhone, VoiceOver and field Core Web Vitals were not measured.
