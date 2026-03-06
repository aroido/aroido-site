# Aroido Web Research Summary (Spec-Driven, Codex-Only)

Updated: 2026-03-07

## 1) Current Goal

- Primary objective: promote `Vibesmith` now.
- Brand objective: keep `aroido.com` as the long-term team/project hub.
- Development mode: `Codex only` workflow.

## 2) Information Architecture (Current Agreement)

- Core pages now:
  - `/` (home)
  - `/team`
  - `/projects`
  - `/projects/vibesmith`
- Positioning:
  - `Aroido` = team/studio hub
  - `Vibesmith` = flagship project (current focus)
- Expansion rule:
  - New projects follow `/projects/[slug]` first.
  - If a project becomes large enough, split to a dedicated domain/subdomain (ex: `vibesmith.aroido.com`).

## 3) Deployment/Operations Direction

- Preferred stack for simplicity + free start:
  - `Next.js` + `Vercel`
- Domain:
  - Use existing `aroido.com`.
- Practical note:
  - Hosting can start on free tier.
  - Custom domain renewal cost is separate.

## 4) Codebase Strategy (Decision)

- Short-term decision: build in `aroido-site` first (single repo).
- Guardrail for future split:
  - Keep hub and project code boundaries clear from day 1.
  - Example boundaries:
    - `components/hub/*`
    - `components/vibesmith/*`
- Suggested split trigger (2 or more true):
  - deployment cadence conflict
  - env/permission separation needed
  - team ownership separation needed

## 5) Spec-Driven Development Components Needed

For current team context, these are the core components:

1. `AGENTS.md`
- global operating contract for objectives, limits, branching, verify gates.

2. `Rules`
- explicit allow/prompt/forbidden policy for safe execution.

3. `Skills`
- reusable workflow units for repetitive web tasks.
- initial candidates:
  - `landing-page`
  - `project-page`
  - `seo-copy`
  - `perf-a11y`
  - `deploy-vercel`

4. `Sub-agent roles`
- minimal role split:
  - `planner`
  - `builder`
  - `reviewer`

5. `MCP connections` (minimal first)
- start with only high-value integrations:
  - `Vercel`
  - `GitLab (glab)`
  - `Playwright`
  - `Chrome DevTools`
  - `Fly.io`

6. `Verification gate`
- do not treat task as complete until:
  - `./scripts/ai-verify --mode full` passes.

## 6) Spec Writing Rules (Recommended)

- Use RFC keywords for requirements:
  - `MUST`, `SHOULD`, `MAY` (RFC 2119/8174 style)
- Every spec should include:
  - `Scope`
  - `Non-goals`
  - `Acceptance Criteria`
  - `Evidence`
- Merge condition principle:
  - no merge without proof that acceptance criteria are satisfied
  - proof examples: test result, metrics, screenshot, logs

## 7) Web Standards/References to Align With

- API/Data contracts:
  - OpenAPI `3.1.2+` (prefer `3.2.0` when possible)
  - JSON Schema `2020-12`
- Accessibility:
  - WCAG `2.2` (AA target)
  - WAI-ARIA Authoring Practices
- Security:
  - OWASP Top 10 (latest)
- Performance:
  - Core Web Vitals (`LCP`, `INP`, `CLS`)
- Documentation/release hygiene:
  - C4 model (architecture communication)
  - ADR/MADR (decision records)
  - SemVer + Conventional Commits + Keep a Changelog

## 8) Vibesmith Asset Reuse Principle

- Reuse priority:
  - design tokens
  - UI primitives
  - reusable section blocks
- Do not tightly import product-specific business logic into hub pages.
- Classify migrated components into:
  - `Reuse now`
  - `Refactor then reuse`
  - `Reference only`

## 9) Next Documentation Candidates

- `docs/specs/site-product-spec.md`
- `docs/specs/ia-routes-spec.md`
- `docs/specs/component-contracts.md`
- `docs/specs/seo-analytics-spec.md`
- `docs/specs/perf-a11y-spec.md`
- `docs/specs/security-checklist.md`
- `docs/specs/i18n-web-spec.md` (ko/en mandatory)
