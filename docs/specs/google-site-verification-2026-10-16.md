# Google Search Console HTML 소유권 인증

- 연결 작업: https://github.com/aroido/aroido-site/issues/57
- 날짜: 2026-10-16
- 승인: 사용자가 bigcat@aroido.com 계정에 https://aroido.com/ URL-prefix 속성을 생성하고 HTML 파일을 배포하여 소유권을 확인하도록 명시 승인했다.

Google이 기존 Analytics 설정으로 자동 인증한 상태에서 HTML 파일 확인 수단을 추가한다. Search Console의 해당 계정/속성 UI에서 다운로드한 google742249c6007d86e4.html 원문을 사이트 루트에 배치한다. DNS, 다른 소유자, 사이트 콘텐츠는 변경하지 않는다.

수용 기준: 다운로드와 파일 바이트 일치, full verify 통과, PR 배포 후 공개 URL이 HTTP 200과 동일 본문을 반환, Search Console HTML 확인 성공. 소유권 확인과 사이트맵 접수 및 실제 색인 상태를 각각 보고한다.
