# Natural Korean copy

Issue: https://github.com/aroido/aroido-site/issues/38

Approved: rewrite Korean copy around “여기 오면 기억하려고 했는데, 또 까먹었다.” and concrete everyday notes. Remove personification, abstract advertising and repetitive explanations. Preserve theme, other locales, actual captures, permission conditions, prerelease status and privacy meaning. Do not retouch screenshot text.

Acceptance: independent Korean copy review; mobile wrapping/button length; regenerate font subsets for new Hangul without changing type styling; unchanged EN/JA/ZH output; full gate; Preview then authorized merge/deployment and production text verification.

## Validation
- Independent Korean reviewer approved direction; applied all three suggestions: remove visit-planning implication, shorten product explanation, reduce reminder repetition.
- No dedicated Korean style-correction skill was available or claimed.
- Build/full gate9/9, four-language64-case layout passed. 320/390/768/1440 plus reduced-motion/no-JS: no overflow, JS errors or Axe findings in JS-enabled runs.
- EN/JA/ZH generated HTML, CSS, scene code and screenshot assets byte-identical to previous main. Only Korean copy and required glyph subsets changed.
- Actual screenshot text stays as captured; prose uses approved everyday wording.
