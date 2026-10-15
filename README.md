# Chapterly — Turn YouTube Videos into Courses

> Paste a YouTube link. Chapterly splits the video by its timestamps into bite-size
> lessons with a course-style sidebar, trimmed playback, progress tracking, and
> resume — all in the browser, with no backend.

## What is this?

**Chapterly** is a free, private, frontend-only web app that turns long YouTube
videos (tutorials, lectures, podcasts, talks) into structured mini-courses.

Many creators already put timestamps in their video descriptions
(`00:00 Intro`, `05:12 Setup`, …). Chapterly reuses those timestamps as
**lessons**: each lesson plays only its own segment of the video, tracks
completion, and remembers where you left off — like Udemy/Coursera, but for any
YouTube video and without uploads, accounts, or servers.

## Who is it for?

- **Learners** working through long tutorials who want lesson-by-lesson progress.
- **Teachers / curators** who want to repackage a YouTube video as a course.
- **Anyone** who prefers focused, resumable segments over scrubbing a 3-hour video.

## How it works

1. **Add a video** — paste any YouTube URL (`watch`, `youtu.be`, Shorts, embed,
   `/live/`) or a raw 11-character video ID on the **Add video** page (`/add`).
2. **Auto-fetch chapters** — with a free YouTube Data API v3 key (set in
   **Settings**, full tutorial included in the app), Chapterly fetches the title,
   thumbnail, and description, then parses every timestamp into lessons.
   No key or no timestamps? Enable **manual mode** and paste the chapter list
   yourself, one per line (`00:00 Intro`).
3. **Learn lesson by lesson** — the course player (`/course/[id]`) shows lessons
   in a sidebar and plays just that segment. Scrub freely with the custom
   seekbar (chapter ticks + hover preview) or the ±10s buttons; the sidebar
   highlight follows you.
4. **Track & resume** — check off lessons, edit / reorder / retime them, change
   speed from 0.25x to 2x, toggle subtitles, toggle auto-advance. Everything
   persists in `localStorage`, so you resume exactly where you left off.
5. **Organize** — search and drag-to-reorder courses on the **Library** page
   (`/library`); the order is saved instantly.

> Lessons are *virtual* segments (seek + auto-stop via the YouTube IFrame API),
> not re-encoded clips — that's what makes a backend unnecessary.

## Features

- 🔗 Accepts all common YouTube URL shapes + raw IDs, with validation.
- 📥 Auto-fetch title, thumbnail, description, duration via YouTube Data API v3.
- ✍️ Manual chapter paste mode (works with zero API setup).
- 🧠 Tolerant timestamp parser: `00:00 Intro`, `05:12 - Setup`,
  `(1:02:03) Deep dive`, `Intro - 00:00`; sorts + dedupes by start time.
