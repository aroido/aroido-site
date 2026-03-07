# Aroido UI/UX + Content Deep Research (2026-03-07)

## 1) Goal
- 대상: `aroido.com` 홈/프로덕트/VibeSmith 페이지
- 목적: 리팩토링 이후 UI/UX와 콘텐츠를 "전환/신뢰/검색" 기준으로 재정렬
- 기준일: 2026-03-07 (KST)

## 2) External Findings (with evidence)

### A. IA/Navigation and Homepage quality is usually weak (opportunity)
- Baymard 2025 benchmark: 모바일 사이트의 `67%`가 홈/카테고리 내비 UX가 "mediocre~poor" 수준.
- 데스크톱도 `58%`가 "mediocre~poor".
- 해석: 홈의 정보 구조와 라벨 명확성만 잘해도 경쟁 우위 만들기 쉬움.
- Source:
  - https://baymard.com/blog/ecommerce-navigation-best-practice
  - https://baymard.com/research/homepage-and-category-usability

### B. SEO는 "검색엔진용 문서"가 아니라 "사람 우선 콘텐츠"가 핵심
- Google Search Central: 사람에게 도움이 되는 콘텐츠를 우선하고, 검색엔진-first 콘텐츠를 피하라고 명시.
- Page Experience는 단일 신호가 아니라 종합 품질이며, CWV만 맞춘다고 순위 보장되지 않음.
- Source:
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
  - https://developers.google.com/search/docs/appearance/page-experience

### C. 성능 기준은 여전히 CWV 3축 (LCP/INP/CLS)
- web.dev 기준: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 (75th percentile 기준).
- Source:
  - https://web.dev/articles/vitals

### D. 접근성은 WCAG 2.2를 기준으로 잡는 게 최신
- WCAG 2.2는 2023-10-05 Recommendation, 2.1 대비 9개 기준 추가.
- 특히 Focus/Target Size/Authentication 관련 강화.
- Source:
  - https://www.w3.org/TR/WCAG22/
  - https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

### E. 다국어 SEO는 `hreflang` 명시가 정석
- 다국어 페이지는 alternate/hreflang을 명시해 사용자 언어에 맞는 페이지를 연결.
- Source:
  - https://developers.google.com/search/docs/specialty/international/localized-versions

### F. Software product 노출 개선에 structured data 사용 가능
- SoftwareApplication structured data를 통해 앱 정보 리치 결과 후보를 만들 수 있음.
- Source:
  - https://developers.google.com/search/docs/appearance/structured-data/software-app

### G. 2026 AI dev-tool 랜딩 공통 패턴 (경쟁사 관찰)
- 공통 패턴:
  - 인터랙티브 제품 데모를 최상단에서 즉시 노출
  - 수치형 성과/고객 인용문/로고를 빠르게 제시
  - 보안/엔터프라이즈 적합성 섹션 분리
  - 도입 경로(문서, 설치, 데모) CTA를 명확히 분기
- 관찰 대상:
  - Cursor: https://cursor.com/
  - Claude Code: https://claude.com/product/claude-code
  - Sourcegraph Cody: https://sourcegraph.com/cody
  - GitHub Copilot: https://github.com/features/copilot
  - Replit: https://replit.com/
- Inference:
  - "힙한 비주얼"만으로는 부족하고, `Proof + Trust + Action path` 3요소가 함께 있어야 실제 설득력이 생김.

### H. 한국어 카피는 "짧고, 행동 단위가 명확한 문구"가 실험에서 유리
- 토스 UX Writing (2026-01-30):
  - 한 문장 하나의 핵심
  - 행동을 가볍게 표현
  - 조건/행동을 숫자로 구체화
  - 실제 실험에서 CTR/CVR 개선 사례 제시
- 토스 실험 설계 (2026-02-27):
  - 우선순위는 속도 x 임팩트
  - 가설은 한 번에 하나 검증
  - 기존 러닝의 "왜"를 재사용
- Source:
  - https://toss.tech/article/Marketing_Writing
  - https://toss.tech/article/45391

