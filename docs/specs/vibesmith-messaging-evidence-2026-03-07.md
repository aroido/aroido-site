# VibeSmith Messaging Evidence Pack (Official + Reddit)

Updated: 2026-03-07

## 1) Official Docs Signals

1. Cursor Rules docs  
https://docs.cursor.com/en/context  
- LLM은 completion 사이 메모리를 유지하지 않으며, rule 기반 컨텍스트 주입이 필요하다는 점을 명시.

2. Claude Code Settings  
https://docs.anthropic.com/en/docs/claude-code/settings  
- 다중 설정 파일/권한 정책/승인 제어가 존재해 운영 일관성 관리가 중요함.

3. Claude Code Memory  
https://docs.anthropic.com/en/docs/claude-code/memory  
- CLAUDE.md 기반 메모리 계층 관리가 가능하지만, 프로젝트가 많아질수록 유지 관리 체계가 필요.

4. Claude Code MCP  
https://docs.anthropic.com/en/docs/claude-code/mcp  
- MCP 서버 연동이 강력하나 프로젝트 스코프/승인 경계 등 운영 복잡도가 함께 증가.

5. Claude Code Best Practices  
https://www.anthropic.com/engineering/claude-code-best-practices  
- 파일 쓰기/명령 실행/MCP 도구 호출에 대한 승인과 설정 공유 필요성을 강조.

## 2) Reddit Field Signals

1. Claude Code permissions discussion  
https://www.reddit.com/r/ClaudeAI/comments/1rhtfpz/claude_code_permissions_discussion/  
- 반복 승인 피로, allowlist 관리 난이도, 안전성 불안에 대한 실사용자 논의.

2. How to stop Claude Code from asking for permission every time?  
https://www.reddit.com/r/ClaudeAI/comments/1l45dcr/how_to_stop_claude_code_from_asking_for/  
- 자동화 편의와 보안 통제 사이의 긴장(운영 정책 필요성) 확인.

3. Anyone else tired of re-explaining codebase context to AI tools?  
https://www.reddit.com/r/cursor/comments/1pmenwl/anyone_else_tired_of_reexplaining_codebase/  
- 매번 컨텍스트 재설명 문제, 규칙 적용 체감 불안정성에 대한 현장 피드백.

4. Anyone else need project-specific .cursor/rules but want them synced?  
https://www.reddit.com/r/cursor/comments/1ozjyoq/  
- 프로젝트별 규칙은 필요하지만 동기화/재사용 체계가 부족하다는 니즈.

5. One shared rules + memory bank for every AI coding IDE  
https://www.reddit.com/r/cursor/comments/1koj6vx/  
- IDE별 규칙 파일을 통합 관리하려는 시도가 이미 나타남.

## 3) Messaging Implications

- 핵심 문제 정의:
  - `컨텍스트 분산`
  - `설정 드리프트`
  - `승인/보안 운영 피로`
  - `멀티 레포 재사용 어려움`

- 제품 가치 문장 프레임:
  - `분산된 AI 코딩 컴포넌트를 한 운영 레이어로 통합`
  - `종속성 가시화로 늦게 터지는 충돌을 앞당겨 발견`
  - `팀 온보딩과 핸드오프를 반복 가능한 형태로 표준화`

## 4) Copy Bank (KR)

1. `AI 코딩 속도는 빨라졌지만, 운영은 더 복잡해졌습니다.`
2. `VibeSmith는 Cursor와 Claude Code 구성요소를 하나의 운영 맵으로 연결합니다.`
3. `규칙·명령·훅이 흩어질수록 품질보다 우연에 의존하게 됩니다.`
4. `보이지 않던 결합을 종속성 그래프로 먼저 드러냅니다.`
5. `새 팀원이 폴더를 뒤지는 대신, 운영 지도를 먼저 이해하게 만듭니다.`
6. `반복되는 컨텍스트 재설명 비용을 줄이고 실제 구현 시간에 집중하게 합니다.`
7. `강한 자동화와 안전한 승인 경계를 동시에 설계합니다.`
8. `로컬 우선으로 시작해 팀 규모 운영까지 자연스럽게 확장합니다.`
9. `설정 복제에서 운영 시스템으로, AI 개발 체계를 업그레이드합니다.`
10. `VibeSmith는 AI 코딩의 결과만이 아니라 운영 신뢰도까지 관리합니다.`

## 5) Content Guardrails

- MUST:
  - 사용자 결과 중심 문장으로 시작한다.
  - 추상 슬로건보다 실제 운영 문제를 먼저 제시한다.
  - 상태/범위/다음 단계(파일럿, 도입 문의)를 명확히 분리한다.

- MUST NOT:
  - 근거 없는 수치 사용
  - 내부 개발 프로세스 용어를 메인 카피로 남발
  - 제품 상태를 과장하는 표현
