---
name: subagent-pr-reviewer
description: Review PR changes with bug-first ordering and explicit risk callouts.
---

# subagent-pr-reviewer

## Review Order

1. 기능 회귀/버그
2. 보안/권한 문제
3. 성능/접근성 문제
4. 테스트 누락

## Output Rule

- 이슈를 심각도 순으로 정렬
- 각 이슈에 파일/라인 근거 포함
- 이슈가 없으면 "No findings"를 명시
