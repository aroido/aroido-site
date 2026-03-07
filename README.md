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

## 장기 연속 실행 루프

장기 루프는 세션별 durable memory 파일을 유지합니다.

- `Prompt.md`
- `Plan.md`
- `Implement.md`
- `Documentation.md`

예시:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/work-session-spec.md \
  --hours 24 \
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
