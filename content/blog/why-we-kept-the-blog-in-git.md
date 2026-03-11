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

The current Aroido site is already a clean static deployment. That changes the right question.

The goal is not to find the most powerful publishing stack. The goal is to add a writing surface that stays easy to maintain while the product story is still tightening.

Keeping posts in Git gives us a few advantages immediately:

- The source of truth stays close to the site.
- Every content change is reviewable in merge requests.
- Rollback is trivial.
- Vercel can keep serving fully static pages with no extra runtime.

This approach also matches how we already work on product communication. We care about deliberate edits, explicit diffs, and shipped artifacts that remain legible later.

We can always add a CMS when the authoring surface becomes a bottleneck. Right now, it is not the bottleneck. Clarity is.

For v1, a Git-backed blog is enough to publish product notes, delivery decisions, and operating model updates without adding a second system to maintain.
