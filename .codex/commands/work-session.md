# Work Session Command (GitLab Edition)

여러 Ready 이슈를 SDD 절차로 연속 처리한다.

## Usage

```bash
/work-session [time] [type] [options]
```

장기 무인 반복 개선(24h급)이 목적이면 `/work-session` 대신 아래를 사용한다.

```bash
./scripts/long-horizon-loop.sh --hours 24
```

또는 dedicated 명령 문서:

```bash
/long-horizon
```

- `time`: `2h`, `30m` 형식. 기본값 무제한.
- `type`: `all`(기본), `frontend`, `backend`, `docs`, `api-spec`
- options:
  - `--parallel N` (기본 1, 최대 5)
  - `--auto`
  - `--dry-run`
  - `--resume`
  - `--retry`
  - `--no-cleanup`

## Core Policy

1. 파이프라인은 항상 `Issue -> Spec -> Implementation` 순서를 MUST 따른다.
2. 보호 브랜치 정책은 MUST 우회하지 않는다.
3. 모든 태스크는 MUST `1 task = 1 branch/worktree`로 격리한다.
4. 태스크 완료 루틴은 MUST `branch -> commit -> push -> MR -> merge` 순서를 따른다.
5. 병렬 실행은 격리 worktree가 없으면 MUST `parallel=1`로 폴백한다.
6. 종료 단계에서 `main` 직접 push 또는 `--no-verify` push를 MUST NOT 수행한다.

## GitLab State Model

레이블 기반 상태 전이를 표준으로 사용한다.

- `Ready -> In progress -> In review -> Done`
- 실패 시 `blocked` 또는 `failed` 레이블 추가

## Phase Outline

### Phase 0: Preflight

```bash
./scripts/work-session-preflight.sh \
  --strict "${WORK_SESSION_PREFLIGHT_STRICT:-true}" \
  --report "${WORK_SESSION_PREFLIGHT_REPORT:-.codex/.work-session-preflight.json}"
```

필수 레이블이 없으면 먼저 생성한다.

```bash
./scripts/work-session-bootstrap-labels.sh
```

### Phase 1: Ready 이슈 조회

```bash
glab issue list --all --label "Ready" -O json
```

- type 필터가 `all`이 아니면 라벨 필터를 결합한다.
- assignee lock 활성 시, 본인 할당 또는 미할당만 실행한다.

### Phase 2: 실행 계획

- Issue 본문의 `Depends on #N` 패턴으로 DAG를 구성한다.
- 우선순위: `api-spec` -> `priority:high` -> `priority:medium` -> `priority:low`

### Phase 3: 구현/검증/PR

각 이슈는 아래 루틴을 따른다.

1. 태스크 전용 브랜치 생성 (`feature/issue-{iid}-{slug}`)
2. spec 작성/리뷰
3. 구현
4. `./scripts/ai-verify --mode full`
5. 커밋/푸시/MR 생성 (`./scripts/ai-finish-task --issue {iid} --commit-msg \"...\"`)
6. 상태를 `In review`로 전환

### Phase 4: 머지 및 마감

- 보호 규칙이 충족될 때만 자동머지 예약
- 머지 확인 후 이슈 상태를 `Done`으로 전환

### Phase 5: 완료 알림

각 태스크(이슈) 완료 시 Moshi 알림을 SHOULD 전송한다.

```bash
./scripts/notify-moshi.sh \
  --message "작업 완료: 이슈 #{iid}, MR !{iid}"
```

- 토큰은 `MOSHI_WEBHOOK_TOKEN` 환경변수로 전달한다.
- 토큰/시크릿은 MUST NOT 코드나 문서에 하드코딩한다.
- `message`는 SHOULD 한국어 중심으로 작성한다.
- 전송 실패 시에도 종료하지 않고 재시도 후 큐잉해 다음 실행에서 재전송한다.

## Session State

세션 상태는 `.codex/.last-session.json`에 저장한다.

권장 필드:

```json
{
  "started_at": "2026-03-06T00:00:00Z",
  "time_limit": "2h",
  "type_filter": "frontend",
  "parallel_workers": 1,
  "execution_plan": [[101], [102]],
  "completed_task_ids": [101],
  "failed_task_ids": [102],
  "skipped_due_to_owner_lock_ids": [],
  "skipped_due_to_dependency_ids": [],
  "pending_review_items": [],
  "retry_count": 0,
  "updated_at": "2026-03-06T01:20:00Z"
}
```

## KPI

세션 배치 종료 시 KPI를 기록한다.

```bash
./scripts/work-session-kpi.sh \
  --state-file .codex/.last-session.json \
  --summary-file .work-session-summary.md \
  --json-report .codex/.work-session-kpi.json
```
