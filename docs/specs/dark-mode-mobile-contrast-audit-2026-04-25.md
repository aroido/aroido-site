# Dark Mode Mobile Contrast Audit Spec

Updated: 2026-04-25  
Owner: Aroido Web  
Issue: https://github.com/aroido/aroido-site/issues/10  
Source request: maintainer reported the Tokenmon Dex caption is not the only dark-mode mobile contrast issue.

## 1) Scope

- Audit major public pages in dark mode on mobile and desktop widths.
- Fix recurring low-contrast patterns, not only the single reported Tokenmon Dex caption.
- Keep the fix CSS-only unless markup must change.

## 2) Non-goals

- Do not redesign the full visual theme.
- Do not change product copy, page routes, or generated content semantics.
- Do not add a new design-token system.

## 3) Acceptance Criteria

1. The reported Tokenmon Dex caption is readable in mobile dark mode.
2. Shared media captions, inline code, article image captions, and similar late-declared surfaces have explicit dark-mode styling when their light-mode backgrounds remain light.
3. Automated dark-mode contrast smoke checks cover at least:
   - `/`
   - `/projects/`
   - `/projects/tokenmon/`
   - `/blog/`
   - one article detail page
4. `./scripts/run-ai-verify --mode full` passes.

## 4) Change Log

- 2026-04-25: Initial spec for full dark-mode mobile contrast audit.
- 2026-04-25: Full-document contrast audit found shared `.media-card figcaption` failures on Tokenmon and LayoutRecall pages; added a shared dark-mode caption treatment.

## 5) Verification Evidence

- Pre-fix audit failures:
  - `/projects/tokenmon/`: Dex and Settings media captions at contrast ratio `1.14`.
  - `/projects/layoutrecall/`: menu bar and settings media captions at contrast ratio `1.14`.
- Post-fix CDP contrast smoke checked mobile and desktop widths for `/`, `/projects/`, `/projects/tokenmon/`, `/projects/vibesmith/`, `/projects/layoutrecall/`, `/blog/`, `/blog/cursor-background-agents-for-teams/`, `/team/`, and `/contact/`; all returned no low-contrast candidates.
- Captured mobile dark-mode screenshot at the reported Tokenmon Dex caption after the fix.
