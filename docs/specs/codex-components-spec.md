# Aroido Codex Components Spec

Updated: 2026-03-07

## Scope

- `aroido-site` 웹 개발에 필요한 Codex 운영 컴포넌트 체계를 정의한다.
- 특히 Vibesmith의 `work-session` 운영 모델을 GitLab 기반으로 이식한다.

## Non-goals

- 이번 문서는 실제 제품 UI 컴포넌트 설계를 다루지 않는다.
- 외부 SaaS 계정/권한 자동 프로비저닝은 범위에서 제외한다.

## Component Map

| Category | Required Components | Purpose |
| --- | --- | --- |
| Rules | `spec-driven-workflow`, `web-best-practices`, `i18n-required`, `seo-baseline` | 실행 기준/금지 사항 고정 |
| Commands | `spec-create`, `spec-review`, `work-session`, `i18n-audit`, `seo-checklist`, `deploy-preview` | 반복 절차 표준화 |
| Skills | `agent-spec-writer`, `agent-ui-implementer`, `agent-i18n-operator`, `agent-seo-optimizer`, `subagent-pr-reviewer`, `subagent-e2e-tester`, `command-work-session`, `command-i18n-audit`, `command-seo-checklist`, `command-deploy-preview`, `perf-a11y`, `landing-page`, `project-page`, `seo-copy`, `deploy-vercel` | 역할 분담 및 재사용 |
| Hooks | `pre-push`, `commit-msg` | 로컬 품질 게이트 선차단 |
| MCP | `glab`, `playwright`, `chrome-devtools`, `vercel`, `flyctl` | 이슈/MR/브라우저 자동화/디버깅/배포/인프라 컨텍스트 연동 |
| Scripts | `i18n-audit`, `work-session-preflight`, `work-session-bootstrap-labels`, `work-session-kpi`, `notify-moshi` | 번역 검증/세션 진단/레이블 부트스트랩/성과 집계/태스크 완료 알림 |

## Work Session Adaptation (from Vibesmith)

- 유지한 원칙
  - `Issue -> Spec -> Implementation` 순서
  - `branch -> commit -> push -> MR -> merge` 순서
  - 세션 상태 파일 저장/재개(`.codex/.last-session.json`)
  - 종료 KPI 요약(`.work-session-summary.md`)
- GitLab에 맞춘 변경
  - 상태 관리는 Project status 대신 레이블(`Ready/In progress/In review/Done`)을 기본으로 사용
  - `gh` 기반 명령을 `glab` 중심으로 대체
  - 검증 게이트를 `./scripts/ai-verify --mode full`로 통일

## MCP Profile (Applied)

- `glab` (stdio): GitLab 이슈/MR/파이프라인 컨텍스트
- `playwright` (stdio): 브라우저 상호작용/E2E 자동화
- `chrome-devtools` (stdio): 성능/네트워크/콘솔 디버깅
- `vercel` (http): 배포/프로젝트 컨텍스트
- `flyctl` (http local): 로컬 MCP 엔드포인트(`http://127.0.0.1:8080`), 사용 전 `flyctl mcp server` 실행

## Best-Practice Requirements

1. 접근성
   - 변경사항은 WCAG 2.2 AA 기준을 SHOULD 만족한다.
   - 커스텀 상호작용 위젯은 APG 키보드 패턴을 SHOULD 따른다.
2. 성능
   - Core Web Vitals p75 목표: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
3. 보안
   - OWASP Top 10:2025 체크리스트를 MUST 점검한다.
   - CSP는 Report-Only로 시작해 SHOULD 점진 강화한다.
   - 외부 리소스는 SRI를 SHOULD 적용한다.
4. 데이터/규격
   - OpenAPI는 3.1.2 이상(가능하면 3.2.0) 사용을 SHOULD 기준으로 한다.
   - JSON Schema는 2020-12를 SHOULD 사용한다.
   - 타임스탬프는 RFC 3339를 MUST 사용한다.

## Mandatory i18n Requirement

- 기본 사용자 언어는 `ko`/`en` 2개를 MUST 지원한다.
- 신규 사용자 노출 문구 추가 시 `ko`/`en`을 MUST 동시 반영한다.
- 브라우저/저장된 설정 기반 언어 선택 + fallback(`en`)을 MUST 지원한다.

## Acceptance Criteria

- `.codex` 하위에 Rules/Commands/Skills/Hooks/MCP 파일이 존재한다.
- `work-session` 명령 정의가 GitLab 흐름으로 문서화되어 있다.
- i18n/preflight/bootstrap/kpi 스크립트가 저장소에 존재하고 실행 가능하다.
- Moshi 알림 스크립트가 저장소에 존재하고 환경변수 기반으로 동작한다.
- Moshi 알림 `message` 한국어 중심 정책이 규칙/스크립트에 반영되어 있다.
- Moshi 알림 실패 시 재시도/큐잉 폴백이 규칙/스크립트에 반영되어 있다.
- 브랜치 기반 작업 및 MR 머지 절차가 규칙/스펙에 명시되어 있다.
- `ko`/`en` i18n 규칙과 페이지 구현이 존재한다.
- `./scripts/ai-verify --mode full`가 통과한다.

## Evidence

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/
- Core Web Vitals: https://web.dev/articles/vitals
- Core Web Vitals thresholds: https://web.dev/articles/defining-core-web-vitals-thresholds
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- CSP header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
- SRI: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
- OpenAPI 3.2.0: https://spec.openapis.org/oas/v3.2.0.html
- OpenAPI 3.1.2: https://spec.openapis.org/oas/v3.1.2.html
- JSON Schema 2020-12: https://json-schema.org/draft/2020-12
- RFC 2119: https://www.rfc-editor.org/rfc/rfc2119
- RFC 8174: https://www.rfc-editor.org/rfc/rfc8174
- RFC 3339: https://www.rfc-editor.org/rfc/rfc3339
- GitLab MCP: https://docs.gitlab.com/cli/mcp/serve/
