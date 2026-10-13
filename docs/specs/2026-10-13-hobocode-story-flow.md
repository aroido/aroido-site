# 호보코드 소개 순서와 연결선 개선

- Issue: https://github.com/aroido/aroido-site/issues/40
- Base: 699397272f003ba2e4b9df84fb221f688056e17b
- 날짜: 2026-10-13

## 사용자 요구
공감 도입 → 짧은 지구본 줌인 → 실제 앱 지도와 메모 → 재방문 알림 → 다른 장소를 보여주는 줌아웃 → 출시 상태. 반복 화면을 없애고 기존 브랜드/실제 화면을 유지한다. 별도 브랜치/PR 검증 후 승인된 배포를 수행한다.

## 구현 범위
- Hero 중복 지도와 기존 4단계 스크롤 속 작은 앱 화면을 제거한다. 지도·메모는 각각 한 번 큰 정적 이미지로 제공한다.
- 오프닝/엔딩 지구본을 각 컨테이너에 한정한다. 스크롤 카메라와 연결선은 실제 canvas 좌표에서 SVG 좌표로 변환하고 카드 모서리까지 연결한다.
- 뒷면/화면 밖/다른 카드에 가려진 표식은 연결선을 노출하지 않는다. 리사이즈와 복귀 때 갱신한다.
- 한국어는 원문 두 자료의 의미·조건 보존, 구체적인 동작, 중복 축소 기준으로 교정한다. 외부 코드 설치/실행은 하지 않는다.
- 최신 map/detail, 공식 심볼/폰트 및 이전 개발 빌드로 명시된 Island 화면을 유지한다.
- 4개 언어와 privacy/support, 다운로드 링크 없는 출시 준비 표시를 보존한다.

## 확인 기준
- DOM 순서 및 지도/메모 이미지 각 1회.
- Chromium desktop, WebKit 320/390/768에서 overflow/교차/연결선 정합성, 스크롤/리사이즈 검사.
- reduced-motion/no-JS/no-WebGL에서 실제 앱 설명과 기본화면 표시.
- axe 및 전체 저장소 검증 통과. 한국어·시각 독립 리뷰.
- Preview와 production 마지막 커밋 확인, 전후 스크린샷과 비교 영상 Library 증빙.

## 교정 참고 (읽기 전용)
- https://github.com/nathankim0/humanize-korean/blob/main/humanize-korean/SKILL.md
- https://github.com/dotoricode/korean-humanizer/blob/main/SKILL.md
- https://github.com/dotoricode/korean-humanizer/blob/main/references/ko-ai-signals.md

## 검증 결과
- 실제 기존 Canvas/visual/SVG 좌표계 차이는 재현되지 않았다. 주원인은 카드·표식 배치와 가림, 카드 중심에서 시작한 선이었다. 실제 Canvas→SVG CTM 변환은 좌표계가 달라져도 견디도록 보강했다.
- 1440→390→320→844→1440 리사이즈, 두 장면의 실제 스크롤 p=0/.5/1/0 총 40경우: 교차 0, 선 끝 오차 최대 1.27e-13px, JS 오류 0. WebGL context loss 이후 해당 장면만 fallback 유지.
- geometry 단위 테스트 3/3. 4언어×4폭 16경우: h1 하나, 지도/메모 각각 하나, 가로 넘침 없음.
- Chromium desktop, WebKit 320/390/768 및 reduced-motion/no-JS/forced-no-WebGL: 화면 표시 정상, axe 위반 0(스크립트 없는 경우 axe 제외).
- 한국어와 실제 픽셀을 별도 리뷰: 차단 사항 없음. 최종 줌아웃 완료 캡처 추가.
- ./scripts/ai-verify --mode full: 9/9 통과. 실물 iPhone Safari/VoiceOver/현장 성능지표는 미측정.

## 실제 문구 변경
- “어디에 남겼는지 지도에서 찾아봐요.” → “메모한 장소를 지도에서 찾아보세요.”: 장소와 동작을 직접 표현.
- “다음에 기억할 내용을 적어두세요.” → “그때 적어둔 내용을 확인하세요.”: 지도 다음의 실제 상세 화면 역할을 설명. 저장 안내는 Hero에 보존.
- Dynamic Island 문장을 “메모 내용을 보려면 직접 표시를 시작하고 내용 표시를 허용해야 해요.”로 수정: 조건 두 개 모두 보존.
- 승인된 첫 문장, 장소 알림 활성화·위치/알림 권한·출시 준비·화면 변경 가능성 유지. 새 경험/성과를 추가하지 않음.
