# aroido-web

Aroido 웹페이지 프로젝트입니다.

## 시작

정적 웹 기본 구조입니다.

- `index.html`
- `styles.css`
- `script.js`

## 실행

브라우저에서 `index.html`을 열어 확인할 수 있습니다.

## 자동화 모드 분리

- 세밀 제어(이슈 단위): `/work-session` 명령과 기존 SDD 플로우 사용
- 장기 연속 실행(24h급): `scripts/long-horizon-loop.sh` 사용

## 워크세션 자동 루프

진단 스펙 기반 자동 개선 루프를 실행할 수 있습니다.

```bash
./scripts/work-session-loop.sh \
  --spec docs/specs/site-redesign-content-gap-spec-v2.md \
  --cycles 3 \
  --notify-token '<MOSHI_TOKEN>'
```

- 루프 단계: `research -> improve -> self-feedback -> fix -> verify`
- 로그 경로: `.codex/work-session-loop/<session-id>/`
- 무한 루프: `--forever`
- 중지 신호:

```bash
touch .codex/STOP_WORK_SESSION_LOOP
```

## 장기 연속 실행 루프

장기 루프는 세션별 durable memory 파일을 유지합니다.

- `Prompt.md`
- `Plan.md`
- `Implement.md`
- `Documentation.md`

권장 Git 운영(세션당 1회):

```bash
./scripts/long-horizon-bootstrap.sh --target main
```

- 전용 worktree/branch 생성
- Draft MR 생성
- 이후 생성된 worktree에서 루프 실행

예시:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/work-session-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20 \
  --notify-token '<MOSHI_TOKEN>'
```

무기한 실행:

```bash
./scripts/long-horizon-loop.sh --forever
```

중지 신호:

```bash
touch .codex/STOP_LONG_HORIZON_LOOP
```

마일스톤 체크포인트(verify + commit + push + MR note):

```bash
./scripts/long-horizon-checkpoint.sh --session-id <session-id>
```

KPI 누적 출력:

- `.codex/.long-horizon-kpi.jsonl`
- `.codex/.long-horizon-kpi.csv`

수동 집계:

```bash
./scripts/long-horizon-kpi.sh \
  --session-dir .codex/long-horizon/<session-id> \
  --append
```
