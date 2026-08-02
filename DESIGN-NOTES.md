# What we designed — 23 July 2026

A record of decisions, not a codebase. You're building this from scratch; this is
the spec to build against.

---

## The site

Personal site at `eltabre.github.io`. Four pages. Three jobs, in priority order:

1. **Notes** — a technical blog. The main event.
2. **Projects** — finished work, short primer, links out.
3. **A reason to finish things** — the project list is public and counts itself.

---

## Structure

**Home.** Hero statement, a two-column grid of project cards, and an excerpt of
the most recent post.

**Notes.** Chronological list in the Lil'Log mould: date, title, one-line
summary, tags. No card decoration. Dense and fast to scan.

**Post.** Date, title, summary, body. Reading column capped around 34rem.

**Projects.** Grid of tiles. Clicking one opens a **modal dialog** — not an
accordion — containing the primer, the stack, one interesting decision, and links
to writeup, demo, and repo.

**About.** Short. Two or three paragraphs and contact links.

### Two rules that shape the content

- **Only two project statuses: `shipped` and `building`.** No "planned." Empty
  aspirational slots make the site read as apologetic rather than motivating.
- **A project counts as shipped when it is deployed, has a README, and does one
  real thing end to end.** Deliberately strict.

---

## Visual design

**Type.** Fraunces for headings, Newsreader for body, IBM Plex Mono for dates,
tags, and metadata. A serif body because the blog is the point — this should read
like an essay site, not a product.

**Two themes, following the OS rather than a manual toggle:**

- **Trailhead** (light) — warm cream paper, moss green, trail-marker orange.
- **Understory** (dark) — forest floor. Deep charcoal-green, muted sage, amber.

**Status markers are trail blazes.** A solid rectangle means the trail continues;
an open one means something's ahead. Shipped is filled, building is open. Same
2:3 proportion as a real blaze. Small, and only legible if you know the
reference — which is the right amount.

**Everything visual lives in about twenty CSS custom properties** at the top of
one stylesheet. Nothing else hardcodes a colour. Swapping the entire look means
editing one block.

---

## The background map

Contour lines, drawn faintly behind the page.

The reason it's contours and not scenery: **a topographic map and a loss
landscape are the same object** — level sets of a function of two variables.
That's the bridge between the hiking interest and the ML work, and it's a real
mathematical fact rather than a decorative theme.

### Function ↔ place pairings

Each visit draws a different named function, with a key in the corner naming it.
Click the key for a fact about the function, a fact about the place, and why they
resemble each other.

| Function | Place | Why they rhyme |
| --- | --- | --- |
| Rosenbrock's valley | Horseshoe Bend, Arizona | Narrow curved troughs. Anything descending has to keep turning to keep descending. |
| Rastrigin | Cockpit Country, Jamaica | One broad basin overlaid with a regular grid of pits. Same structure at two scales. |
| Ackley | Barringer Crater, Arizona | Flat in every direction, then one sudden deep well. Can't be found by feeling the slope. |
| Himmelblau | The Eifel maars, Germany | Several separate basins of near-identical depth. No one of them is the real bottom. |
| Beale | Badlands, South Dakota | Steep ridges separating deep channels. One step too large and you're somewhere else. |
| Six-hump camel | Camelback Mountain, Arizona | A joke, and the key says so. Both named after their humps. |

**Framing matters:** these are resemblances, not claims. No landscape is
literally described by these functions.

### How it should be built

**Render it in CSS, not canvas.** Contours generated ahead of time as SVG,
embedded as data URIs, one per function, selected by a `data-field` attribute on
the root element. Roughly 58 KB for all six.

JavaScript's only job is picking which one — three lines that set an attribute.
The markup carries a default, so if the script never runs, nothing visible
changes.

Dark mode inverts the linework with a CSS filter rather than shipping a second
set of files.

---

## Legibility

Contours at full strength behind body text hurt readability. The fix is
cartographic: **knock the texture out of the reading column** with a `mask-image`
gradient, the way map labels break contour lines where they cross. Full strength
at the page edges, about 15% behind the centre column.

Don't blur it. Blurring turns crisp linework into grey fog.

---

## Things that failed, and why

Worth writing down — each cost real time.

**`sessionStorage` throws in sandboxed frames.** It doesn't return null, it
raises. Called unguarded at module top level, it killed the entire background
script before anything drew. Same applies to geolocation and clipboard: guard
anything that touches them at startup, or it takes the whole module down.

**Canvas parallax.** Drifting the background slower than the page looked good in
principle and drifted out of frame in practice, leaving blank space below.
Removed rather than patched.

**Canvas sizing generally.** `innerHeight` at load is wrong whenever the page
grows afterwards — fonts landing, a host frame resizing. Fixable with
`ResizeObserver`, but the deeper lesson is that CSS backgrounds don't have this
class of bug at all. That's why the final design renders in CSS.

**Glassmorphism, neubrutalism, and the rest.** Tried five directions. The current
revival of glass is real but is meant for navigation chrome and modals, not
dense reading surfaces. Dense content wants solid, high-contrast backgrounds.

---

## Geolocation

Considered and rejected. Browser geolocation triggers a permission prompt, and a
portfolio asking for your location before showing anything reads as alarming.
IP-based lookup skips the prompt, which is worse — it's doing it without asking.
The function/place pairing gets the same sense of place with none of that.

---

## Stack

**Astro + TypeScript, strict.** Plain CSS with custom properties — no Tailwind.
Markdown content with Zod-validated frontmatter, so a typo in a post fails the
build with a useful message rather than rendering wrong.

The whole site is static HTML. The only JavaScript is the modal wiring on the
projects page and the three-line field picker.

Deploy via GitHub Actions to Pages.

---

## Still open

- Is "Notes" the right nav word, or "Blog" / "Writing"?
- The home page grid and the projects page show the same list. Does the home
  grid earn its place?
- **Real elevation data.** SRTM via Open Topo Data is free and works, but their
  public API has CORS disabled — so it has to be fetched at *build time* and
  baked into JSON, never called from the browser. Good later project and squarely
  in your wheelhouse: typed API client, Zod validation, batching. Real terrain
  would sit alongside the loss landscapes using the same renderer.
- Historical map tiles under the Timelines project map — probably a better home
  for the map interest than site decoration.
