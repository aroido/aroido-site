# SEO + Marketing Deep Research (Projects / VibeSmith)

Updated: 2026-03-07

## Scope

- 프로젝트 페이지와 VibeSmith 상세 페이지의 콘텐츠 밀도와 검색 친화성을 동시에 개선한다.
- 길고 추상적인 제목을 줄이고, 스캔 가능한 구조로 재작성한다.

## Primary Sources

1. Google Search Central: Title links  
https://developers.google.com/search/docs/appearance/title-link

2. Google Search Central: Control snippets in search results  
https://developers.google.com/search/docs/appearance/snippet

3. Google Search Central: SEO Starter Guide  
https://developers.google.com/search/docs/fundamentals/seo-starter-guide

4. Google Search Central: Creating helpful, reliable, people-first content  
https://developers.google.com/search/docs/fundamentals/creating-helpful-content

5. Unbounce: Conversion Benchmark Report  
https://unbounce.com/conversion-benchmark-report/

6. Unbounce: Landing Page Conversion Rates by Industry  
https://unbounce.com/conversion-rate-optimization/average-conversion-rate-by-industry/

## Key Findings

- 검색 제목/스니펫은 짧고 구체적이며 페이지 본문과 일치해야 한다.
- 페이지별 title/description을 중복 없이 분리하는 것이 중요하다.
- 콘텐츠는 사용자 질문을 빠르게 해결하는 구조(대상/문제/증거/다음 행동)가 유리하다.
- 전환 관점에서는 추상 카피보다 문제-해결-측정 프레임이 더 설득력이 높다.

## Applied Decisions

1. 제목 단축 + 정보 밀도 상승
- VibeSmith 섹션 제목을 단문 중심으로 축약 (`Who It Fits`, `Tool Fit`, `Why Now`, `Pilot Metrics`).

2. 프로젝트 페이지 구조 재편
- 카드별로 `For / Solves / Measure` 정보를 추가해 스캔만으로 판단 가능하게 변경.

3. 페이지별 SEO 키 분리
- 각 페이지가 자체 title/description i18n 키를 사용하도록 변경.
- 공통 키 덮어쓰기 문제를 수정해 SEO 메타 일관성 확보.

4. 공유 메타 기본 보강
- 프로젝트 핵심 페이지에 canonical + OG + Twitter 메타 추가.

## Implementation Mapping

- Projects content deepening: `projects/index.html`
- VibeSmith content deepening: `projects/vibesmith/index.html`
- SEO metadata and canonical tags: `index.html`, `projects/index.html`, `projects/vibesmith/index.html`, `team/index.html`
- i18n key expansion: `i18n/messages.json`
- language application logic fix: `script.js`

## Notes

- Unbounce 자료는 벤치마크/전환 경향 참고용으로 사용했고, 제품 성과 수치는 실제 파일럿 측정값으로만 공개해야 한다.
- Google Search Central 권장사항을 기준으로 title/description/본문 일치도를 우선 적용했다.
