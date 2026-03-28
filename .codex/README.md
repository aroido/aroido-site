# Aroido Codex Components

`aroido-site`에서 사용하는 Codex 운영 컴포넌트의 기준 구조입니다.

## 목적

- 웹 개발을 `Spec-Driven`으로 일관되게 수행한다.
- Work Session 기반으로 여러 이슈를 안전하게 연속 처리한다.
- GitHub + `gh` + 로컬 검증(`./scripts/ai-verify`)을 기본 파이프라인으로 고정한다.
- GitLab + `glab`는 mirror 상태 확인 또는 내부 워크플로우가 필요할 때만 보조로 사용한다.

## 구성 요소

- `commands/`: 반복 작업 실행 절차 정의
- `skills/`: 재사용 가능한 역할/작업 단위
- `rules/`: 프로젝트 강제 규칙
- `hooks/`: 로컬 사전 차단 훅
- `mcp.json`: MCP 서버 연결 설정
- `scripts/*`: preflight/bootstrap/kpi/notification 실행 스크립트

## 브랜치 원칙

- 모든 태스크는 `1 task = 1 branch/worktree`를 따른다.
- 완료 경로는 `branch -> commit -> push -> GitHub PR -> merge` 순서를 기본으로 강제한다.
- 보호 브랜치 직접 push는 금지한다.

## 현재 활성 컴포넌트

- Commands
  - `work-session.md`
  - `long-horizon.md`
  - `spec-create.md`
  - `spec-review.md`
  - `i18n-audit.md`
  - `seo-checklist.md`
  - `deploy-preview.md`
- Skills
  - `command-work-session`
  - `command-long-horizon`
  - `agent-spec-writer`
  - `subagent-pr-reviewer`
  - `perf-a11y`
  - `agent-ui-implementer`
  - `agent-i18n-operator`
  - `agent-seo-optimizer`
  - `subagent-e2e-tester`
  - `landing-page`
  - `project-page`
  - `seo-copy`
  - `deploy-vercel`
  - `command-i18n-audit`
  - `command-seo-checklist`
  - `command-deploy-preview`
- Rules
  - `spec-driven-workflow.md`
  - `web-best-practices.md`
  - `i18n-required.md`
  - `seo-baseline.md`
- Hooks
  - `pre-push`
  - `commit-msg`
- MCP
  - `glab` (`glab mcp serve`)
  - `playwright` (`npx @playwright/mcp@latest`)
  - `chrome-devtools` (`npx -y chrome-devtools-mcp@latest`)
  - `vercel` (`https://mcp.vercel.com`)
  - `flyctl` (`http://127.0.0.1:8080`, run `flyctl mcp server` first)
- Scripts
  - `scripts/codex-notify-context`
  - `scripts/i18n-audit.sh`
  - `scripts/run-ai-verify`
  - `scripts/work-session-preflight.sh`
  - `scripts/work-session-bootstrap-labels.sh`
  - `scripts/work-session-kpi.sh`
  - `scripts/notify-moshi.sh`
  - `scripts/long-horizon-bootstrap.sh`
  - `scripts/long-horizon-checkpoint.sh`
  - `scripts/long-horizon-kpi.sh`
  - `scripts/long-horizon-loop.sh`

## Long-Horizon Memory Templates

장기 연속 실행용 템플릿은 아래 경로를 사용한다.

- `.codex/templates/long-horizon/Prompt.md`
- `.codex/templates/long-horizon/Plan.md`
- `.codex/templates/long-horizon/Implement.md`
- `.codex/templates/long-horizon/Documentation.md`
