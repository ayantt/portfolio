# CLAUDE.md — Tasnif Taussuk Portfolio (Career Train)

Persistent development context for this repository. Read this before changing
anything. This file documents the **actual implementation** as found in the
code, not an aspirational design.

When the owner's description of a feature and the code disagree, **the code is
documented here as the truth** and the discrepancy is called out explicitly.

---

## 1. Project Overview

A single-page personal developer portfolio for **Tasnif Taussuk**, Software
Engineer, Dhaka. It presents the career history as a **city transit map**:
the career is a train line, each job/education stage is a **station**, skills
are **passengers** that board and leave the train, and personal projects are
**branch routes** off the main line.

- **Framework:** Next.js 15.5.26, App Router, React 18.3.1, TypeScript 5.6.3
- **Styling:** Tailwind CSS 3.4.13 for layout/typography utilities + a single
  hand-written `app/globals.css` for the transit-map visuals
- **No runtime dependencies beyond React/Next** — no animation library, no
  icon package, no state manager, no UI kit. All animation is hand-rolled
  CSS + `requestAnimationFrame`.
- **No environment variables.**
- **Repo:** `git@github.com:ayantt/portfolio.git`, branch `main`
- **Deployment:** Vercel (no `vercel.json` in the repo — stock Next.js config)
- **Production domain:** `https://ayantt.dev`
- **Build status (verified 2026-09-27):** `npm run build` succeeds. Route `/`
  is statically prerendered.

---

## 2. Core Concept

| Metaphor | Implementation |
|---|---|
| Train | Sticky full-viewport `.stage` with an absolutely-positioned `.train-car` moved by `transform` on scroll |
| Career line | The 500vh scroll region `#journey`; 5 stations → 4 segments |
| Station | Absolutely-positioned `<button class="station-btn">` with a dot + label |
| Passenger | A skill/technology chip inside the train car |
| Branch route | The Projects section — an SVG elbow-line diagram branching from "GONONET" |
| Blueprint / control room | The Architecture section — grid-backed cards + a vertical block diagram |
| Platform / final stop | The Contact section, `.pg.final` |

