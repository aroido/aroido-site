---
name: command-work-session
description: Execute `/work-session` style flow for GitLab-based Spec-Driven delivery.
---

# command-work-session

`/work-session` 요청이 오면 `.codex/commands/work-session.md`를 우선 적용한다.

## Steps

1. `scripts/work-session-preflight.sh` 실행
2. 필요한 레이블이 없으면 `scripts/work-session-bootstrap-labels.sh` 실행
3. Ready 이슈 조회 + 실행 계획 생성
4. Issue -> Spec -> Implementation 순서로 처리
5. 각 태스크를 전용 브랜치에서 처리하고 `commit -> push -> MR -> merge` 적용
6. `./scripts/ai-verify --mode full` 통과 후 MR 단계 진행
7. `.codex/.last-session.json`과 KPI 요약 갱신
8. 각 태스크 완료 시 `scripts/notify-moshi.sh` 실행
