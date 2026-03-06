# Site Design Direction Spec (Hip v1)

Updated: 2026-03-07
Owner: Aroido Web

## Scope

- 개발 착수 전, `aroido.com` 허브 사이트의 디자인 톤과 정보구조(IA) 초안을 정의한다.
- 현재 우선순위인 `Vibesmith`를 전면에 노출하면서도, 장기적으로 Aroido 팀/프로젝트 허브로 확장 가능한 구조를 제안한다.

## Non-goals

- 픽셀 단위 최종 시안 확정
- 프론트엔드 코드 구현
- 브랜드 리뉴얼(로고/네이밍) 자체 변경

## Design Intent

- 목표 인상: `hip`, `bold`, `experimental`, `clear`.
- 기본 전략: 과도한 장식보다 강한 타이포, 분명한 내러티브, 짧고 의미 있는 모션을 우선한다.
- 제품 우선순위: 홈에서 `Vibesmith`를 첫 번째 핵심 콘텐츠로 노출한다.

## Reference Set (Latest Checked: 2026-03-07)

1. Awwwards Site of the Day  
https://www.awwwards.com/websites/sites_of_the_day/

2. Studio Dado  
https://www.studiodado.com/

3. Voku Studio  
https://voku.studio/

4. Damn Good Brands  
https://damngoodbrands.com/

5. Framer Winners Gallery  
https://www.framer.com/gallery/categories/winners/

6. The1 (Framer Site of the Year 2025)  
https://www.framer.com/gallery/the1

7. Bleed Design Studio (Framer Site of the Month)  
https://www.framer.com/gallery/bleedcom

8. CSS Design Awards - Website of the Year 2025  
https://www.cssdesignawards.com/woty2025

9. Dropbox Brand (CSSDA 9.03)  
https://www.cssdesignawards.com/woty2025/sites/dropbox-brand

10. We are Büro (CSSDA 8.74)  
https://www.cssdesignawards.com/woty2025/sites/we-are-buro

11. Godly - Exo Ape  
https://godly.website/website/exo-ape-726

12. Godly - Forner  
https://godly.website/website/837-forner

## Chosen Direction (Recommended)

### Route A: Hyper Editorial + Kinetic Grid (Recommended)

- 핵심: 대형 타이포 + 비대칭 그리드 + 섹션 전환 모션
- 장점:
  - 힙한 인상 전달력이 높음
  - 콘텐츠 확장(프로젝트 추가) 시 구조 유지가 쉬움
  - 팀 소개와 프로젝트 소개를 같은 시각 언어로 통합 가능
- 리스크:
  - 모션 과다 시 가독성/성능 저하 가능
  - 한국어/영어 혼용 시 타이포 계층 설계가 중요

## Visual System Draft

### Typography

- Display: `Clash Display` 또는 동급 Condensed/Impact 계열
- Body: `IBM Plex Sans KR`
- Meta/Label: `IBM Plex Mono`

### Color Tokens (Draft)

- `--bg-base: #f6f7f2`
- `--fg-strong: #111111`
- `--fg-muted: #5f6158`
- `--line: #d9dccf`
- `--accent-lime: #d5ff3f`
- `--accent-orange: #ff5a1f`
- `--accent-cyan: #0de8ff`

### Motion Rules

- 페이지 최초 진입: 헤드라인 1회 스태거(300~500ms)
- 스크롤 리빌: 섹션 단위 opacity/translate (과도한 parallax 금지)
- 카드 hover: scale 대신 `contrast + border + offset` 중심

## Information Architecture Draft

```txt
/
├─ /team
├─ /projects
│  └─ /projects/vibesmith
└─ /contact (optional)
```

- 네비게이션 우선순위: `Home`, `Projects`, `Team`, `Contact(optional)`
- 홈에서 `Vibesmith`를 첫 번째 featured 블록으로 고정한다.

## Page Structure Draft

### `/` Home

1. Hero Manifesto
2. Featured Project: Vibesmith
3. Selected Projects
4. Capabilities (What We Do)
5. Studio Signal (실험/노트)
6. Contact CTA

### `/projects`

1. Intro + 필터 (`Now`, `Labs`, `Archive`)
2. Project Grid
3. 프로젝트별 짧은 가치 문장

### `/projects/vibesmith`

1. Problem
2. Approach
3. Experience Demo
4. Outcome/Next
5. CTA (Try / Contact)

### `/team`

1. Team Manifesto
2. Member Cards
3. Collaboration Model

## Component Draft

- `Header/Nav`
- `Language Switch`
- `Hero Marquee`
- `Featured Project Block`
- `Project Cards Grid`
- `Signal Feed`
- `CTA Footer`

## Accessibility/Performance Baseline

- WCAG 2.2 AA 대비 색상/텍스트 대비 충족
- `prefers-reduced-motion` 대응 필수
- Core Web Vitals 목표:
  - LCP <= 2.5s
  - INP <= 200ms
  - CLS <= 0.1

## Acceptance Criteria

- 레퍼런스 링크 8개 이상이 문서에 명시된다.
- IA 트리와 페이지별 구조가 명시된다.
- 타이포/컬러/모션 초안이 포함된다.
- `Vibesmith` 우선 노출 정책이 포함된다.

## Evidence

- 본 문서의 `Reference Set` 링크
- 기존 아키텍처 합의 문서: `docs/web-research-spec-driven-summary-2026-03-06.md`
