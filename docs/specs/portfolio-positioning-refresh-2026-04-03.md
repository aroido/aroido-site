# Aroido Portfolio Positioning Refresh Spec

Updated: 2026-04-03  
Owner: Aroido Web  
Source request: current Codex session user request (no separate GitHub issue provided)

## 1) Scope

- `Aroido`의 상위 포지셔닝을 `AI coding systems only`에서 `AI-native product studio`로 확장한다.
- 홈 페이지를 `단일 제품 랜딩`에서 `회사 + 제품 포트폴리오 허브`로 재구성한다.
- `/projects/`를 `VibeSmith 단일 브리프`에서 `Products + Labs` 허브로 전환한다.
- `LayoutRecall` 공개 제품 페이지를 새로 추가한다.

## 2) Non-goals

- 이번 작업에서 게임/실험작 개별 상세 페이지를 모두 만들지는 않는다.
- 팀/문의 페이지 전체 카피를 전면 재작성하지는 않는다.
- CMS, 백엔드, 폼 플로우 변경은 포함하지 않는다.

## 3) Current Problem

- 홈과 메타 카피가 `Aroido = AI coding systems`로 과도하게 좁다.
- `/projects/`가 `one public product, VibeSmith`를 전제로 작성되어 새 제품이 들어오면 사실과 어긋난다.
- `LayoutRecall` 같은 공개 제품을 넣을 구조는 필요하지만, 메인 내러티브를 단순히 섞으면 브랜드 초점이 흐려진다.

## 4) Product Positioning Decision

- 상위 브랜드: `Aroido = AI-native product studio`
- 공개 제품 레이어: 실제 설치/사용/오픈소스 경로가 준비된 제품
- Labs 레이어: 게임, 프로토타입, 실험작 등 아직 제품 적합성을 다듬는 작업

## 5) Must-have Changes

1. 홈 페이지 hero / SEO / 조직 설명에서 `AI coding systems only` 문구를 제거한다.
2. 홈 페이지에 `public products + labs` 구조를 명시하는 포트폴리오 섹션을 추가한다.
3. `/projects/`에 `VibeSmith`와 `LayoutRecall`을 함께 보여주고 `Labs` 섹션을 분리한다.
4. `/projects/layoutrecall/` 상세 페이지를 추가하고 실제 제품 자산을 사용한다.
5. 사용자 노출 카피는 `en`/`ko` i18n 키를 함께 반영한다.
6. sitemap 생성 로직에 새 공개 페이지를 포함한다.

## 6) Messaging Rules

- 회사 설명은 `무엇을 만드는 방식의 팀인지`를 먼저 말한다.
- 제품 설명은 `누구를 위한 무엇인지`를 한 줄로 분명하게 말한다.
- `vibe coding`은 보조 설명 또는 팀 방법론 문맥에서만 제한적으로 사용한다.
- `Products`와 `Labs`는 같은 의미처럼 섞지 않는다.

## 7) Acceptance Criteria

1. 홈 페이지가 `회사 포지셔닝 + 포트폴리오 + 현재 공개 제품 증거` 구조를 가진다.
2. `/projects/`가 `Products + Labs` 구조로 보인다.
3. `LayoutRecall` 상세 페이지가 새로 추가되고 내부 링크로 연결된다.
4. `ko`/`en` i18n 키 parity가 유지된다.
5. `./scripts/run-ai-verify --mode full`가 통과한다.

## 8) Change Log

- 2026-04-03: 신규 작성. 다중 제품 포지셔닝과 LayoutRecall 공개 반영 범위를 정의.
