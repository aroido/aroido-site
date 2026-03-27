# aroido-web

Aroido 웹페이지 프로젝트입니다.

## 시작

정적 웹 기본 구조입니다.

- `index.html`
- `styles.css`
- `script.js`

## 실행

브라우저에서 `index.html`을 열어 확인할 수 있습니다.

## 블로그 운영

정적 블로그는 같은 레포 안의 Markdown 파일을 소스로 사용합니다.

- 원본 글: `content/blog/*.md`
- 생성 결과: `blog/`, `rss.xml`, `sitemap.xml`
- 생성 명령:

```bash
node scripts/build-blog.mjs
```

- 검증:

```bash
./scripts/run-ai-verify --mode full
```

Markdown frontmatter 예시:

```md
---
title: "Why We Kept the Blog in Git"
date: "2026-03-11T09:00:00+09:00"
excerpt: "Why a same-repo Markdown blog fits the current Aroido site better than adding a database or CMS too early."
slug: "why-we-kept-the-blog-in-git"
tags:
  - product
  - operations
draft: false
---
```

`blog/` 아래 HTML 파일은 생성 산출물이므로 직접 수정하지 않고, 원본 Markdown을 고친 뒤 다시 생성합니다.

## VibeSmith DMG 배포 링크 규칙

사이트의 다운로드 버튼은 GitHub `aroido/vibesmith`의 최신 공개 릴리즈를 기준으로 동작합니다. 현재는 prerelease도 포함해서 가장 최근 릴리즈를 선택하며, GitLab은 mirror 전용입니다.

## Vercel 배포 기준

`aroido-site`의 Vercel 프로덕션 배포 source of truth는 GitHub `aroido/aroido-site`의 `main` 브랜치입니다.

- GitHub `main` 머지 -> Vercel 프로덕션 배포 기준
- GitLab remote는 필요하면 mirror 또는 내부 워크플로우용으로 유지
- 라이브 배포 이슈를 볼 때는 Vercel 프로젝트의 최신 배포가 GitHub `main` 커밋을 가리키는지 확인

- 릴리즈 목록 페이지:
  - `https://github.com/aroido/vibesmith/releases`
- 사이트 스크립트는 GitHub Releases API(`https://api.github.com/repos/aroido/vibesmith/releases?per_page=10`)로
  최신 non-draft 릴리즈를 조회해 `.dmg` 자산 링크를 자동으로 채웁니다.

Homebrew 가이드:

```bash
brew update
brew tap aroido/vibesmith https://github.com/aroido/homebrew-vibesmith.git
brew install --cask aroido/vibesmith/vibesmith
```

레거시 GitLab tap을 쓰던 환경은 먼저 아래처럼 retap 한다.

```bash
brew untap aroido/vibesmith
brew tap aroido/vibesmith https://github.com/aroido/homebrew-vibesmith.git
brew upgrade --cask --greedy aroido/vibesmith/vibesmith
```

## 자동화 모드 분리

- 세밀 제어(이슈 단위): `/work-session` 명령과 기존 SDD 플로우 사용
- 장기 연속 실행(24h급): `scripts/long-horizon-loop.sh` 사용

## 워크세션 자동 루프

진단 스펙 기반 자동 개선 루프를 실행할 수 있습니다.

```bash
./scripts/work-session-loop.sh \
  --spec docs/specs/site-redesign-content-gap-spec-v2.md \
  --cycles 3 \
  --notify-token '<MOSHI_TOKEN>'
```

- 루프 단계: `research -> improve -> self-feedback -> fix -> verify`
- 로그 경로: `.codex/work-session-loop/<session-id>/`
- 무한 루프: `--forever`
- 중지 신호:

```bash
touch .codex/STOP_WORK_SESSION_LOOP
```

## 장기 연속 실행 루프

장기 루프는 세션별 durable memory 파일을 유지합니다.

- `Prompt.md`
- `Plan.md`
- `Implement.md`
- `Documentation.md`

권장 Git 운영(세션당 1회):

```bash
./scripts/long-horizon-bootstrap.sh --target main
```

- 전용 worktree/branch 생성
- Draft MR 생성
- 이후 생성된 worktree에서 루프 실행

예시:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/work-session-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20 \
  --max-no-progress-cycles 6 \
  --auto-finish \
  --finish-target main \
  --finish-auto-merge \
  --notify-token '<MOSHI_TOKEN>'
```

무기한 실행:

```bash
./scripts/long-horizon-loop.sh --forever
```

중지 신호:

```bash
touch .codex/STOP_LONG_HORIZON_LOOP
```

마일스톤 체크포인트(verify + commit + push + MR note):

```bash
./scripts/long-horizon-checkpoint.sh --session-id <session-id>
```

무진척 연속 중단 규칙:

- `--max-no-progress-cycles <n>`: `progress=false`가 N회 연속이면 루프 자동 종료
- `--auto-finish`: 종료 시 `scripts/ai-finish-task` 자동 실행 (`verify -> commit/push -> MR -> auto-merge`)

KPI 누적 출력:

- `.codex/.long-horizon-kpi.jsonl`
- `.codex/.long-horizon-kpi.csv`

수동 집계:

```bash
./scripts/long-horizon-kpi.sh \
  --session-dir .codex/long-horizon/<session-id> \
  --append
```

리팩토링 전용 장기 실행 프로필:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/long-horizon-refactor-best-practices-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20 \
  --max-no-progress-cycles 6 \
  --auto-finish \
  --finish-target main \
  --finish-auto-merge
```
