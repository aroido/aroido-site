# 최신 앱 UI 대조 및 갱신

Issue: https://github.com/aroido/aroido-site/issues/63

사용자 요청: Sentinel_5a6c570a574c81918e922cd59433d423 — “그리고 지금 우리 앱 최신버전유아이랑 맞추는 작업이 필요해”. 초기 범위는 로컬 준비·검증·독립 리뷰였다. 이후 사용자 “ㅇㅇ”(Sentinel_d80f0791b3848191800dcad5fb3ef10f)로 사이트 PR/main 배포 승인. 앱·서버 변경은 범위 밖.

## 기준
- site: main 2dd27afb017639789c5208fada56aa621533de84 (PR62 포함)
- app main: fe89c0ae3de3be1130b0df1a5a545b9a9e5a8814
- app develop: 420685055081df6b0111504ca8485d8b11dbb420
- 별도 복제본에서 main 소스 그대로 Debug 시뮬레이터 빌드를 캡처한다. 개발 빌드임을 명시하며 실기기/출시/아일랜드 서버 성공을 주장하지 않는다.

## 확인 필요한 차이
홈/목록의 표시용 표식은 장소명 앞이며 유지한다. 전달된 지침이 작성 화면의 선택 버튼을 의미한다면, 확인 시점 main/develop의 MemoEditor는 하단 도구 줄이다. 기준이 되는 다른 커밋을 확인하기 전 앱 소스를 임의 수정하지 않는다. 해당 화면은 검토 후보이며 최신 디자인 확정본이라고 표기하지 않는다.

## 구현 및 수용 기준
- 개인 데이터가 없는 신규 시뮬레이터 + 저장소 내 synthetic fixture만 사용.
- 홈·지도·메모 작성/편집·표식·온보딩 실제 앱 화면과 기존 10/14 사이트 자산 대조.
- 실제 캡처만 사용, UI 합성/목업 대체 금지. 알림/지도 제공자 차이는 명시.
- 기존 모바일 세로 카드, 애니메이션, SEO metadata, sitemap, verification 파일 유지.
- 네 언어 alt/caption/disclosure와 자산 출처 동기화.
- 생성물 확인, full gate, 모바일·데스크톱 QA, 독립 리뷰.

## 로컬 변경
- 기존 홈/지도/장소 설정 3장 교체, 메모/표식 선택/온보딩 3장 추가. 원본 캡처 9장과 해시 manifest 보존.
- 본문 없는 기본 알림과 별도 동의한 본문 표시 예시를 네 언어에서 구분. 기존 OS 알림 캡처는 동의 예시로 유지하고 출처 날짜 분리.
- 첫 실행 영상은 최신 main에서도 동일 원본과 5.9초 정지 사용으로 유지.
- 실제 Naver 지도 설정은 기존 공식 캡처 시뮬레이터 번들의 공개 SDK 설정만 재사용(값 미출력). 앱 소스는 수정하지 않음.

## 검증 결과
- 실제 main Debug simulator build: 2회 성공(기본 설정, 기존 공개 Naver SDK 설정 적용). 앱 소스 diff 없음. develop은 소스만 대조했으며 빌드/실기기 검증하지 않음.
- full gate: 10 passed / 0 failed.
- Chromium/WebKit × 375/390/430/1280px × 4언어 × 2모션 설정: 64 passed. 대각선 터치·sticky 단계·6카드 배치 검증.
- 390/1280 갤러리 전체 캡처 및 6장 이미지 decode/natural size 660×1434 확인.
- 독립 리뷰: No findings, 실제 원본6장 직접 확인 및 원본/출력12개 SHA-256 일치.
- 4언어 title/description/canonical/hreflang/OG 동일. CSS/JS/sitemap/Google·Naver 확인 파일 diff 없음.
- raw 캡처·해시·기준 JSON·웹 QA는 상위 workspace evidence/current-app-ui/에 보관.
- 초기 로컬 단계에서는 커밋/push/PR/merge/배포하지 않았음. 이후 아래 승인·대조 결과에 따라 사이트 배포 진행.

## 최신 main 재대조 및 배포 승인
- 앱 main `2e09ac75c11f3bb7ba09b91096fcf0bb64235467` (PR287)에 PR285 Island 디자인 포함 확인.
- 기존 6개 캡처의 UI 배치/문구/자산은 그대로다. Editor는 analytics, PlaceDetail은 기존 Activity 정리 코드, RootView는 Island 링크 별도 진입 경로 변경. 신규 온보딩 분석 동의는 reminders 단계이며 촬영한 welcome에 영향 없음. 사용자 요청대로 재촬영하지 않고 실제 촬영 기준 fe89c0a 유지.
- 독립 화면 영향 검토: 재촬영 불필요에 동의, 화면상 발견 문제 없음.
- PR287 미해결 리뷰 9개 확인(인증/쿼터, 여러 장소 표시, 동의 철회·삭제·저장 실패 정리, 분석 테스트/세대, 등록 해제 경합, 서명 실패 대체 경로). 본 작업에서 해결·성공 검증으로 취급하지 않음.
- 실제 위치 도착 및 TestFlight 미확인. Island 홍보 추가 없음. 최신 앱 커밋을 빌드/촬영했다고 주장하지 않음.
