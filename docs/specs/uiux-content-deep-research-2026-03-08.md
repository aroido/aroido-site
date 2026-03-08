# Aroido Site Deep Research (2026-03-08)

## 1) 목표
- 질문: "우리 사이트를 더 힙하고, 더 설득력 있게 만들려면 무엇을 먼저 고쳐야 하는가?"
- 범위: `index.html`, `projects/index.html`, `projects/vibesmith/index.html`, `team/index.html`, `i18n/messages.json`
- 방법:
  1. 2026 시점에서 성공적인 팀/제품 페이지 패턴 조사
  2. 현재 사이트 구조/카피/정보밀도 정량 점검
  3. 갭을 P0/P1/P2로 우선순위화

---

## 2) 외부 벤치마크에서 공통으로 보이는 패턴

### P-A. Hero는 "한 문장 정의 + 즉시 행동"으로 끝낸다
- Stripe, Vercel, Linear, Notion, Supabase 모두 첫 화면에서 제품 정의가 짧고 CTA가 즉시 보인다.
- 특히 "문제 설명 장문"보다 "가치 문장 + 버튼" 구조를 먼저 둔다.
- 예시:
  - Stripe: https://stripe.com/
  - Vercel: https://vercel.com/
  - Linear: https://linear.app/
  - Notion: https://www.notion.com/
  - Supabase: https://supabase.com/

### P-B. 신뢰(Proof)는 상단에서 빠르게 준다
- 성공 페이지는 상단 근처에서 "누가 쓰는지" 혹은 "얼마나 쓰는지"를 보여준다.
- Linear/Notion/Supabase는 로고/대규모 사용 지표/신뢰 문장으로 초기 이탈을 낮추는 구조를 쓴다.

### P-C. IA는 깊게 설명하기 전에 스캔 가능해야 한다
- Baymard 2025 데이터에서 내비게이션 품질이 미흡한 사이트 비율이 높게 나타난다.
- 해석: 카테고리/라벨/동선이 분명하면 경쟁 우위를 만들 여지가 크다.
- 출처:
  - https://baymard.com/blog/ecommerce-navigation-best-practice
  - https://baymard.com/research/homepage-and-category-usability

### P-D. 검색/콘텐츠는 사람 우선 원칙이 기준
- Google Search Central은 사람에게 유용한 콘텐츠를 우선하고, 검색엔진만 겨냥한 작성은 지양하라고 명시한다.
- 제목(title)은 페이지 내용을 대표하는 짧고 명확한 형태가 권장된다.
- 출처:
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
  - https://developers.google.com/search/docs/appearance/title-link

### P-E. 다국어는 URL/언어버전 설계가 핵심
- Google 가이드는 언어별로 서로 다른 URL을 제공하고 `hreflang`으로 연결하라고 안내한다.
- 출처:
  - https://developers.google.com/search/docs/specialty/international/localized-versions

### P-F. "힙함"은 장식이 아니라 리듬
- NN/g의 웹 읽기 패턴 연구는 사용자가 페이지를 촘촘히 읽기보다 빠르게 훑는 경향을 보여준다.
- 따라서 힙한 톤도 "짧은 헤드라인 + 블록 리듬 + 빠른 증거"를 전제로 해야 작동한다.
- 출처:
  - https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/

---

## 3) 현재 Aroido 사이트 진단 (정량 + 정성)

## 3.1 정량 스냅샷
- i18n 키 총 320개 중 실제 페이지에서 사용되는 키 179개, 미사용 키 139개.
  - 의미: 이전 서사 자산이 화면에 반영되지 않아 콘텐츠 부채가 큼.
- 한글 카피 320개 중 영문 혼입 문자열 75개.
  - 의미: 한국어 페이지에서 번역투/용어 혼선 체감이 발생하기 쉬움.
- 홈/상세 모두 "placeholder 교체 안내 문구"가 사용자 노출 영역에 남아 있음.
  - 의미: 제품 완성도 인식 저하.

## 3.2 구조/내비게이션 갭
- 메인 내비게이션이 `Home / VibeSmith / Team / Contact`인데 `projects` 허브가 구조적으로 약하다.
- 실제로는 제품 개요 페이지(`projects`)가 있지만 내비에서 일관된 정보 구조가 드러나지 않는다.
- 결과: "우리 팀이 무엇을 만들고 무엇이 라이브인지"를 한 번에 이해하기 어렵다.

