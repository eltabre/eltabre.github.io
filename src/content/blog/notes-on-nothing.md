---
title: "Notes on nothing in particular"
summary: "Dummy content. Deliberately omits the tags and draft fields to prove the schema defaults fill them in."
date: 2026-08-02
---

The frontmatter above has only three fields: `title`, `summary`, and `date`.
There is no `tags` line and no `draft` line.

The build should not fail. Both missing fields have a `.default()` in the
schema, so Zod fills them in — `tags` becomes an empty array and `draft`
becomes `false`. This post should therefore appear in the index like any other,
with no tags shown next to it.

If it *did* fail, the defaults are written as `.optional()` somewhere instead.

A short second paragraph, so the post has more than one and the spacing between
them is visible.
