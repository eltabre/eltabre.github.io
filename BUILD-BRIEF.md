# eltabre.github.io — build brief

A working spec plus a teaching protocol. Hand this to Claude Code at the start of a session.

---

## 0. How to use this document

Open a terminal in an empty directory and start Claude Code. Paste the block in
**§7 Kickoff prompt** as your first message, with this file in the directory so
it can read the rest.

The point of this project is that **I learn TypeScript by building it**, not that
the site gets built quickly. A brief that produces a finished site and an
unchanged developer has failed.

---

## 1. What this is

Personal site for an AI engineer working in computer vision. Three jobs, in order:

1. **Notes** — a technical blog. The main event. Build logs, papers worked
   through, things gotten wrong the first time.
2. **Projects** — finished work, with a short primer and links out.
3. **A reason to finish things.** The project list is public and counts itself.

Existing site: `eltabre.github.io` (GitHub Pages, user site, deploys from repo root).

---

## 2. Decisions already made

These were settled through design iteration. Don't relitigate them without reason.

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | **Astro** | Content collections give typed frontmatter. Ships zero JS by default; only the pages that need script get script. |
| Language | **TypeScript, strict** | The point of the exercise. Extend `astro/tsconfigs/strict`. |
| Styling | **Plain CSS with custom properties** | No Tailwind. Every design token in one file; component styles scoped by Astro. Swapping the whole look = editing one block. |
| Content | **Markdown + Zod schemas** | Frontmatter validated at build. A typo fails the build with a useful message. |
| Blog vs projects | **Separate feeds** | Different reader intent: essays vs scanning outcomes. |
| Project detail | **Modal dialog**, native `<dialog>` | Not an accordion. Browser handles focus trap, Escape, and backdrop. |
| Project statuses | **`shipped` and `building` only** | No `planned`. Aspirational entries make the site read as apologetic. |
| Light theme | **Trailhead** — warm paper, Fraunces + Newsreader, moss/trail-orange | Reads as an essay site, which is what it is. |
| Dark theme | **Understory** — forest floor, same type | Follows OS `prefers-color-scheme`. Not a manual toggle. |
| Background | **Pre-generated contour SVGs in CSS** | See §5. Not canvas — CSS backgrounds cannot mis-measure themselves. |
| Deploy | **GitHub Actions → Pages** | `withastro/action@v3`. Set Pages source to GitHub Actions. |

### Definition of shipped

A project may be marked `shipped` only when it is **deployed, has a README, and
does one real thing end to end.** This is deliberately strict.

---

## 3. Structure

```
src/
  content.config.ts        Zod schemas for blog + projects
  content/
    blog/*.md              one file per post
    projects/*.md          one file per project; body is the primer
  lib/
    projects.ts            status metadata, sorting, counting
    fields.ts              named scalar fields + paired places
  components/
    SiteHeader.astro
    BadgeGrid.astro        home page project grid
    ProjectCard.astro      tile + <dialog>
    PostList.astro         chronological post list
    MapKey.astro           corner key naming the current field
  layouts/BaseLayout.astro
  pages/
    index.astro
    about.astro
    blog/index.astro
    blog/[...slug].astro
    projects/index.astro
  styles/global.css        all design tokens
.github/workflows/deploy.yml
```

### Content schemas

```
blog:     title, date, summary, tags[], draft
projects: title, tagline, status, order, stack[], decision?, repo?, demo?, writeup?
```

---

## 4. Milestones

Each milestone ends with something visible in a browser. Do not start the next
until the current one runs.

**M1 — Skeleton.** Astro project, strict TS, `BaseLayout`, `SiteHeader`, global
tokens. One static page.
*Learning: what a `.astro` file is, the frontmatter fence, typed `Props`.*

**M2 — Content collections.** `content.config.ts`, three real posts, blog index,
`[...slug].astro`.
*Learning: Zod schemas, type inference from a schema, `getCollection`,
`getStaticPaths`, dynamic routes.*

**M3 — Projects.** Project collection, `BadgeGrid`, `ProjectCard` with `<dialog>`,
`lib/projects.ts`.
*Learning: union types from a schema, `Record<K,V>` for lookup tables, typed
helper functions, `querySelector<T>` generics.*

**M4 — Deploy.** Actions workflow, Pages configured, custom 404.
*Learning: CI, build vs runtime, base paths.*

**M5 — Contour background.** `fields.ts`, the generation script, `MapKey.astro`.
**See §5.**
*Learning: typed tuples, `Float32Array`, marching squares, data attributes as a
CSS interface, guarding APIs that throw.*

**M6 — Polish.** RSS feed, tag filtering on the notes page, OG images.

Ship M1–M4 before starting M5. A deployed plain site beats a beautiful local one.

---

## 5. The contour background

The background draws contour lines of a named scalar field. A topographic map and
a loss landscape are the same object — level sets of a function of two variables —
which is why this is here rather than a stock texture.

