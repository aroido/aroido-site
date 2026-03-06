---
description: Web best-practice baseline aligned with current standards
globs: ["index.html", "styles.css", "script.js", "docs/specs/**/*"]
alwaysApply: true
---

# Web Best Practices Baseline

## Accessibility

- WCAG 2.2 AA를 SHOULD 목표로 한다.
- ARIA APG 패턴(키보드 상호작용 포함)을 SHOULD 따른다.

## Performance

- Core Web Vitals의 p75 기준을 SHOULD 만족한다.
  - LCP <= 2.5s
  - INP <= 200ms
  - CLS <= 0.1

## Security

- OWASP Top 10:2025 항목을 MUST 점검한다.
- CSP를 SHOULD 도입하고 초기에는 Report-Only로 검증한다.
- 외부 CDN 스크립트/스타일은 SRI를 SHOULD 적용한다.

## Data/API

- API 명세는 OpenAPI 3.1.2+ 또는 3.2.0을 SHOULD 사용한다.
- JSON payload 스키마는 JSON Schema 2020-12를 SHOULD 사용한다.
- 시간 포맷은 RFC 3339를 MUST 사용한다.

## Internationalization

- 기본 사용자 노출 언어는 `ko`/`en`을 MUST 지원한다.
- 언어 전환 시 `html[lang]`와 문서 title은 MUST 동기화한다.
- 미지원 언어 진입 시 `en` fallback을 MUST 제공한다.

## Session Reliability (Work Session UI/Telemetry)

- 페이지 비가시 상태 전환 시 `visibilitychange`를 SHOULD 사용한다.
- 세션 종료 직전 경량 전송은 `navigator.sendBeacon()`을 SHOULD 사용한다.
- 취소 가능한 비동기 요청은 `AbortController`를 SHOULD 사용한다.
