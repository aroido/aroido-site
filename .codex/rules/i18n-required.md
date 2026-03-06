---
description: Require ko/en i18n support for user-facing copy
globs: ["index.html", "script.js", "docs/specs/**/*"]
alwaysApply: true
---

# i18n Required Rule

1. 사용자 노출 텍스트는 MUST `ko`와 `en`을 모두 제공한다.
2. 언어 전환 UI는 MUST 키보드 접근 가능해야 한다.
3. 기본 언어는 브라우저/사용자 선택을 기준으로 SHOULD 결정한다.
4. 번역 키 누락 시 MUST 기본 언어로 fallback 한다.
