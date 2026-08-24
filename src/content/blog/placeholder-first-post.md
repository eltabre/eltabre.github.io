---
title: "Placeholder: a post with everything in it"
summary: "Dummy content. Exercises every field in the schema and most of the markdown elements a real post will need styling for."
date: 2026-03-14
tags: ["placeholder", "astro", "typescript"]
draft: false
---

This post is scaffolding. It exists so the blog index and the post template have
something to render before there is anything real to say. Delete it once the
first genuine post lands.

## A second-level heading

Body copy sits in a 34rem column, which is roughly sixty-five characters per
line. Long enough to hold a thought, short enough that the eye finds the start
of the next line without hunting for it.

### A third-level heading

Below that, headings stop being useful and start being an outline that escaped
into the page.

Some **bold text**, some *italics*, and a bit of `inline code` to check that the
mono stack is loading properly.

## A list

- First item, deliberately short.
- Second item, which runs on somewhat longer so that it wraps onto a second line
  and shows what the indentation does at the wrap point.
- Third item.

And an ordered one:

1. Sample the function onto a grid.
2. Walk the cells.
3. Draw where the contour crosses.

## A code block

```ts
const posts = await getCollection('blog');
const live = posts.filter((p) => !p.data.draft);
live.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
```

## A quote

> The point of the exercise is not that the site gets built quickly.

## A link

Here is [a link to the Astro docs](https://docs.astro.build) sitting mid-sentence,
which is where links are hardest to style well.
