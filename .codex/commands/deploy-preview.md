# Deploy Preview Command

배포 전 체크와 Preview 배포 단계를 표준화한다.

## Flow

1. `./scripts/ai-verify --mode full`
2. 브랜치 푸시 후 Preview 배포
3. Preview URL로 기본 동작 점검
4. i18n 전환/핵심 CTA/콘솔 에러 확인
5. 결과를 MR 코멘트에 기록
