---
description: Spec-first delivery rule for aroido-site
globs: ["docs/specs/**/*", "index.html", "styles.css", "script.js"]
alwaysApply: true
---

# Spec-Driven Workflow

1. 구현 전에 스펙 문서가 MUST 존재해야 한다.
2. 스펙 문서는 Issue와 MUST 연결되어야 한다.
3. 구현 완료 선언 전 `./scripts/ai-verify --mode full` MUST 통과.
4. 모든 태스크는 MUST 브랜치/워크트리에서 수행하고, `commit -> push -> MR -> merge` 절차를 거친다.
5. `main`/보호 브랜치 직접 push는 MUST NOT 수행한다.
6. Acceptance Criteria 증빙(테스트 로그/스크린샷/측정값) MUST 첨부.
7. 작업 완료 시 `scripts/notify-moshi.sh`로 완료 알림 전송을 SHOULD 수행한다.
8. Moshi 알림 `message`는 SHOULD 한국어 중심(대부분 한국어)으로 작성한다.
9. 알림 전송 실패 시에도 종료하지 말고 재시도/큐잉 방식으로 다음 전송을 이어가야 한다.
10. 스펙 변경은 변경 이력(날짜 + 이유)을 SHOULD 남긴다.
11. 사용자 노출 텍스트 변경 시 `ko`/`en` i18n 동시 반영을 MUST 수행한다.