### I. 제품 문제 정의(컴포넌트 운영 난이도) 자체는 여전히 유효
- Anthropic docs: CLAUDE.md 메모리 계층/재귀 로딩/팀-개인 설정 분리 지원.
- MCP spec: OAuth 기반 인증/인가/발견 메커니즘이 복잡하고 구현 요구사항 많음.
- Inference:
  - 멀티 레포/멀티툴 환경에서 "운영 표준화" 문제는 실제로 계속 커짐.
- Source:
  - https://docs.anthropic.com/ko/docs/claude-code/memory
  - https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
  - https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization

## 3) Current Site Diagnosis (main)

### Strengths
- 디자인 톤/브랜딩 일관성은 이미 확보됨.
- 문제-접근-성과 내러티브와 VOICE 인터랙션이 존재.
- 다국어 전환(EN/KO) 구조가 이미 있음.

### Gaps
- 홈 상단에서 "즉시 신뢰"를 주는 정량 증거(고객/성과/보안)가 약함.
- 제품 비주얼이 여전히 placeholder 중심이라 제품 실체감이 낮음.
- CTA가 "어떤 상태의 사용자에게 어떤 다음 행동인지" 분기가 약함.
- SEO 기술 요소(`hreflang`, structured data, image SEO 룰) 미적용.
- 실험 프레임(가설/지표/학습 루프)이 페이지 구조에 내장되어 있지 않음.

## 4) Priority Plan

### P0 (1-2주): 전환 직결
1. 홈 히어로 바로 아래 `Proof Strip` 추가
- 내용: 수치 3개 + 로고 + 신뢰 한 줄
- 예: "파일럿 기준 세팅 시간 xx% 단축", "멀티 레포 n개 운영 팀 검증"

2. Placeholder 전면 교체
- 최소: Hero GIF 1 + 실제 스크린샷 4
- 각 미디어는 "무엇을 해결하는 화면인지" 캡션 포함

3. CTA 구조 재설계
- Primary: `데모 보기` 또는 `파일럿 신청`
- Secondary: `기술 문서 보기`
- Tertiary: `문제 진단 체크리스트 받기`

4. 카피 리라이트 (KO-first)
- 토스 원칙 적용: 한 문장 한 핵심, 행동 구체화, 숫자/조건 명확화

### P1 (2-4주): 검색/신뢰 강화
1. SEO 기술 보강
- `hreflang` en/ko 양방향
- `SoftwareApplication` structured data
- 이미지 alt/파일명/랜딩텍스트 정렬

2. Trust 섹션 강화
- Security/Privacy/Boundary 섹션 명시
- MCP/OAuth 운영 경계와 팀 정책 지원 포인트를 간결히 설명

3. 사례형 콘텐츠 1개 작성
- "문제 -> 적용 -> 수치 변화 -> 다음 단계" 구조

### P2 (4-8주): 성장 루프
1. 페이지 A/B 테스트 체계화
- 실험 단위: Hero 카피, CTA 텍스트, 증거 블록 순서
- 원칙: 한 번에 한 가설

2. 콘텐츠 허브 확장
- "운영 가이드", "도입 체크리스트", "실패 패턴" 문서화
- docs와 마케팅 페이지 문구의 용어 체계 통일

## 5) Measurement Framework

### North-star
- `Qualified demo request rate` (세션 대비 데모/파일럿 신청 비율)

### Leading metrics
- Hero CTA CTR
- Product detail scroll depth (25/50/75/100)
- VOICE 섹션 탭 상호작용률
- Contact initiation rate

### Technical guardrails
- CWV (LCP/INP/CLS) pass rate at p75
- 접근성 검사(키보드 포커스, target size, contrast) 통과율

## 6) Immediate Backlog (implementation-ready)
1. 홈 `Proof Strip` 컴포넌트 추가
2. 홈 미디어 placeholder를 실제 캡처로 교체
3. KO 카피 1차 리라이트(히어로/핵심 섹션/CTA)
4. `hreflang` 및 JSON-LD 삽입
5. 이벤트 로깅 추가 (`hero_cta_click`, `voice_tab_switch`, `contact_cta_click`)

## 7) Decision
- 권장: "디자인 고도화"보다 먼저 "증거/행동 동선"을 고정한 뒤 비주얼을 올리는 순서.
- 이유: 경쟁사와 비교 시 승부는 비주얼의 화려함보다 `신뢰 증거 + 명확한 다음 행동`에서 발생함 (Inference).
