# AGENTS.md

## Repo Defaults

- `aroido-site`의 repo-local Codex 규칙은 `.codex/README.md`와 관련 `.codex/rules/*.md`를 기준으로 따른다.
- 완료 게이트는 `./scripts/ai-verify --mode full`이며, Codex에서는 `./scripts/run-ai-verify --mode full`를 우선 사용해 검증 결과가 알림에 반영되게 한다.
- 레포 로컬 알림 의미 규칙은 `./scripts/codex-notify-context`가 담당한다.
- Moshi 전송 자체는 전역 `codex-task-notify`/`codex-moshi-notify`가 담당하므로, 레포 문서나 프롬프트에 webhook token이나 raw curl payload를 남기지 않는다.
