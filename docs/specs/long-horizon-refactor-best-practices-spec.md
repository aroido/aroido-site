# Long-Horizon Refactor Best Practices Spec

Updated: 2026-03-07

## Goal

Aroido 정적 웹 코드베이스를 장기 루프에서 안전하게 리팩토링하기 위한 기준을 정의한다.

## Scope

- `index.html`
- `styles.css`
- `script.js`
- 하위 라우트(`projects/*`, `team/*`)에서 공통으로 사용하는 패턴

## Refactor Principles

1. 기능 변경 없이 구조를 단순화한다.
2. 전역 상태/전역 부수효과를 최소화한다.
3. 반복 DOM 조회를 캐싱하고, 초기화 순서를 명확히 한다.
4. 에러/예외(스토리지, fetch, 브라우저 기능 부재)에서 강건하게 동작한다.
5. i18n 키 누락 시 fallback을 유지한다.
6. 모션/스크롤 동작은 접근성(`prefers-reduced-motion`)을 존중한다.

## Execution Plan

1. Baseline 측정: `./scripts/ai-verify --mode full`
2. 핫스팟 식별:
   - 중복 로직
   - 큰 함수/높은 결합도
   - 널 체크 누락
   - 복구 불가능한 예외
3. 작은 단위 리팩토링 반복:
   - utility 분리
   - 상태 객체 정리
   - 핸들러 책임 분리
4. 매 마일스톤 체크포인트:
   - `./scripts/long-horizon-checkpoint.sh --session-id <session-id>`
5. 루프 종료 시 KPI 기록:
   - `.codex/.long-horizon-kpi.jsonl`
   - `.codex/.long-horizon-kpi.csv`

## Acceptance Criteria

- `./scripts/ai-verify --mode full` 통과
- `script.js`에서 기능별 초기화 진입점이 하나로 정리됨
- i18n/스크롤/모션 로직이 독립 함수로 분리됨
- fallback translation 로직 유지
- 브라우저 제약(localStorage/fetch 실패) 시 동작 보장

## Long-Horizon Run Command

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/long-horizon-refactor-best-practices-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20
```
