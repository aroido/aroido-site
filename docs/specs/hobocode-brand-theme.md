# Hobocode brand theme

Issue: https://github.com/aroido/aroido-site/issues/36

## Approved scope
Apply latest app brand from main 5fb41577c13a12aef577dd38c23ba09bfebbbe80: Black Han Sans titles, Nanum Gothic Coding reading/UI, Saira Stencil One numbers; white/black/neutral gray with limited rust orange; official single chalk mark and worn wordmark; thin angular cards and black functional buttons. Preserve prerelease status, all locales and policy links.

Use latest real synthetic-fixture app captures, never composite a new symbol over an old screenshot. Report capture limitations. Globe uses matte monochrome land, surface-attached marks with back-face occlusion, readable cards, restrained camera and circle→X reveal. Keep both opening modes and app-screen transition. Reduced-motion, no-WebGL and no-JS stay readable.

## Acceptance
- Desktop/mobile visual review by independent agent, before/after captures.
- 320/390/768/1440 layout, all locales, contrast, resize/scroll return, reduced-motion and fallbacks.
- Build and full repository gate; verified PR Preview then authorized main merge/production deployment.
- Production routes/assets exact validation and Library deliverables.

2026-10-13: Full implementation and deployment approved after theme audit.

## Evidence
- Latest app map/detail: isolated app main5fb4157, unchanged UI and synthetic fixtures, XCTest capture PASS. Official Canvas wordmark rendered; minor macOS/iOS raster variation possible.
- Latest OS Island unavailable: earlier real capture retained and explicitly labeled in all four languages; no compositing.
- Web fonts subset to ~150KB total, original app blobs verified and OFL retained.
- Full 9/9, Chromium/WebKit at320/390/768/1440, reduced/noJS/noWebGL; Axe0, runtime errors0, overflow0. Four locales64 layout cases and both camera modes36 scroll cases passed.
- Independent pixel review: consistent app brand; corrected320px word splitting and card-obscured mark connectors. Physical iPhone, VoiceOver, field CWV not measured.
