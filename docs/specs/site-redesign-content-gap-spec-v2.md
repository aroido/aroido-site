# Aroido Site Redesign + VibeSmith Narrative Upgrade Spec (v2)

Updated: 2026-03-07  
Owner: Aroido Web

## 1) Scope

- 현재 공개 페이지의 부족한 지점을 근거 기반으로 정리한다.
- `Aroido 팀 페이지 + 프로젝트 소개 페이지 + VibeSmith 상세 페이지`를 2026 웹 트렌드에 맞게 재설계하기 위한 다음 개발 계획을 정의한다.
- 내부 운영 용어 중심 카피를 외부 사용자 중심 카피로 전환하는 기준을 확정한다.

## 2) Non-goals

- 이번 문서에서 즉시 코드 전면 수정까지 완료하지 않는다.
- 로고/네이밍 리브랜딩 자체는 다루지 않는다.
- 결제/계정/백엔드 기능 구현은 포함하지 않는다.

## 3) Current Gap Audit (Evidence-based)

### G1. 이미지/시각 증거 부족 (P0)

- 현 상태:
  - 페이지 전반이 텍스트 블록 중심이며 제품 스크린샷, UI 캡처, 아키텍처 다이어그램이 없다.
  - `assets/` 계열 시각 리소스가 없다.
- 영향:
  - 방문자가 제품 실체를 파악하기 어렵고 신뢰 전환이 약하다.

### G2. 외부 방문자 기준으로 불명확한 카피 (P0)

- 현 상태:
  - 내부 프로세스 용어가 전면 노출된다.
  - 예: `Spec-driven workflow`, `Spec-driven Site System`.
- 근거:
  - `/index.html` featured meta: `Spec-driven workflow...` ([index.html](/Users/macmini/code/aroido-site/index.html:49))
  - `/projects/index.html` card title: `Spec-driven Site System` ([projects/index.html](/Users/macmini/code/aroido-site/projects/index.html:57))
- 영향:
  - 외부 고객은 "무엇을 해결하는 제품/팀인지"보다 내부 작업 방식만 보게 된다.

### G3. VibeSmith 서사 밀도 부족 (P0)

- 현 상태:
  - Problem/Approach/Experience/Outcome가 모두 1단락 수준으로 깊이가 얕다.
  - 기능 증거(스크린샷, 비교표, 실제 플로우, 통합 방식, 상태/로드맵)가 없다.
- 근거:
  - `/projects/vibesmith/index.html` 핵심 본문이 단문 카드 4개 + 스택 리스트 3개로 구성됨 ([projects/vibesmith/index.html](/Users/macmini/code/aroido-site/projects/vibesmith/index.html:38), [projects/vibesmith/index.html](/Users/macmini/code/aroido-site/projects/vibesmith/index.html:67))
- 영향:
  - "아이디어 단계인지, 실제 사용 가능한 제품인지" 판단하기 어렵다.

### G4. 프로젝트 분류의 설득력 부족 (P1)

- 현 상태:
  - `Now/Labs/Archive` 필터 UI는 있으나 실제 필터 동작/상태 배지가 없다.
  - 카드가 운영 항목과 제품 항목이 혼합되어 외부 관점의 의미가 약하다.
- 근거:
  - `/projects/index.html` 필터 버튼은 정적 UI 상태 ([projects/index.html](/Users/macmini/code/aroido-site/projects/index.html:39))
- 영향:
  - "대표 제품 포트폴리오" 페이지보다 "내부 메모"처럼 보일 수 있다.

### G5. 전환 경로(CTA)의 제품 맥락 부족 (P1)

- 현 상태:
  - `Run readiness check`, `Request intro` 등 추상 CTA가 반복된다.
  - 데모 신청, 파일럿 신청, 문서 보기 등 명확한 액션 분기가 없다.
- 영향:
  - 관심 사용자도 다음 행동을 선택하기 어렵다.

## 4) Product Narrative Requirements (MUST)

아래 질문에 방문자가 15초 안에 답할 수 있어야 한다.

1. `Aroido`는 어떤 팀인가?
2. `VibeSmith`는 정확히 어떤 문제를 푸는가?
3. 기존 방식 대비 무엇이 달라지는가?
4. 지금 어디까지 개발되었는가?
5. 지금 내가 할 수 있는 다음 행동은 무엇인가?

## 5) Source-of-Truth Content Contract

VibeSmith 콘텐츠는 아래 문서를 기준으로 동기화해야 한다.

- Private GitLab `aroido/vibesmith`:
  - `README.md`
  - `docs/features/user-needs-analysis.md`
  - `docs/features/distribution-launch/phase1-phase2-gtm-messaging-and-ai-automation.md`
  - `docs/features/distribution-launch/product-hunt-launch-kit.md`
  - `docs/features/distribution-launch/launch-readiness-checklist.md`

규칙:

- 공개 페이지 카피는 위 문서의 사실 기반 문장만 사용한다.
- 추정 문장은 `가설`로 명시하거나 제외한다.

## 6) IA + Section Redesign (v2)

### 6.1 `/` Home (Team + Flagship Hub)

필수 섹션:

1. Hero: `Aroido = broader product studio/team`, `VibeSmith = current public focus`.
2. Evidence Strip: 핵심 지표 3개 (예: setup time, first-scan success, drift reduction).
3. VibeSmith Visual Block: 제품 스크린샷 1장 + 3문장 요약.
4. Why Us: 팀 운영 방식은 "고객 가치 관점"으로 재서술.
5. Active Projects: 외부 공개 가능한 프로젝트만 노출.
6. CTA Split: `데모 보기`, `파일럿 문의`, `문서 보기`.

