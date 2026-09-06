# eltabre.github.io

Personal site — notes, projects, and a contour-map background drawn from real
elevation data. Astro, strict TypeScript, plain CSS. No Tailwind, no UI
framework. The only JavaScript that reaches a browser is the project modal and
a five-line background picker.

## Running it

```sh
nvm use          # reads .nvmrc — Astro needs Node >= 22.12
npm install
npm run dev      # http://localhost:4321
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npx astro check` | Typecheck. **CI runs this and a failure blocks deploy.** |
| `npm run contours` | Regenerate the background SVGs (see below) |

## Adding things

### A blog post

Create `src/content/blog/some-slug.md`. The filename becomes the URL
(`/blog/some-slug`). Frontmatter is validated by Zod at build — a typo fails the
build with the file and field named.

```yaml
---
title: "Post title"
summary: "One line shown on the index."
date: 2026-09-05
tags: ["astro", "cv"]   # optional, defaults to []
draft: false            # optional, defaults to false
---
```

`draft: true` keeps a post out of both the index and the build entirely.

### A project

Create `src/content/projects/some-slug.md`.

```yaml
---
title: "Project name"
tagline: "One line on the tile."
status: shipped          # or: building. Those are the only two.
order: 3                 # grid position, ascending
stack: ["python", "onnx"]
featured: true           # optional — shows on the home page, max 4
repo: "https://..."      # optional
demo: "https://..."      # optional
blogPost: "https://..."  # optional
---

The body is the primer shown inside the project's modal.
```

**A project is `shipped` only when it is deployed, has a README, and does one
real thing end to end.** Deliberately strict — see BUILD-BRIEF.md.

### A background place

1. Add an entry to `src/lib/places.ts` (right-click in Google Maps for lat/lon):

   ```ts
   {
     slug: 'glacier',
     name: 'Glacier National Park',
     region: 'Montana',
     lat: 48.70,
     lon: -113.72,
     zoom: 11,          // 11 ≈ 55 km across; 12 halves that
     note: 'Shown when the corner key is expanded.',
   },
   ```

2. Run `npm run contours`.
3. Commit the new `public/contours/*.svg` and the regenerated
   `src/styles/contours.css`.

`places.ts` is the only file where a slug is written by hand. The generator
writes the CSS mapping, and the picker reads the list, so they cannot drift.

## How the background works

`scripts/generate-contours.mjs` fetches public AWS terrarium terrain tiles
(SRTM elevation encoded in RGB, no API key), stitches a 3×3 tile block,
downsamples to a 320×320 grid, traces 26 contour levels with `d3-contour`,
simplifies the polylines with Ramer–Douglas–Peucker, and writes one SVG per
place. Simplification is what takes each file from ~300 KB to ~40–70 KB
gzipped.

**This runs manually, not during the build.** The SVGs are committed, so CI
never touches the network and builds stay deterministic. Tiles are cached under
`node_modules/.cache/`.

At runtime, an inline script in `BaseLayout` sets `data-field` on `<html>` to a
random slug. CSS maps that to a background image. The markup carries a default,
so if the script fails nothing visible changes. Dark mode inverts the linework
with a CSS filter rather than shipping a second set of files.

## Deploying

Push to `master`. `.github/workflows/deploy.yml` runs checkout → Node 24 →
`npm ci` → `npx astro check` → `npm run build` → publish to GitHub Pages.

The typecheck is a gate: a type error fails the run and the deploy job is
skipped, so the live site stays on the last good version. It only catches what
the type system can see — a typo in prose or a wrong date deploys happily.

## Gotchas

- **Deleted content keeps rendering.** The content store is cached at
  `node_modules/.astro/data-store.json`, not in `.astro/`. Clear it with
  `rm -rf node_modules/.astro .astro dist`.
- **Astro's scoped styles beat global classes.** Component `<style>` blocks
  compile to attribute selectors, which outrank anything in `global.css`. Use
  `margin-block` / `margin-inline` rather than blanket `margin` to stay clear.
- **Markdown output carries no scoping attribute.** Styles aimed at rendered
  post bodies need `:global()`.
- **`src/assets/` vs `public/`.** Files in `src/assets/` go through Astro's
  image pipeline (resized, WebP, fingerprinted). Files in `public/` are copied
  byte-for-byte. Images belong in the first, PDFs in the second.

## Layout

```
src/
  content.config.ts     Zod schemas for blog + projects
  content/              markdown: one file per post / project
  lib/
    projects.ts         status metadata, sorting, counting
    places.ts           background places
  components/           SiteHeader, BadgeGrid, ProjectCard, MapKey
  layouts/BaseLayout.astro
  pages/                file-based routing
  styles/
    global.css          every design token
    contours.css        generated — do not edit
scripts/
  generate-contours.mjs
```

`BUILD-BRIEF.md` and `DESIGN-NOTES.md` hold the full spec and the design
decisions. They are gitignored — local only, not in the repo.