**Projects are NOT stations, and are NOT tied to any single station.** They
live in a separate section (`#projects`) below the journey and are explicitly
framed in the copy as "Branch routes — independent lines": independent
work that runs parallel to the career line rather than branching off one
specific stop (earlier revisions framed this as branching off Gononet — that
tie was removed; the trunk label now reads "INDEPENDENT LINE" and the detail
panel's second column says "Independent line — Built on my own time — not a
stop on the career line above").

**Architecture is NOT on the career line.** It is a separate section
(`#architecture`), framed as "Control room."

---

## 3. Repository Structure

```
app/
  layout.tsx        Root layout: SEO metadata, viewport, favicon. NO next/font.
  page.tsx           Server component; assembles the 4 sections in order
  globals.css        914 lines. All design tokens + hand-tuned transit CSS
components/
  Header.tsx           "use client" — nav, legend, live Dhaka clock
  CareerJourney.tsx    "use client" — sticky scroll orchestrator (the core)
  Train.tsx            "use client" — the car; imperative handle + passenger diff
  Station.tsx          presentational — one station button
  Passenger.tsx        presentational — one skill chip
  StationPanel.tsx     presentational — station detail panel (3 columns)
  ProjectBranch.tsx    "use client" — projects branch network + detail panel
  ProjectNode.tsx      presentational — one project node button
  ArchitectureGallery.tsx "use client" — arch grid + expanded diagram
  ArchitectureCard.tsx   presentational — one blueprint tile
  ContactStation.tsx   server component — fully static
data/
  stations.ts        STATIONS + passenger-diff helpers (source of truth)
  projects.ts        PROJECTS with x/y/bendX diagram coordinates
  architecture.ts    ARCHITECTURE cards with blocks/notes/result
  contact.ts         CONTACT links + resumeHref
lib/
  types.ts           Shared interfaces (Station, Project, ArchitectureCardData…)
  scroll.ts          JOURNEY_ID, ease(), prefersReducedMotion(), scrollToStation()
public/
  Tasnif_Taussuk_CV.pdf   (71 KB) — the resume
```

---

## 4. Career Train Architecture

`components/CareerJourney.tsx` is the heart of the site.

**Structure:** `<section id="journey" className="h-[500vh]">` (hardcoded
scroll runway) containing a `position: sticky; height: 100dvh` `.stage` with
CSS grid rows `auto auto minmax(0,1fr) auto` (header / legend / route / panel).

**Two-phase update model — this is the key thing to understand:**

1. **`update()`** — called on every rAF-throttled scroll event. It does
   **no React state updates**. It writes directly to the DOM:
   - `car.setPosition(x, y)` → `transform: translate(...)`
   - progress bar width via `prog.style`
   - `car.setOpen/stopped/status(...)` → class toggles and `textContent`
   - `stage.classList.toggle("moving", ...)` → dims the panel while in transit
   - `hint.style.opacity` → fades the "Scroll to depart ↓" hint
2. **`setActiveIndex(idx)`** — the *only* state update, and it fires just
   ~5 times per full journey, at discrete station arrivals. This is what
   re-renders `StationPanel` and the passenger manifest.

---

## 5. Station Data Model

`data/stations.ts` is the **single source of truth** for the whole journey.
Five stations, in order:

| # | id | Short | Role | Period | Notes |
|---|---|---|---|---|---|
| 0 | `southeast` | Southeast University | B.Sc. Comp. Sci. | 2013–2018 | Origin station |
| 1 | `datahead` | Datahead | Software Engineer | Sep 2019 — Oct 2021 | Business systems |
| 2 | `naas` | NAAS | Software Engineer | Mar 2022 — Mar 2024 | Telecom, KPI |
| 3 | `gononet` | Gononet | Software Engineer | Apr 2024 — Present | Golang ERP |
| 4 | `future` | Future | - | - | Terminus |

### Passenger diff helpers (`data/stations.ts`)

The whole boarding/exiting system is **derived, never hardcoded**:

| Helper | Meaning |
|---|---|
| `passengerName(e)` | name of a string or tuple entry |
| `passengerSet(i)` | `Set` of names present at station `i` |
| `arrivals(i)` | tuple entries at `i` → treated as **boarding** |
| `leaving(i)` | in `passengers[i-1]` but not `passengers[i]` |
| `continuing(i)` | in both |

### `Station` interface (`lib/types.ts`)

```ts
type PassengerEntry = string | [name: string, reason: string];
interface Station {
  id, name, short, type, role: string;
  period?: string;
  desc: string;
  work: WorkGroup[];        // { heading, items[] }
  passengers: PassengerEntry[];
  result?: { value, label, detail };
  note?: string;            // railway annotation, desktop/tablet only
  current?: boolean;        // renders "◉ current" tag + "YOU ARE HERE"
  future?: boolean;         // renders a dashed station ring
}
```

---

## 6. Projects (Branch Routes)

`data/projects.ts` + `components/ProjectBranch.tsx` + `ProjectNode.tsx`.

**Diagram:** an inline `<svg viewBox="0 0 1000 380" preserveAspectRatio="none">`
containing one `<path>` per project, generated by
`elbowPath(x, y, bendX) => "M20 170 H{bendX} V{y} H{x}"`. Coordinates live in
the data (`x`, `y`, `bendX`), not in hand-drawn SVG. Paths use
`vector-effect="non-scaling-stroke"`. The trunk originates at x=20, y=170.

**Node positioning:** `left: x/10 %`, `top: (y/380) * 100 %` of the
`.branch` box, which has `aspect-ratio: 1000/380`. **Coordinates are coupled
to that aspect ratio** — changing one without the other breaks the diagram.

---

## 7. Architecture Gallery

`data/architecture.ts` + `ArchitectureGallery.tsx` + `ArchitectureCard.tsx`.

Three cards in a `repeat(3, 1fr)` grid (1 column ≤900px), each with a
grid-paper `::before` background (the "blueprint" texture). Clicking expands a
shared `#architecture-detail` panel containing a vertical block diagram
(`.arch-rail`, blocks separated by `↓` arrows) plus an optional
`.result-block` and `.arch-notes` list.

**The ≈20% metric appears in two independent places** and must stay
attributed precisely:
- `data/stations.ts` → Gononet `result.detail`
- `data/architecture.ts` → db-arch `result.detail`

**Never** rewrite this as a generic "20% performance improvement".

---

## 8. SEO / Branding

- All meta in `app/layout.tsx`.
- Palette is CSS custom properties in `globals.css` with dark mode support.
- **Do not** introduce SaaS-dashboard patterns, generic hero sections,
  gradient-heavy cards, glassmorphism, or drop shadows. This is a
  control-room / printed-transit-map register, and it is deliberate.

---

## 9. Development Workflow

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verifies types + lint + static generation
npm run lint     # next lint (eslint-config-next, core-web-vitals)
```

### Known rough edges, left intentionally:

| Issue | Where |
|---|---|
| None | — |
| No `/resume` route despite the documented URL | `app/` |
| Detail panels can't be collapsed | `ProjectBranch.tsx`, `ArchitectureGallery.tsx` |
| No `openGraph.images` / `twitter.images` | `app/layout.tsx` |

Resolved since the last pass: fonts are now self-hosted via `@fontsource`
(`layout.tsx` imports the weight-specific CSS; `body { font-family:
var(--font-grotesk) }` in `globals.css` actually applies it — previously the
CSS variable was defined but never assigned to anything, so the page silently
fell back to the browser default). The CV link in `Header.tsx` imports
`CONTACT.resumeHref` again instead of hardcoding its own copy of the URL.
The stray global `JSX.IntrinsicElements` augmentation at the top of
`Header.tsx` is gone.
| Journey runway is a hardcoded `h-[500vh]` | `CareerJourney.tsx` |
