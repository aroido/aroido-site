# AGENTS.md

## Repo Defaults

- `aroido-site`의 repo-local Codex 규칙은 `.codex/README.md`와 관련 `.codex/rules/*.md`를 기준으로 따른다.
- 이 레포의 canonical VCS는 GitHub `aroido/aroido-site`이며, 기본 완료 경로는 `branch -> GitHub PR -> GitHub main merge`다.
- GitLab `aroido/aroido-site`는 mirror/내부 워크플로우용 보조 원격으로 취급한다.
- 완료 게이트는 `./scripts/ai-verify --mode full`이며, Codex에서는 `./scripts/run-ai-verify --mode full`를 우선 사용해 검증 결과가 알림에 반영되게 한다.
- 레포 로컬 알림 의미 규칙은 `./scripts/codex-notify-context`가 담당한다.
- 공개 사이트 런타임은 `en`, `ko`, `ja`, `zh-Hans`를 지원한다. 영어는 canonical/default 비프리픽스 URL이며, 공개 localized URL은 `/ko/`, `/ja/`, `/zh-hans/` prefix를 사용한다.
- Moshi 전송 자체는 전역 `codex-task-notify`/`codex-moshi-notify`가 담당하므로, 레포 문서나 프롬프트에 webhook token이나 raw curl payload를 남기지 않는다.