### 6.2 `/projects`

필수 섹션:

1. Product Index Intro: 공개 가능한 제품 카탈로그.
2. Status Filters: `Live`, `Beta`, `Lab`, `Archive` + 실제 필터 동작.
3. Project Cards: 각 카드에 `한 줄 가치`, `현재 상태`, `대상 사용자`, `다음 액션`.
4. Internal Track 분리: 내부 운영 시스템은 별도 섹션 또는 숨김 처리.

### 6.3 `/projects/vibesmith`

필수 섹션:

1. Positioning: 한 줄 정의 + 대상 사용자.
2. Pain Snapshot: 기존 워크플로우의 병목 3가지.
3. Workflow Before/After: 단계 비교(표 또는 다이어그램).
4. Core Features: 5개 이하 핵심 기능 + 각 기능 스크린샷.
5. Integrations: Cursor/Claude Code 연계 범위 명시.
6. Current Status: `Alpha/Beta/GA` 상태 + 현재 제한사항.
7. Roadmap: Phase 1, Phase 2 계획.
8. Social Proof: 사용 시나리오/테스트 피드백/수치 근거.
9. CTA: `파일럿 신청`, `업데이트 구독`, `문서 확인`.

## 7) Visual Asset Production Spec (MUST)

필수 에셋 목록:

1. Home Hero Key Visual 1종 (`1920x1080`, WebP).
2. VibeSmith Product Screenshot 4종 (`1600x1000` 권장).
3. Workflow Before/After Diagram 1종 (SVG).
4. Integrations Matrix Graphic 1종 (SVG/PNG).
5. OG Image 2종 (`aroido.com`, `vibesmith` 각각 1200x630).

규칙:

- 더미 일러스트/랜덤 스톡 이미지는 금지.
- 모든 이미지에 대체 텍스트를 제공한다.
- 이미지 없는 카드형 텍스트 섹션은 페이지당 최대 2개로 제한한다.

## 8) Copywriting Rules (Public-facing)

MUST:

- 결과 중심 문장 사용: `무엇을 개선하는지`를 먼저 말한다.
- 기술 용어는 사용자 문제와 같이 제시한다.
- 각 섹션 첫 문장은 18단어 이내(영문 기준)로 간결하게 작성한다.

MUST NOT:

- 내부 운영 용어를 전면 카피로 사용:
  - `spec-driven`, `verification gate`, `issue-to-merge` 단독 노출 금지
- 근거 없는 수치 표현 금지.
- 정체가 불분명한 추상 슬로건 반복 금지.

## 9) Implementation Plan (Next Development)

### Phase 0: Content Lock (1 day)

- GitLab VibeSmith 문서에서 사실 기반 문장 추출.
- KO/EN 공통 콘텐츠 맵 작성.
- 산출물:
  - `docs/specs/content-source-map-vibesmith.md`
  - `docs/specs/public-copy-guidelines.md`

### Phase 1: Content Model + Assets Skeleton (2 days)

- `content/` JSON 스키마 도입:
  - `content/site.en.json`
  - `content/site.ko.json`
- 페이지별 섹션 키 확장.
- 이미지 슬롯/alt 규칙 구현.

### Phase 2: UI Refactor + Narrative Upgrade (3 days)

- Home/Projects/VibeSmith 페이지 재구성.
- 내부 용어 카피 제거.
- VibeSmith 상세 섹션(Workflow/Integrations/Status/Roadmap) 추가.

### Phase 3: Proof + Conversion Layer (2 days)

- CTA를 `데모`, `파일럿`, `문서`로 분기.
- OG/SEO 메타 강화.
- 이벤트 측정 포인트 정의(CTA 클릭, 스크롤 깊이).

### Phase 4: QA + Launch (1 day)

- i18n parity 점검.
- 접근성/모바일/성능 점검.
- `./scripts/ai-verify --mode full` + 수동 QA 체크리스트 통과.

## 10) Acceptance Criteria

1. 홈/프로젝트/바이브스미스 모든 페이지에 실제 제품 시각 자료가 반영된다.
2. 공개 카피에서 내부 운영 용어 중심 문장이 제거된다.
3. VibeSmith 페이지에 `Before/After`, `Integrations`, `Status`, `Roadmap`이 모두 포함된다.
4. CTA가 최소 2개 이상 명확한 액션으로 분기된다.
5. KO/EN 문구 키 불일치가 없다.
6. `./scripts/ai-verify --mode full`가 통과한다.

## 11) Risk and Dependency

- 제품 스크린샷 원본 부재 시 일정 지연 가능.
- 수치형 증거 데이터가 없으면 카피 품질이 다시 추상화될 위험.
- 팀 내 공개 가능 범위 확정이 늦어지면 콘텐츠 확정이 지연됨.

## 12) Immediate Backlog (Recommended)

1. 현재 `Spec-driven` 카피를 외부 사용자 언어로 교체.
2. VibeSmith 상세 페이지에 `개발 상태 배지`와 `제한사항` 섹션 추가.
3. 최소 2장의 실제 제품 캡처 이미지를 우선 반영.
4. Projects 페이지에서 내부 시스템 카드를 외부 공개 영역과 분리.
5. CTA를 `데모`/`파일럿`/`문서` 3갈래로 개편.
