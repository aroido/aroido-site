# Hobocode Remote Config privacy disclosure

Date: 2026-10-19
Issue: https://github.com/aroido/aroido-site/issues/69

## Scope and evidence

Apply the user-approved Korean, English and Japanese additions to the three Hobocode privacy pages and their existing runtime translation keys. The user's app-review audit compared build 0.1.1(99), Firebase 13.0.1 source and app code: Remote Config requests are separate from ad loading and may occur before consent permits ad requests; configuration and diagnostics process the supplied installation/authentication, device, app and SDK fields. Note text, selected photos and saved place coordinates are not sent as Remote Config parameters. Firebase Analytics and PostHog analytics are disabled specifically in build 99. This website task does not independently re-audit the IPA or release an app.

Use the supplied five sentences in each language without broadening their meaning. Keep the existing ad-request consent wording and website-analytics disclosure. Do not add retention periods, processing-country commitments or deletion guarantees. Advance only these three policies' effective-date values to October 19, 2026.

## Scope boundaries

- Change only `/hobocode/privacy/`, `/ko/hobocode/privacy/`, `/ja/hobocode/privacy/`, the corresponding existing translation values and this required specification.
- Preserve all Chinese values and rendered pages, every other page, assets, scripts, canonical/hreflang/SEO metadata, support dates and existing policy sections.
- The user's explicit three-language scope overrides the repository's usual four-language copy rule for this change.
- Preserve other workers' changes. Use a dedicated branch and GitHub PR, then the existing authorized main-to-Vercel web deployment path. No app deployment.

## Acceptance and validation

- The provided additions appear exactly once in each target static HTML and rendered page after runtime translation loading.
- A semantic comparison limits translation changes to the three existing protection bodies and effective dates. All other tracked website files remain byte-identical to the starting production commit except the specification.
- Existing full repository verifier passes; independent PR review reports findings or No findings.
- Check the three pages at 390px with no overflow or JS errors, functioning language links and preserved metadata.
- After production deployment succeeds, read all three public HTTP200 responses and verify complete approved text, effective dates and exact file bytes. Record deployment commit and results separately from local verification.
