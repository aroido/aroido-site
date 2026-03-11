# Static Markdown Blog Spec

- Date: 2026-03-11
- Status: Draft for implementation

## Scope

- Add a same-repo blog to `aroido-site` using Markdown source files committed to Git.
- Generate static HTML for a blog index, paginated archive pages, and per-post detail pages.
- Reuse the current site shell, navigation, theme switch, and visual language.
- Keep blog post body content English-only for v1 while preserving compatibility with the repo's shared `ko`/`en` UI chrome rules.

## Non-goals

- A database-backed CMS is out of scope.
- In-browser editing, comments, search, and external CMS integrations are out of scope.
- Full blog post translation parity is out of scope for v1.
- Tag archive pages are out of scope for v1.

## Requirements

1. Source of truth
- Blog posts MUST live in-repo under `content/blog/*.md`.
- Each post MUST declare frontmatter fields: `title`, `date`, `excerpt`, `slug`, and `draft`.
- `date` SHOULD use RFC 3339 date-time format.
- `slug` MUST be unique and stable across rebuilds.

2. Static generation
- The repo MUST provide a deterministic build script that converts Markdown posts into static HTML pages.
- The script MUST generate:
  - `/blog/index.html`
  - `/blog/page/<n>/index.html` for paginated archive pages after page 1
  - `/blog/<slug>/index.html` for each published post
- Draft posts MUST NOT be emitted into public pages, feeds, or sitemaps.

3. Archive behavior
- Posts MUST be sorted by descending `date`.
- Pagination MUST be enabled from v1.
- The archive SHOULD expose `title`, `excerpt`, published date, reading time, and tags when present.

4. Post detail behavior
- Each post page MUST render semantic article structure with one `h1`.
- Each post page SHOULD expose previous and next article links.
- The Markdown renderer SHOULD support headings, paragraphs, lists, blockquotes, inline code, fenced code blocks, links, and images.

5. Shared site integration
- The top navigation MUST include a blog entry across existing public pages.
- Blog pages MUST reuse the current theme switch and shared site shell.
- Public runtime MUST remain English-first; blog body content MAY remain English-only in v1.

6. SEO and indexability
- Blog archive and post pages MUST emit unique title, meta description, canonical URL, and OG metadata.
- Post pages SHOULD emit `BlogPosting` structured data.
- The archive page SHOULD emit `CollectionPage` or equivalent structured data.
- The repo SHOULD emit `rss.xml` and `sitemap.xml` entries for published blog URLs.

7. Verification
- The repo MUST verify that generated blog artifacts are up to date during local verification.
- `./scripts/run-ai-verify --mode full` MUST pass after implementation.

## Acceptance Criteria

- Given 6 published posts and page size 5, `/blog/` MUST show 5 posts and `/blog/page/2/` MUST exist with the remaining 1 post.
- Given a post with `draft: true`, that post MUST NOT appear in `/blog/`, `/rss.xml`, `/sitemap.xml`, or any generated detail page.
- Given a published post, `/blog/<slug>/` MUST render the post title, published date, excerpt-derived description metadata, and article body.
- Existing primary pages MUST expose a `Blog` navigation entry without regressing current active-state behavior.
- Running `./scripts/run-ai-verify --mode full` MUST succeed and MUST fail when generated blog output is stale.

## Evidence

- CommonMark Spec: https://spec.commonmark.org/
- RFC 3339: https://www.rfc-editor.org/rfc/rfc3339
- Schema.org BlogPosting: https://schema.org/BlogPosting
- Schema.org CollectionPage: https://schema.org/CollectionPage

## Change History

- 2026-03-11: Initial v1 static Markdown blog scope for same-repo operation without a database.
