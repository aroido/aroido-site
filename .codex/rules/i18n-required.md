---
description: Require public en/ko/ja/zh-Hans i18n support for user-facing copy
globs: ["index.html", "script.js", "docs/specs/**/*"]
alwaysApply: true
---

# i18n Required Rule

1. 사용자 노출 텍스트는 MUST `en`, `ko`, `ja`, `zh-Hans`를 모두 제공한다.
2. 언어 전환 UI는 MUST 키보드 접근 가능해야 한다.
3. 영어는 MUST 비프리픽스 canonical/default URL을 유지한다.
4. 공개 localized URL은 MUST `/ko/`, `/ja/`, `/zh-hans/` prefix를 사용한다.
5. 번역 키 누락 시 MUST 기본 언어로 fallback 한다.
