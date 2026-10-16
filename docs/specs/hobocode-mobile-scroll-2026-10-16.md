# Hobocode 모바일 화면 카드 스크롤 수정

- Issue: https://github.com/aroido/aroido-site/issues/61
- 승인: 사용자 배포 요청(2026-10-16).

## 문제와 근거
사용자 iPhone 스크린샷의 “앱에서는 이렇게 보여요” 구간에서 카드가 가로로 밀리고 스냅된다. Chromium/WebKit 모바일 390px 재현에서 document 폭은 390px로 정상이나 screen-list는 clientWidth 390px / scrollWidth 839px, overflow-x:auto, scroll-snap-type:x mandatory다. 따라서 해당 목록의 중첩 가로 스크롤을 제거한다.

## 구현
760px 이하에서 화면 카드를 세로 한 열로 배치한다. 카드 이미지, 문구, 모서리, 최대 폭, 등장 애니메이션은 유지한다. 데스크톱 3열, 메모 벽 움직임, 도착 구간 sticky 동작은 유지한다. 생성 원본 CSS와 배포 CSS를 동기화한다. 모든 언어에 공유 스타일을 적용한다. SEO 및 소유권 확인 파일은 변경하지 않는다.

## 수용 기준과 검증
- Chromium/WebKit 375/390/430px에서 페이지 가로 넘침이 없고 화면 목록의 가로 스크롤/스냅이 없다.
- 세 카드가 세로 순서대로 보이고 데스크톱 1280px에서는 3열이다.
- 네 언어, reduced-motion 설정, 전체 세로 스크롤과 sticky 단계 동작을 검증한다.
- 자동 모바일 터치와 스크린샷은 에뮬레이션 증거이며 실제 iPhone Safari 테스트로 표기하지 않는다.
- full 검증, 독립 리뷰 후 PR/main 자동 배포 및 production 확인.

## 변경 이력
- 2026-10-16: 사용자 스크린샷과 브라우저 폭 측정으로 범위를 화면 카드 목록으로 확정.

## 검증 결과
- `./scripts/run-ai-verify --mode full`: 10 passed, 0 failed.
- `scripts/verify-hobocode-scroll.cjs`: Chromium/WebKit × 375/390/430/1280 × 4 locales × 2 motion settings = 64 cases passed. Chromium 대각선 터치가 페이지 세로 이동하며 목록 scrollLeft=0. Sticky 단계 0/1/2 정상.
- 모바일 카드 전체 폭 및 데스크톱 3열 스크린샷 육안 확인.
- 독립 subagent-pr-reviewer: No findings.
- SEO/사이트맵/소유권 파일 diff 없음.
