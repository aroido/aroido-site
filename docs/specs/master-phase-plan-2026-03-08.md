# Aroido Web Master Phase Plan (2026-03-08)

## 0) 목적
- 목적: Aroido 사이트를 "힙한 인상 + 명확한 제품 설득 + 전환 가능한 구조"로 업그레이드한다.
- 대상 페이지:
  - `/` (Home)
  - `/projects/` (Product overview)
  - `/projects/vibesmith/` (Product detail)
  - `/team/` (Team)
- 원칙:
  - 디자인보다 먼저 메시지/정보구조를 확정한다.
  - 모든 작업은 `branch -> MR -> merge` 플로우로만 진행한다.
  - 실명은 공개 카피에 사용하지 않는다.

---

## 1) 성공 기준 (Final Definition of Done)
1. 첫 10초 이해도
- 방문자가 10초 안에 "무엇을 만드는 팀인지, VibeSmith가 뭘 해결하는지" 파악 가능

2. 전환 동선
- 모든 핵심 페이지에서 CTA가 `제품 보기 / 도입 문의` 2갈래로 명확

3. 콘텐츠 품질
- 한국어 번역투 최소화, 운영 내부 용어 노출 최소화
- placeholder/내부 진행 문구 사용자 노출 0건

4. 신뢰 레이어
- 실제 제품 이미지/화면 + 상태/적합팀/도입 경계 정보 제공

5. 품질 게이트
- `./scripts/ai-verify --mode full` 통과

---

## 2) 실행 페이즈

## Phase 0. Planning Lock (0.5 day)
목표:
- 리팩토링 실행 기준을 확정하고 범위를 고정

작업:
- 본 문서 확정
- 작업 우선순위 티어(P0/P1/P2) 확정
- 브랜치/워크트리 운영 룰 확인

산출물:
- `docs/specs/master-phase-plan-2026-03-08.md`

게이트:
- 범위 고정 후 새 요구는 별도 티켓으로 분리

---

## Phase 1. Content Architecture Lock (1 day)
목표:
- 모든 페이지 메시지를 한 구조로 통일

작업:
- 메시지 구조를 `Audience -> Pain -> Value -> Proof -> CTA`로 통일
- 페이지별 1차 정보 계층 재정의
- KO/EN 공통 메시지 맵 확정

산출물:
- `docs/specs/content-architecture-lock-2026-03-08.md`
- `docs/specs/copy-tone-guide-2026-03-08.md`

게이트:
- 각 페이지 Hero 문장 1개, 서브 문장 1개, CTA 2개 확정

---

## Phase 2. IA / Navigation Refactor (1 day)
목표:
- 구조 혼선을 제거하고 탐색 동선을 단순화

작업:
- 상단 네비를 `Home / Product / Team / Contact`로 정규화
- Product 허브(`/projects/`)를 중심 진입점으로 재정렬
- breadcrumb/내부 링크 정리

산출물:
- IA 반영 HTML 수정안
- 네비/링크 검증 체크리스트

게이트:
- 3클릭 내에 Home -> Product -> VibeSmith 도달 가능

---

## Phase 3. Copy Rewrite (KO-first) (1.5 days)
목표:
- 한국어 번역투 제거, 사용자 발화형 카피로 재작성

작업:
- 내부 용어 과노출 문구 정리 (`spec`, `baseline`, `active` 등)
- 긴 문장 압축, 반복 문장 제거
- VibeSmith 핵심 가치 문장 3개 확정

산출물:
- `i18n/messages.json` 카피 리라이트
- 카피 QA 체크리스트

게이트:
- 사용자 노출 카피의 placeholder/진행중 문구 0건
- 핵심 섹션 카피 길이와 톤 가이드 적합

---

## Phase 4. Visual Proof Upgrade (2 days)
목표:
- "실제 제품" 인식이 드는 증거 레이어 구축

작업:
- 홈/VibeSmith 비주얼 슬롯을 실캡처 중심으로 교체
- Proof strip 구성(적합 팀, 운영 지표, 현재 상태)
- 카드 밀도/간격/UI 위계 보정

산출물:
- 이미지 자산 반영
- 시각 섹션 업데이트

게이트:
- 핵심 페이지마다 최소 1개 이상 실사용 화면 노출
- 시각/카피의 메시지 충돌 없음

---

## Phase 5. Conversion & Interaction (1 day)
목표:
- 클릭 이후 다음 행동을 더 명확히 유도

작업:
- CTA 라벨/위치 최적화
- 이벤트 트래킹 정리(`hero_cta_click`, `contact_cta_click` 등)
- 문의 동선(버튼/링크/앵커) 통일

산출물:
- CTA/트래킹 반영
- 전환 흐름 문서

게이트:
- 모든 핵심 페이지 CTA가 동일 의미 체계 유지

---

## Phase 6. SEO / i18n / Accessibility Hardening (1 day)
목표:
- 검색/다국어/접근성 기술 기반 보강

작업:
- title/description/canonical/hreflang 점검
- 구조화 데이터(JSON-LD) 정확도 점검
- alt/키보드 포커스/대비 기본 점검

산출물:
- SEO/접근성 점검 리포트
- 수정 커밋

게이트:
- 메타/언어/접근성 주요 체크 항목 통과

---

## Phase 7. QA / Verify / Release (0.5 day)
목표:
- 배포 가능한 상태로 안정화

작업:
- 레이아웃 QA(Desktop/Mobile)
- 링크/앵커/언어전환/카피 QA
- `./scripts/ai-verify --mode full`

산출물:
- 검증 로그
- 최종 MR

게이트:
- verify 통과
- MR 승인/머지 조건 충족

---

## 3) 브랜치/MR 운영 룰 (강제)
1. 각 페이즈는 독립 브랜치에서 수행
- 예: `feat/phase-2-ia-refactor`

2. 작업 순서
- 브랜치 생성 -> 구현 -> verify -> commit -> push -> MR -> 리뷰 -> merge

3. 금지
- `main` 직접 푸시 금지
- verify 실패 상태에서 완료 선언 금지

---

## 4) 권장 일정 (총 7~8 영업일)
1. Day 1: Phase 0-1
2. Day 2: Phase 2
3. Day 3-4: Phase 3
4. Day 5-6: Phase 4
5. Day 7: Phase 5-6
6. Day 8: Phase 7 + merge/release

---

## 5) 리스크와 대응
1. 실캡처 자산 부족
- 대응: 우선순위 화면 4장부터 반영하고 나머지는 스프린트2로 분리

2. 카피 과장/추상화 회귀
- 대응: 모든 주장 문장에 근거 태그(화면/운영사실/측정지표) 매핑

3. 대규모 변경으로 UI 일관성 깨짐
- 대응: 페이즈별 UI QA 체크리스트와 스크린샷 비교 검수

---

## 6) 바로 시작할 실행 단위 (Next Actions)
1. `Phase 1` 브랜치 생성
2. 메시지 아키텍처 문서 2종 생성
3. Hero/CTA 문장 락
4. 승인 후 `Phase 2` 진입
