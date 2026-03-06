# i18n Audit Command

영어(`en`)와 한국어(`ko`) 번역 품질을 점검한다.

## Goals

- 키 누락/불일치 탐지
- fallback 정책 점검
- 언어 전환 UX 검증

## Checklist

1. `en`/`ko` 키셋 동일성 확인
2. 누락 키 발생 시 기본 언어 fallback 적용 확인
3. `html[lang]` 값이 현재 언어와 일치하는지 확인
4. 언어 전환 후 문서 제목/핵심 CTA 갱신 확인
5. i18n 변경 후 `./scripts/ai-verify --mode full` 실행