**Render it in CSS.** Contours are generated ahead of time as SVG, embedded as
data URIs (about 58 KB for six functions), and selected by a `data-field`
attribute on the root element. JavaScript's only job is picking which one: three
lines that set an attribute. The markup carries a default, so a script failure
changes nothing visible.

Dark themes invert the linework with a CSS filter rather than shipping a second
set of files.

`fields.ts` holds the function definitions and their paired places — Rosenbrock ≈
Horseshoe Bend, Rastrigin ≈ Cockpit Country, Ackley ≈ Barringer Crater,
Himmelblau ≈ the Eifel maars, Beale ≈ the Badlands, six-hump camel ≈ Camelback
Mountain. A corner key names the pairing and expands to show a fact about each
and why they resemble one another. **These are resemblances, not claims.**

### Generating the SVGs

A build-time script samples each function onto a grid, runs **marching squares**
to trace the contours, simplifies the polylines with Ramer–Douglas–Peucker, and
writes the CSS. Every third contour is drawn heavier as an index line.

Marching squares is the part worth understanding: each grid cell has four
corners, each above or below the target elevation, giving a 4-bit code 0–15. The
code says which edges the contour crosses. Sixteen cases, one switch statement.

### Hard-won details

- **Guard `sessionStorage`.** It *throws* in sandboxed frames rather than
  returning null. Unguarded at module top level, it kills the whole script.
  Same for geolocation and clipboard.
- **Do not use a canvas for this.** Tried it twice. `innerHeight` at load is
  wrong whenever the page grows afterwards, and parallax drifts out of frame
  leaving blank space. CSS backgrounds have neither problem.
- **Mask the reading column.** Contours at full strength behind body text hurt
  legibility. Knock the texture out of the centre column with a `mask-image`
  gradient — what real maps do where labels cross contours. Don't blur; blurring
  muddies it into grey fog.

### Rules of engagement for §5

The marching squares implementation is **mine to write.** Claude Code must not
write it for me. It is self-contained, has no framework in it, and produces a
visible result — the best teaching artifact in the project. Teach the algorithm,
let me implement the sixteen cases, review what I write.

## 6. Teaching protocol

**Default: Teacher Mode.** Not because every message says "explain," but because
that is the point of the project.

1. **Never hand me the finished code first.** Break the concept into steps.
2. **One step at a time.** Wait for working code before moving on.
3. **Use an analogy** when the logic is unfamiliar.
4. **End each step with a targeted question or a tiny exercise** so I take the
   next step myself.
5. **Show me the type error, don't route around it.** `astro check` failures are
   the lesson. Explain what the compiler is objecting to and why it is right.
6. **Safety valve.** If I say **"just tell me"**, **"I give up"**, or **"uncle"**,
   drop Teacher Mode immediately and give the full correct code. No preamble.

### What Claude Code may write outright

Config and boilerplate where there is nothing to learn: `astro.config.mjs`,
`tsconfig.json`, the Actions workflow, `package.json`, markdown content files.

### What Claude Code must not write for me

- the marching squares / contour generation script
- `src/content.config.ts` — the Zod schemas; this is the densest TypeScript in
  the project and the one that makes everything else typed
- `src/lib/projects.ts` — small, and good practice with `Record` and unions
- The first `.astro` component — I need to write one from scratch to know how

For these, Claude Code explains the concept, describes the shape of the solution,
and reviews what I write.

### Checkpoints

At the end of each milestone, ask me to explain in my own words what I just
built. If I can't, we go back. Suggested checkpoints:

- M2: *Why does changing the Zod schema change the types on the blog index page?*
- M3: *Why does `Record<Status, StatusMeta>` fail to compile if I add a status to
  the schema but not the lookup table? Why is that good?*
- M5: *Why does marching squares need sixteen cases and not four?*

---

## 7. Kickoff prompt

> I'm rebuilding my personal site at eltabre.github.io. `BUILD-BRIEF.md` in this
> directory has the full spec, the decisions already made, the milestones, and a
> teaching protocol — read it first and follow it.
>
> The important part: I'm doing this to learn TypeScript properly. Don't write
> the code for me except where §6 says you may. Teach the concept, let me
> implement, review what I write. If I say "just tell me", drop that immediately
> and give me the answer.
>
> Start with M1. Before writing anything, tell me what an Astro component file
> is and why it has a frontmatter fence at the top — then let me write
> `BaseLayout.astro` myself.

---

## 8. Open questions

- Is "Notes" the right nav word, or "Blog" / "Writing"?
- Home page currently shows the project grid *and* the projects page shows the
  same list. Does the home grid earn its place, or should projects live only on
  one page?
- Real elevation data: SRTM via Open Topo Data is free, but their public API has
  CORS disabled — so it must be fetched at **build time** and baked into JSON,
  not called from the browser. Good later project, and squarely in my wheelhouse
  (typed API client, Zod validation, batching). The contour renderer already
  accepts any `Float32Array`, so real terrain drops straight in beside the
  loss landscapes.
- Historical map tiles under the Timelines project map — probably a better home
  for the map interest than site decoration.
