# Long Horizon Command

24시간급 연속 작업을 기존 `/work-session`과 분리해서 운영한다.

## Usage

```bash
/long-horizon [hours]
```

- `hours`: 기본 `24`

## Flow

### 1) Bootstrap (격리 환경 + Draft MR)

```bash
./scripts/long-horizon-bootstrap.sh --target main
```

- 세션당 `1 branch + 1 worktree` 원칙 적용
- Draft MR을 먼저 열고 장기 진행 로그를 같은 MR에 축적

### 2) Run Loop

워크트리에서 실행:

```bash
./scripts/long-horizon-loop.sh \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20
```

- durable memory 파일:
  - `Prompt.md`
  - `Plan.md`
  - `Implement.md`
  - `Documentation.md`

### 3) Milestone Checkpoint

```bash
./scripts/long-horizon-checkpoint.sh --session-id <session-id>
```

- `./scripts/ai-verify --mode full` 통과 후 커밋/푸시
- MR이 없으면 Draft MR 생성
- MR 노트로 체크포인트 기록

### 4) Stop / Resume

중지:

```bash
touch .codex/STOP_LONG_HORIZON_LOOP
```

재개:

```bash
./scripts/long-horizon-loop.sh --resume <session-id>
```

### 5) KPI Accumulation

루프 종료 시 KPI가 자동 누적된다.

- JSONL: `.codex/.long-horizon-kpi.jsonl`
- CSV: `.codex/.long-horizon-kpi.csv`

수동 집계:

```bash
./scripts/long-horizon-kpi.sh \
  --session-dir .codex/long-horizon/<session-id> \
  --append
```

Refactor best-practice profile:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/long-horizon-refactor-best-practices-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20
```

## Policy

1. `main` 직접 push 금지
2. 체크포인트마다 verify 통과 필수
3. 런타임 로그/상태 파일은 git에 포함하지 않는다
