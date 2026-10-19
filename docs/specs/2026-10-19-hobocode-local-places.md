# Local place app media follow-up

- Issue: https://github.com/aroido/aroido-site/issues/67
- Website baseline: `2bac03cc70a87d2b1f29e7620751d6f2c5b8a28b`.
- Final app main: `65767a6b44c5fba27e20f97ea48a6da21760aab5`, after PR341/345 were merged by other work during capture. Japanese is recaptured from latest main. Korean/English retain their true capture source `e6d813a`; independent comparison found no relevant visible KO/EN changes.
- English: Ferry Building, 1 Ferry Building, San Francisco CA94111,37.7954425,-122.3936136. Address and coordinate from official visitor page and its Google Maps destination link: https://www.ferrybuildingmarketplace.com/visit/ . Google linked address uses94105; official visitor-address94111 is retained.
- Japanese: 東京国立博物館, 東京都台東区上野公園13-9,35.7189,139.7764. Address from official https://www.tnm.jp/modules/r_free_page/index.php?id=113 ; coordinates cross-checked against https://en.wikipedia.org/wiki/Tokyo_National_Museum and actual app Apple Maps placement.
- Capture actual home/map/editor/mark/place-alert settings and walkthrough with localized plan notes, never visit reviews. International app path uses en_US/ja_JP and `--service-region-international`, never UI-test Korea default. Two synthetic notes belong to the verified public facility. Notification fixture uses the same public coordinates; default content privacy stays hidden.
- Built-in onboarding has no city/map data and is retained, as are all Korean media, SEO metadata and unrelated features.
- Keep Japanese support disclosure aligned with latest main and Chinese English-media fallback truthful. Update manifest per-asset captures and alt/disclosure/city context.
- Validate actual UI language/place/maps/video frames, mobile layout and image/video switching, full repository gate, independent review, Vercel deployment and exact production file hashes. Website publication is authorized; app PR merges/App Store submission are excluded.

## Completed capture and validation

- Both capture app sources built successfully after the guarded notification data update. Final notification object files postdate their source patches. Initial fixed-Seoul intermediate captures were discarded; final screenshots/videos use native location acquisition and actual international Apple Maps at SF/Tokyo.
- Ten city-dependent screens, two walkthroughs and two actual default-private OS notification cards were recaptured. English built-in onboarding and all eight Korean assets are byte-identical to baseline; Japanese onboarding is recaptured on latest main. Notifications use matching facility coordinates in synthetic far/near observations and real OS adapter display; their private default text does not identify the place. Adjacent web captions and illustrated destination labels state the corresponding facility.
- Full repository gate11/11 and20 pages390px in each Chromium/WebKit passed, including actual image decoding, manual video playback, metadata/links and overflow checks. Desktop1280px galleries and final localized landing layouts were checked separately.
- Independent final source/media review: No findings.27 hashes/byte sizes/source commits, fixture patch hashes,10 screens,2 notifications and video first/middle/end plus map/editor frames agree. Existing20 page SEO metadata and robots/sitemap remain unchanged. Korean media is unchanged; Korean app-support text is updated for the external Japanese merge.
- No production app UI/feature code was published, app PR merged, or App Store submission made. Website PR/Vercel release evidence follows in the PR comments and task report.

- Final-state correction: during final checks, external work merged Japanese into main. Home/products cards, all landing support copy and SoftwareApplication inLanguage now state ko/en/ja; no outdated code-review claim remains. Japanese main capture replaces the earlier pending-branch intermediate assets. This task never merged an app PR.
