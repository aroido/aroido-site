# Web i18n Spec (KO/EN)

Updated: 2026-03-07

## Scope

- `aroido-site`의 기본 웹페이지에서 한국어/영어 전환을 지원한다.

## Non-goals

- 번역 관리 SaaS 연동
- 3개 이상 언어 확장

## Requirements

1. UI 텍스트는 MUST `ko`와 `en` 번역을 제공한다.
2. 언어 전환 컨트롤은 MUST 즉시 반영된다.
3. 선택 언어는 SHOULD 로컬에 저장되어 재방문 시 유지된다.
4. 문서 루트 `lang` 속성은 MUST 현재 언어와 일치한다.
5. 기본 언어는 브라우저 선호를 따르되 미지원 언어는 MUST `en` fallback 한다.

## Acceptance Criteria

- 초기 로드 시 `ko` 또는 `en` 중 하나로 화면이 렌더링된다.
- 언어 버튼 클릭 시 제목/본문/버튼 문구가 전환된다.
- 새로고침 후 마지막 선택 언어가 유지된다.
- `./scripts/ai-verify --mode full` 통과.
