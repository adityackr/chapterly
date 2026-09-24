# Chapterly — Turn YouTube Videos into Courses

Paste a YouTube link. Chapterly splits the video by its timestamps into bite-size
lessons with a course-style sidebar, trimmed playback, progress tracking, and
resume — all in the browser, with no backend.

## How it works

1. **Add a video** — paste any YouTube URL (watch, `youtu.be`, Shorts, embed) or a
   raw 11-character video ID on the **Add video** page.
2. **Auto-fetch chapters** — with a free YouTube Data API v3 key (set in
   **Settings**, full tutorial included), Chapterly fetches the title, thumbnail,
   and description, then parses every timestamp into lessons. No key or no
   timestamps? Paste the chapter list manually (`00:00 Intro`, one per line).
3. **Learn lesson by lesson** — the course player shows lessons in the left
   sidebar and plays just that segment on the right. Scrub freely with the
   native controls (or ±10s buttons); the sidebar follows you. Natural playback
   across a chapter boundary marks the lesson done and auto-advances (or pauses,
   if you turn auto-advance off).
4. **Track & resume** — check off lessons, edit/reorder/retime them, collapse the
   sidebar, change speed up to 2x. Everything persists in `localStorage`, so you
   resume exactly where you left off.
5. **Organize** — drag cards by their grip handle on the **Library** page to
   rearrange your courses; the order is saved instantly (dragging is disabled
   while a search filter is active).

> Lessons are *virtual* segments (seek + auto-stop via the YouTube IFrame API),
> not re-encoded clips — that's what makes a backend unnecessary.

## Tech stack

| Layer      | Choice |
| ---------- | ------ |
| Framework  | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling    | Tailwind CSS v4 + shadcn (Base UI primitives, neutral theme) |
| Theming    | `next-themes` (light / dark / system) with warm off-white dark tokens |
| Fonts      | Inter (UI) + Geist Mono (timestamps/code) via `next/font` |
| Video      | YouTube IFrame API (custom wrapper — free scrub, seek detection, chapter-end enforcement) + YouTube Data API v3 for metadata |
| Storage    | Browser `localStorage` only — courses (+ their order), progress, API key, sidebar state |
| Icons      | Lucide |
| Drag & drop | `@dnd-kit` sortable (library card reordering) |

## Project structure

```
app/
  page.tsx                 # landing page (composition only)
  _components/             # landing sections: hero, product-mock, features,
                           # how-it-works, cta-band, faq, footer
  library/page.tsx         # course library + search + drag-to-reorder
  add/
    page.tsx               # add-video form (JSX only)
    _hooks/use-add-video.ts
  course/[id]/
    page.tsx               # player page (composition only)
    _hooks/use-course-player.ts
    _components/           # player-section, lessons-sidebar, course-footer,
                           # course-skeleton, course-not-found
  settings/page.tsx        # API key + step-by-step key tutorial
components/
  ui/                      # shadcn primitives (button, card, dialog, …)
  hooks/                   # shared component hooks (chapter editor, video player)
  VideoPlayer.tsx / ChapterSidebar.tsx / ChapterEditor.tsx / …
config/home-page.ts        # all landing-page copy in one place
lib/
  youtube.ts               # ID parsing, chapter parsing, timestamp stripping, API fetch
  storage.ts               # localStorage CRUD for courses / progress / API key
  types.ts                 # Course, Chapter, Progress, VideoMeta
```

Conventions: pages stay lean (JSX + composition), route logic lives in colocated
`_hooks/`, shared-component logic in `components/hooks/`, landing copy in
`config/home-page.ts`, and UI copy uses shadcn primitives instead of raw HTML.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | What it does              |
| --------------- | ------------------------- |
| `npm run dev`   | Start the dev server      |
| `npm run build` | Production build          |
| `npm start`     | Serve the production build|
| `npm run lint`  | ESLint                    |

## Notes & limits

- A YouTube Data API key is only needed for auto-fetch; manual chapter paste
  always works without one (free quota ≈ 6,000 lookups/day).
- Data lives in `localStorage`, so courses don't sync across browsers/devices.
- Embeds require network access to YouTube; ad-blockers can interfere with the
  IFrame API — disable them for the app if the player won't load.
