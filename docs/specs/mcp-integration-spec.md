# MCP Integration Spec (Aroido)

Updated: 2026-03-07

## Scope

- `aroido-site`에서 실사용 가능한 MCP 서버 프로필을 정의한다.
- 웹 개발/운영에 필요한 도구 접근을 표준화한다.

## Non-goals

- MCP 서버별 권한 발급/계정 온보딩 자동화
- 개별 MCP 서버의 내부 기능 문서화

## Applied MCP Servers

1. `glab` (stdio)
- command: `glab mcp serve`
- 목적: GitLab 이슈/MR/파이프라인 컨텍스트

2. `playwright` (stdio)
- command: `npx @playwright/mcp@latest`
- 목적: 브라우저 자동화, 사용자 흐름 점검, E2E 보조

3. `chrome-devtools` (stdio)
- command: `npx -y chrome-devtools-mcp@latest`
- 목적: 성능/네트워크/콘솔/렌더링 디버깅

4. `vercel` (http)
- url: `https://mcp.vercel.com`
- 목적: 배포/프로젝트/환경 컨텍스트

5. `flyctl` (http local)
- url: `http://127.0.0.1:8080`
- 목적: Fly.io 인프라/앱 컨텍스트
- 실행 전 `flyctl mcp server`를 먼저 실행한다.

## Optional MCP Candidates

- 현재 범위 제외
  - `Figma Dev Mode MCP` (디자이너 부재로 현 단계 제외)
  - `Sentry MCP` (관측 도구 미도입 상태로 현 단계 제외)

## Requirements

1. MCP 설정은 `.codex/mcp.json`을 SSOT로 MUST 관리한다.
2. 시크릿 토큰은 MUST 코드/문서에 하드코딩하지 않는다.
3. 실험 단계 서버는 SHOULD 운영 가드(실행 조건/롤백 경로)를 문서화하고 포함한다.
4. MCP 추가/변경 시 출처 링크를 Evidence에 MUST 남긴다.

## Acceptance Criteria

- `.codex/mcp.json`에 5개 기본 MCP 서버가 정의되어 있다.
- `playwright` 및 `chrome-devtools` 패키지가 NPM registry에서 확인된다.
- `flyctl`이 설치되어 있고 버전 조회가 가능하다.

## Evidence

- GitLab MCP serve: https://docs.gitlab.com/cli/mcp/serve/
- Playwright MCP: https://github.com/microsoft/playwright-mcp
- Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Vercel MCP: https://vercel.com/docs/mcp/vercel-mcp
- Fly.io MCP docs: https://fly.io/docs/mcp/
