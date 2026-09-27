# Tasnif Taussuk — Portfolio (Next.js 15)

A Next.js 15 (App Router) + TypeScript + Tailwind CSS port of the "career train"
portfolio artifact. Same design, same interactions — restructured into a
maintainable component/data architecture.

## Structure

```
app/
  layout.tsx        Root layout: fonts (next/font), SEO metadata, favicon
  page.tsx           Assembles the four sections below
  globals.css        Design tokens (CSS variables), and hand-tuned CSS for
                     things that don't map cleanly to utility classes
                     (the blueprint grids, elbow branch lines, scroll-driven
                     train positioning, keyframes). Tailwind utilities are
                     used everywhere else.

components/
  Header.tsx           Nav + legend + live Dhaka clock ("use client")
  CareerJourney.tsx     Orchestrates the sticky scroll-driven journey ("use client")
  Station.tsx           A single station dot + label (presentational)
  Train.tsx             The moving car: passengers, signal, status line ("use client")
  Passenger.tsx         A single skill chip (presentational)
  StationPanel.tsx       Station detail panel (work, passengers, result)
  ProjectBranch.tsx      Projects branch-route network ("use client")
  ProjectNode.tsx        A single project destination button (presentational)
  ArchitectureGallery.tsx Architecture card grid + expanded diagram ("use client")
  ArchitectureCard.tsx    A single blueprint tile (presentational)
  ContactStation.tsx      Final stop — fully static (server component)

data/
  stations.ts        Career journey data + passenger-diff helpers
  projects.ts         Project branch data
  architecture.ts      Architecture gallery data
  contact.ts           Contact links

lib/
  types.ts            Shared TypeScript interfaces
  scroll.ts            scrollToStation() + reduced-motion + easing helpers
```

## Design decisions

- **Client/server split**: `ContactStation`, `Station`, `Passenger`, `ProjectNode`
  and `ArchitectureCard` are plain presentational components with no
  directive — they only need `"use client"` if directly imported by a
  server component using hooks, which they aren't; they're rendered inside
  already-client trees. `CareerJourney`, `Train`, `Header`, `ProjectBranch`
  and `ArchitectureGallery` are `"use client"` because they use state,
  effects, or refs (scroll listeners, accordions, the clock).
- **Scroll performance**: the train's position, the rail/progress bar width,
  the door-open state, and the status line ("At Gononet" / "In transit" /
  "Now arriving") are updated **imperatively** via refs inside a
  `requestAnimationFrame`-throttled scroll handler — not React state — so
  scrolling doesn't trigger a re-render every frame. React state
  (`activeIndex`) only updates on the ~5 discrete station arrivals per
  journey, which is when the station panel, passenger manifest and station
  dot styling actually need to re-render.
- **Passenger boarding/exiting** is derived automatically from the
  `passengers` list in `data/stations.ts` — no hardcoded animation timeline.
  `Train.tsx` diffs the current station's passenger set against the
  previous one, tags each name `entering` / `in` / `leaving`, and removes
  `leaving` chips after their exit transition finishes (or instantly, if
  `prefers-reduced-motion` is on).
- **Reduced motion**: a single `matchMedia("(prefers-reduced-motion: reduce)")`
  listener in `CareerJourney` drives both a global CSS override
  (all transitions/animations disabled in `globals.css`) and the scroll
  logic itself — the train snaps directly between stations instead of
  easing through a transit zone.
- **SEO**: title, description, canonical URL, Open Graph and Twitter card
  metadata are set via the App Router `Metadata` API in `app/layout.tsx`.
  Fonts (Space Grotesk, IBM Plex Mono) are loaded with `next/font/google`
  for automatic self-hosting and zero layout shift.
- **SVGs**: the only hand-written SVG is the Projects branch diagram
  (three elbowed paths, computed from `bendX`/`x`/`y` in `data/projects.ts`
  rather than hand-drawn per project). It's a handful of path elements with
  `vector-effect="non-scaling-stroke"` — no external SVG assets to optimize.

## Running locally

```bash
npm install
npm run dev
```

## Deploying

This is a stock Next.js 15 App Router project — push to a Git repo and
import it in Vercel, or run:

```bash
npm run build
vercel deploy --prod
```

No environment variables are required. Before going live, update the
`resumeHref` in `data/contact.ts` and the CV link in `components/Header.tsx`
if the resume URL ever changes, and swap `metadataBase`/canonical URL in
`app/layout.tsx` if the production domain changes.
