# Dark Mode Contrast Fix Spec

Updated: 2026-04-25  
Owner: Aroido Web  
Issue: https://github.com/aroido/aroido-site/issues/8  
Source request: maintainer reported dark-mode cases where background and text are both white.

## 1) Scope

- Fix dark-mode contrast regressions on the public Aroido static site.
- Keep the correction CSS-only unless markup is required.
- Verify core public pages in dark mode after the fix.

## 2) Non-goals

- Do not redesign the site theme.
- Do not change public copy, routing, or product positioning.
- Do not introduce a new theme system.

## 3) Current Problem

The skip-link uses a fixed white background while its foreground color inherits `--ink`. In dark mode, `--ink` becomes light, so keyboard focus can expose a near-white-on-white accessibility link.

## 4) Acceptance Criteria

1. The skip-link has explicit dark-mode foreground/background colors.
2. Dark-mode smoke checks on key pages report no obvious low-contrast text/background pairs caused by white-on-white surfaces.
3. `./scripts/run-ai-verify --mode full` passes.

## 5) Change Log

- 2026-04-25: Initial spec for dark-mode contrast regression fix.
- 2026-04-25: Confirmed the reproduced white-on-white case is the focused skip-link and added a dark-mode override.

## 6) Verification Evidence

- CDP dark-mode contrast smoke checked `/`, `/projects/`, `/projects/tokenmon/`, `/blog/`, and `/blog/cursor-background-agents-for-teams/`; no bright-text-on-bright-background candidates remained.
- `./scripts/run-ai-verify --mode full` passed.
