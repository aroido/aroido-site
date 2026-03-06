# Spec Create Command

새 기능의 스펙 문서를 생성한다.

## Rules

1. 스펙은 구현 전에 MUST 작성되어야 한다.
2. 스펙은 MUST 아래 섹션을 포함한다.
   - Scope
   - Non-goals
   - Requirements (`MUST`, `SHOULD`, `MAY`)
   - Acceptance Criteria
   - Evidence
3. 스펙은 Issue 번호를 MUST 연결한다.

## Output

기본 출력 경로:

- `docs/specs/{feature-name}.md`

권장 헤더:

```md
# Feature Spec: {feature-name}

Updated: YYYY-MM-DD
Issue: #{iid}
```
