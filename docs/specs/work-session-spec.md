# Work Session Spec (Aroido / GitLab)

Updated: 2026-03-06

## Scope

- Aroido 웹 개발 태스크를 Work Session으로 연속 처리하는 실행 스펙
- GitLab 이슈/머지리퀘스트와 연동되는 최소 자동화 기준 정의

## Non-goals

- 완전 무인 머지 보장
- 프로젝트 보드 커스텀 필드 강제

## State Machine

- `Ready -> In progress -> In review -> Done`
- 예외 상태: `blocked`, `failed`

## Session Inputs

- `time_limit`: 세션 시간 제한 (`2h`, `30m`)
- `type_filter`: `all|frontend|backend|docs|api-spec`
- `parallel_workers`: 기본 1
- `resume/retry` 플래그

## Execution Requirements

1. 시작 전 `scripts/work-session-preflight.sh`를 MUST 실행한다.
2. 필수 레이블이 없으면 `scripts/work-session-bootstrap-labels.sh`를 SHOULD 실행한다.
3. 각 이슈는 `Issue -> Spec -> Implementation` 순서를 MUST 지킨다.
4. 각 태스크는 MUST 전용 브랜치/워크트리에서 처리한다.
5. 완료 경로는 MUST `branch -> commit -> push -> MR -> merge`를 따른다.
6. MR 단계 전 `./scripts/ai-verify --mode full`을 MUST 통과한다.
7. 세션 종료 시 `.codex/.last-session.json`과 KPI 보고서를 MUST 갱신한다.
8. 각 태스크 완료 시 `scripts/notify-moshi.sh`로 완료 알림을 SHOULD 전송한다.
9. Moshi 알림 `message`는 SHOULD 한국어 중심(대부분 한국어)으로 작성한다.
10. 알림 실패 시 작업 종료를 막지 않고 MUST 재시도 후 큐 저장으로 전송 연속성을 보장한다.

## Session Artifacts

- 상태 파일: `.codex/.last-session.json`
- 요약 파일: `.work-session-summary.md`
- KPI JSON: `.codex/.work-session-kpi.json`
- 사전 진단: `.codex/.work-session-preflight.json`

## Acceptance Criteria

- dry-run 모드에서 실행 계획을 출력할 수 있다.
- resume/retry 모드 입력 스키마가 명확히 정의된다.
- 종료 후 KPI 5개 이상(처리량, 실패수, 재시도율 포함)이 기록된다.
- 브랜치/커밋/푸시/MR/머지 단계가 문서에 명시되어 있다.
- Moshi 알림 절차와 시크릿 전달 방식(환경변수)이 문서에 명시되어 있다.
- Moshi 알림 메시지 한국어 정책이 문서/스크립트에 반영되어 있다.
- Moshi 알림 실패 시 재시도/큐잉 정책이 문서/스크립트에 반영되어 있다.