## 3.3 카피/메시지 갭
- 현재 카피는 "파일럿/롤아웃/운영 지표" 중심 문장이 과도하게 반복된다.
- 문제는 이 문장이 나쁘다는 게 아니라, "사용자 상황 -> 즉시 가치"보다 먼저 나와서 진입 장벽을 만든다는 점이다.
- 특히 한국어에서 다음 문제가 크다:
  - 영어 용어 혼입(`rules`, `settings`, `Active`, `baseline`, `Team Beta/Cloud`)
  - 운영 문체 과밀(정책/측정/단계 설명이 첫 인상에서 비중 과다)

## 3.4 신뢰/증거 갭
- 시각 영역이 아직 "실제 제품 캡처"보다 설명 오버레이 중심이다.
- 고객 로고, 케이스, 실제 도입 결과(익명 정량 포함) 같은 proof 레이어가 상단에 부족하다.
- 결과: 힙한 비주얼은 있으나 "실체가 있는 제품" 인식이 약하다.

## 3.5 SEO/국제화 갭
- 현재 언어 전환은 클라이언트 JS + query 기반이며, canonical/메타 운영이 언어별 랜딩 관점에서 약하다.
- `hreflang`은 있으나 실질적으로 언어별 독립 페이지 전략(정적 URL 분리)이 부족하다.
- 결과: 한국어/영어 각각의 검색 의도에 맞춘 랭킹/스니펫 최적화가 제한될 수 있다.

---

## 4) 우선순위 (P0/P1/P2)

### P0 (이번 스프린트)
1. 메시지 압축
- Hero/서브헤드/CTA를 "한 문장 가치 + 한 행동"으로 재작성.
- 파일럿/운영 용어는 하단 상세 섹션으로 이동.

2. Proof 상단 배치
- Hero 직후에 `신뢰 스트립` 추가:
  - 대상 팀 조건(예: 3+ repo 운영 팀)
  - 도입 결과 지표(익명)
  - 협업/검증 상태

3. Placeholder 문구 제거
- "replace when ready" 같은 내부 진행 문구를 사용자 영역에서 제거.
- 화면은 실제 캡처 기반 캡션으로 전환.

4. 정보 구조 단순화
- 내비게이션을 `Home / Product / Team / Contact`로 정규화하고,
- Product 페이지 안에서 `VibeSmith`를 대표 카드로 보여주는 흐름으로 통일.

### P1 (다음 스프린트)
1. KO 카피 네이티브화
- 영문 혼입 키를 우선 정리(75개 -> 20개 이하).
- 엔지니어 용어는 각주/툴팁이나 하단 설명으로 이동.

2. VibeSmith 상세 페이지 확장
- 현재 숨겨진/미반영 콘텐츠 자산(미사용 i18n 키) 중 유효한 섹션을 복원:
  - 팀이 실제로 하는 말(voice)
  - Before/After
  - FAQ

3. 다국어 SEO 구조 개선
- 언어별 정적 URL 분리(예: `/ko/...`, `/en/...`) 검토.
- 페이지별 title/description을 언어 맥락에 맞게 분리 관리.

### P2 (지속 개선)
1. 전환 실험 루프
- 실험 단위: Hero 문장, CTA 라벨, Proof 블록 순서.
- 이벤트: hero CTA CTR, section scroll depth, contact start rate.

2. 사례 콘텐츠 축적
- "문제 -> 적용 -> 결과" 포맷의 케이스 노트 3개 이상 공개.

---

## 5) 다음 리디자인을 위한 콘텐츠 원칙 (요약)
1. 첫 5초:
- "우리가 누구인지"보다 "당신의 어떤 운영 문제를 줄이는지"를 먼저 보여준다.

2. 첫 15초:
- 증거(화면/지표/상태)를 한 블록에서 끝낸다.

3. 첫 30초:
- 다음 행동을 2개로만 제한한다.
  - `제품 흐름 보기`
  - `도입 적합성 확인`

4. 한국어 우선:
- 번역체가 아니라 실제 팀 대화체로 작성한다.
- 동일 의미 반복 문장을 줄이고 용어 사전을 고정한다.

---

## 6) 참고 링크
- Stripe: https://stripe.com/
- Vercel: https://vercel.com/
- Linear: https://linear.app/
- Notion: https://www.notion.com/
- Supabase: https://supabase.com/
- Cursor: https://cursor.com/
- Claude Code: https://claude.com/product/claude-code
- GitHub Copilot: https://github.com/features/copilot
- Baymard navigation: https://baymard.com/blog/ecommerce-navigation-best-practice
- Baymard research: https://baymard.com/research/homepage-and-category-usability
- Google helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google title links: https://developers.google.com/search/docs/appearance/title-link
- Google localized versions: https://developers.google.com/search/docs/specialty/international/localized-versions
- web.dev vitals: https://web.dev/articles/vitals
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- NN/g F-pattern: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Toss UX writing: https://toss.tech/article/Marketing_Writing
