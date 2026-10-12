# Hobocode Dynamic Island refresh

Issue: https://github.com/aroido/aroido-site/issues/30
App reference: PR177/178, main 0cfc0b4c5ea6d9d0b82b2f8583d044a877f35f5e.

Replace the old grocery Island screenshot with the supplied actual system capture (Library libfile_5b2231dfc3608191ab4dd6e4ec5d50aa). Preserve all pixels within the original top 1206×540 region using lossless WebP. Retain the complete source in Library/local references; the page downloads only this region, without clipping the expanded Island or its chalk mark. Keep the globe, multiple notes, app map/detail, existing homepage, privacy and support unchanged.

Update all four locales to identify the parking memo as synthetic development data and the picture as an expanded state. Explain compact “메모” / expanded body without implying the Island is always expanded. No fake interactive control or new simulated UI.

Acceptance: full repository gate, 320px/390px/desktop screenshot inspection, image bounds/logo crop safety, scroll/resize/reduced motion fallback regression, review diff, Preview verification, merge and Production exact-file checks. ASC tabs are outside scope.
