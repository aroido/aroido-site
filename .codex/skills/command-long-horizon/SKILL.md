---
name: command-long-horizon
description: Execute dedicated `/long-horizon` flow for 24h-class autonomous sessions.
---

# command-long-horizon

`/long-horizon` 요청이 오면 `.codex/commands/long-horizon.md`를 우선 적용한다.

## Steps

1. `scripts/long-horizon-bootstrap.sh`로 세션 전용 branch/worktree + Draft MR 생성
2. 워크트리에서 `scripts/long-horizon-loop.sh` 실행
3. 마일스톤마다 `scripts/long-horizon-checkpoint.sh` 실행
4. STOP/RESUME 신호로 장기 세션 제어
