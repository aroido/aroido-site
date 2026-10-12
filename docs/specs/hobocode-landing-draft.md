# Hobocode landing draft — 2026-10-12

Request: delegated user approval, source thread 01a11343-1fe8-7276-8cee-c49bca98e0f7. Initial local-only scope expanded by explicit user approval to commit, push, PR, merge and deploy via the existing pipeline. Issue: https://github.com/aroido/aroido-site/issues/28. No Slack messages or unrelated changes.

Add /hobocode and locale-prefixed equivalents without changing existing static routes. Independent Vite bundle mounts React only on a decorative Three.js/R3F/drei canvas; content is pre-rendered HTML. Motion drives scroll. Default English, Korean review at /ko/hobocode/. Query opening=in (default) or opening=out compares camera direction. Three.js loads after static content. Reduced motion and no WebGL keep readable static illustrations. No web map/search, location request, notification, user data, or App Store URL.

Story: globe with personal demonstration marks → one place → actual app evidence → practical memo → save and revisit value → zoom back out. Core Korean copy: 다음에 여기 오면, 기억나도록. / 주차 입구는 건물 뒤편. Actual source assets only; no invented app UI. Explicit demonstration labeling. Honest screenshot evidence provenance and current gaps.

Acceptance: desktop/mobile captures, both opening videos, WebKit mobile emulation, reduced motion, no WebGL/JS, contrast, keyboard, scroll return and resize; existing full verification gate. Physical mobile Safari is a separate manual gap.

## 2026-10-12 — accumulated personal notes revision (#28)
- Replace the separate example-note callout and repetitive feature grid with four practical, synthetic personal notes connected to globe marks.
- Keep cards readable in fixed nonoverlapping screen positions; focus the parking note during approach, then reveal the existing real app map/detail captures.
- Preserve synthetic-data context in the small scene caption and accessible collection description, and static/reduced-motion fallbacks.
- Verify desktop/mobile card bounds, overlap, WebKit, scroll restoration and existing fallback checks. Update PR29 only; no merge while Preview login is pending.
