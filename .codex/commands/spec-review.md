# Spec Review Command

스펙 문서를 품질 기준으로 검토한다.

## Checklist

1. 완전성: 필수 섹션 누락이 없는가
2. 명확성: 모호한 표현이 없는가
3. 검증 가능성: Acceptance Criteria가 측정 가능한가
4. 일관성: 기존 아키텍처/규칙과 충돌 없는가
5. 근거성: Evidence 링크가 1개 이상 존재하는가

## Review Output

- `docs/specs/reviews/{spec-name}-review-{YYYY-MM-DD}.md`

리뷰 우선순위:

- `critical`: 릴리즈 차단
- `major`: 머지 전 수정
- `minor`: 후속 이슈 가능