- ⚠️ Chapter warnings (fewer than 3 chapters, first chapter not at `00:00`).
- ▶️ Segment playback with chapter-end enforcement + optional auto-advance.
- 🎛️ Custom player chrome (YouTube's native controls are hidden): play/pause,
  ±10s nudge, prev/next chapter, volume + mute, time display, fullscreen,
  auto-hiding controls, click-and-drag scrubbing.
- 🎞️ Chapter-segmented seekbar with divider ticks, hover tooltip (time +
  chapter name + thumbnail preview), and a chapters jump menu.
- ⏩ Playback speeds 0.25x–2x (video's real available rates), subtitle
  on/off toggle, YouTube-managed Auto quality (see limits below).
- ⌨️ Keyboard shortcuts: `Space`/`K` play, `J`/`L` ±10s, `←`/`→` ±5s,
  `↑`/`↓` volume, `M` mute, `C` subtitles, `F` fullscreen.
- 🆓 Free scrubbing: the sidebar follows manual seeks instead of fighting them.
- ✅ Progress tracking with auto-complete rules (see below).
- ✏️ Lesson editor: rename, retime, add, delete, reorder.
- 📚 Library with search (title, lesson name, video ID) and drag-to-reorder.
- 🌗 Light / dark / system theming, responsive layout, collapsible sidebar.
- 🔒 100% client-side: no database, no auth, no tracking.

### Progress / auto-complete rules

Managed in `use-course-player.ts`:

| Action | Behavior |
| ------ | -------- |
| Natural playback crosses chapter end | Current lesson marked done; auto-advances (or pauses if auto-advance is off) |
| **Next →** button | Marks current + all lessons before the target done, then advances |
| **Prev** button | Navigates only, never marks |
| Click a **later** lesson in sidebar | Marks all skipped lessons before it done |
| Click an **earlier** lesson | Leaves completion untouched |
| Scrub **forward** to a later chapter | Marks all chapters before that time done |
| Scrub **backward** | Leaves completion untouched |

Manual toggle (`Mark done` / `✓ Done`, or the per-lesson checkbox) can always
override the automatic state.

## Custom player

The course page renders its own player chrome over the YouTube embed
(`components/VideoPlayer.tsx`, state from `components/hooks/use-video-player.ts`).
YouTube's native controls are hidden (`controls: 0, disablekb: 1, fs: 0`), so
everything below is our UI driving the IFrame API:

| Control | How it works |
| ------- | ------------ |
| Play / pause | `playVideo()` / `pauseVideo()` — button, center overlay, click-on-video, `Space`/`K` |
| Seekbar | Click-and-drag scrubbing via `seekTo()`; buffered (`getVideoLoadedFraction`) + played progress; divider ticks at each chapter start; `Home`/`←`/`→` keys work when focused |
| Hover preview | Tooltip follows the cursor with timestamp, chapter name, and video thumbnail |
| Speed | Menu of the video's real rates (`getAvailablePlaybackRates`, falls back to 0.25x–2x) via `setPlaybackRate()` |
| Subtitles | Toggle via `loadModule` / `unloadModule("captions")` (`C` key); best-effort, needs caption tracks on the video |
| Quality | **Auto only** — YouTube deprecated `setPlaybackQuality` / `getAvailableQualityLevels`, so manual resolution picks are no-ops; the menu says so instead of faking it |
| Volume | Slider + mute (`getVolume` / `setVolume` / `mute` / `unMute`, `M` key) |
| Chapters | Jump menu + prev/next-chapter buttons + "now playing" chip (click restarts the chapter) |
| Fullscreen | Wrapper `requestFullscreen()` (`F` key); chrome auto-hides after 3 s while playing |

Two honest platform limits (not UI gaps): exact-frame hover images require
YouTube's private signed storyboard spec, which the official API doesn't expose —
so hover shows the video thumbnail plus time/chapter, not the true frame. And
resolution stays on Auto for the reason above. Both would only become "real"
with self-hosted video files (MP4/HLS), not YouTube embeds.

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn (Base UI primitives, neutral theme) |
| Theming | `next-themes` (light / dark / system) |
| Fonts | Inter (UI) + Geist Mono (timestamps/code) via `next/font` |
| Video playback | YouTube IFrame API via a custom `useVideoPlayer` wrapper (free scrub, seek detection, chapter-end enforcement) + rich custom player chrome in `components/VideoPlayer.tsx` (native controls hidden) |
| Video metadata | YouTube Data API v3 (`videos?part=snippet,contentDetails`) |
| Storage | Browser `localStorage` only — courses (+ order), progress, API key, sidebar state |
| Icons | Lucide (`lucide-react`) |
| Drag & drop | `@dnd-kit` sortable (library card reordering) |
| SEO | Per-route metadata, sitemap, robots, OpenGraph image (`lib/site.ts`) |

## Getting started

### Prerequisites

- Node.js 20+ and npm.

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment (optional)

```bash
cp .env.example .env.local
```

You can also skip env entirely and set the key in the app under **Settings** —
it is stored only in `localStorage` and never sent anywhere except YouTube's API.

### Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## YouTube API key setup (2 minutes, free)

Auto-fetch needs a **YouTube Data API v3** key. The app's **Settings** page
(`/settings`) contains a step-by-step tutorial with links; the short version:

1. Create a free Google Cloud project at [Cloud Console](https://console.cloud.google.com).
2. Enable **YouTube Data API v3** in the API Library.
3. Create an **API key** under Credentials (restrict it to YouTube Data API v3).
4. Paste it in **Settings → Save key → Test key**.

Free quota is ~10,000 units/day (≈ 6,000 video lookups). If quota runs out or
you skip the key, **manual mode** on the Add page always works.

## Usage guide

### Adding a course

1. Go to **Add video** (`/add`).
2. Paste a link or ID. Optionally check **"Skip API / paste chapters manually"**.
3. Click **Fetch chapters** (or **Continue** in manual mode).
4. Review/edit the detected chapter list in the textarea, then **Save as course →**.
5. You're taken to the course player; the course also appears in the Library.

### Learning

- Click lessons in the sidebar, or use **Prev / Next**.
- Scrub with the custom seekbar (drag or click; hover shows time + chapter +
  thumbnail) or the **±10s** buttons — the active lesson highlight follows
  the playback position.
- Press `Space`/`K` to play/pause, `J`/`L` for ±10s, `←`/`→` for ±5s,
  `↑`/`↓` for volume, `M` to mute, `C` for subtitles, `F` for fullscreen.
- **Mark done** toggles the current lesson; the footer shows overall `%`.
- Toggle **auto-advance** in the footer: on = jump to next lesson at chapter end,
  off = pause at chapter end.
- Toggle **Edit lessons** to rename/retime/add/delete/reorder lessons.
- Collapse the sidebar for a focused view (state is remembered).

## Project structure

```
app/
  page.tsx                 # landing page (composition only)
  _components/             # landing sections: hero, product-mock, features,
                           # how-it-works, cta-band, faq, footer
  layout.tsx               # root layout (theme, fonts, header)
  library/page.tsx         # course library + search + drag-to-reorder
  add/
    page.tsx               # add-video form (JSX only)
    _hooks/use-add-video.ts  # fetch / manual-parse / save logic
  course/[id]/
    page.tsx               # player page (composition only)
    _hooks/use-course-player.ts  # active lesson, progress, select/go/seek/ended
    _components/           # player-section, lessons-sidebar, course-footer,
                           # course-skeleton, course-not-found
  settings/
    page.tsx               # API key form + key tutorial
    actions-client.ts      # key test helper
components/
  VideoPlayer.tsx          # rich custom player chrome (controls, segmented
                           # seekbar, hover preview, speed/subtitles/fullscreen)
  ChapterSidebar.tsx       # lesson list with active + done states
  ChapterEditor.tsx        # rename / retime / add / delete / reorder lessons
  CourseCard.tsx           # library card with progress bar
  hooks/
    use-video-player.ts    # IFrame wrapper: cueing, seek detection, end detection,
                           # duration/volume/rates/captions mirroring
    use-chapter-editor.ts  # editor state logic
  ui/                      # shadcn primitives (button, card, dialog, input, …)
config/home-page.ts        # all landing-page copy in one place
lib/
  youtube.ts               # ID parsing, timestamp parsing/formatting, API fetch
  storage.ts               # localStorage CRUD for courses / progress / API key
  types.ts                 # Course, Chapter, CourseProgress, VideoMeta
  site.ts                  # site name, URL, SEO keywords
  utils.ts                 # class-name helper
```

### Conventions

- Pages stay lean (JSX + composition); route logic lives in colocated `_hooks/`.
- Shared component logic lives in `components/hooks/`.
- Landing-page copy lives in `config/home-page.ts`.
- UI uses shadcn primitives instead of raw HTML where available.

## Architecture notes

- **Virtual chapters**: one YouTube `<iframe>` per course page. Selecting a
  lesson calls `loadVideoById({ videoId, startSeconds })`; a 250 ms poll watches
  `getCurrentTime()` and fires `onEnded` when playback smoothly crosses
  `endSeconds`. Seeks are detected as time jumps (`> 2 s` between polls) and
  reported via `onSeek` without triggering auto-advance.
- **Custom chrome**: native YouTube controls are hidden (`controls: 0`); the same
  poll additionally mirrors play state, duration, volume/mute, buffered fraction,
  and playback rate into React state for the custom control bar. Captions toggle
  uses the (undocumented) `loadModule` / `unloadModule("captions")` module API.
- **Re-cue guard**: when the active chapter changes, the player re-cues only if
  the current playback position is *outside* the new chapter's bounds — so
  scrub-initiated chapter switches don't restart the video.
- **Client-only persistence**: all state hydrates from `localStorage` in
  `useEffect` (with skeleton fallbacks) to avoid SSR mismatches.

## Data model

```ts
interface Chapter { id: string; title: string; startSeconds: number; endSeconds: number | null }
interface Course {
  id: string; videoId: string; title: string; thumbnail: string;
  description: string; durationSeconds: number | null;
  chapters: Chapter[]; createdAt: number;
}
interface CourseProgress { completedIds: string[]; lastChapterId: string | null; updatedAt: number }
```

`localStorage` keys (see `lib/storage.ts`):

| Key | Contents |
| --- | -------- |
| `yt-course:courses` | `Course[]` in library order |
| `yt-course:progress:<courseId>` | `CourseProgress` per course |
| `yt-course:api-key` | YouTube Data API key |
| `yt-course:sidebar-open` | `"1"` / `"0"` sidebar preference |

## Deployment

Any Node host works (Vercel recommended for Next.js):

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` (and optionally `NEXT_PUBLIC_YOUTUBE_API_KEY`) in
your host's env vars. No database or server-side secrets are needed.

## Notes & limits

- Data lives in `localStorage`, so courses don't sync across browsers/devices.
  Clearing site data deletes courses and progress.
- Embeds require network access to YouTube; ad-blockers can interfere with the
  IFrame API — disable them for the app if the player won't load.
- Private, deleted, or embed-disabled videos can't be played or fetched.
- Player quality is Auto-only and hover previews show the video thumbnail, not
  the exact frame — both are YouTube embed-API limits (see Custom player).
- YouTube chapter guidelines (≥ 3 chapters, first at `00:00`) are surfaced as
  warnings only — fewer/shifted chapters still work in the player.

## Roadmap ideas

- Export / import courses as JSON (backup + sharing).
- Per-lesson notes.
- Global search across all lessons.
- Optional cloud sync (would require a backend).
