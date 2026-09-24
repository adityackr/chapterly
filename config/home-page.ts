import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  LibraryBig,
  Link2,
  ListVideo,
  Lock,
  Pencil,
  Scissors,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export interface MockLesson {
  time: string;
  title: string;
  done: boolean;
  active?: boolean;
}

export interface Feature {
  icon: LucideIcon;
  tint: string;
  title: string;
  desc: string;
}

export interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Faq {
  q: string;
  a: string;
}

export const MOCK_LESSONS: MockLesson[] = [
  { time: "00:00", title: "Intro & roadmap", done: true },
  { time: "05:12", title: "Setup & installation", done: true },
  { time: "12:40", title: "Live demo build", done: false, active: true },
  { time: "28:05", title: "Deploy to production", done: false },
];

export const FEATURES: Feature[] = [
  {
    icon: ListVideo,
    tint: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    title: "Auto chapter detection",
    desc: "Paste a link and we fetch the description via the YouTube Data API, parsing every timestamp into lessons automatically.",
  },
  {
    icon: Scissors,
    tint: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    title: "Segment playback",
    desc: "Each lesson plays only its slice — the player seeks to the start timestamp and stops exactly at the next one.",
  },
  {
    icon: TrendingUp,
    tint: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    title: "Progress tracking",
    desc: "Check off lessons, see completion bars per course, and resume exactly where you left off — even after a restart.",
  },
  {
    icon: Pencil,
    tint: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    title: "Editable lessons",
    desc: "Rename titles, fix timings, reorder or delete chapters. Your course, your curriculum.",
  },
  {
    icon: LibraryBig,
    tint: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    title: "Multi-course library",
    desc: "Save as many videos as you want. Every course lives in your personal library with thumbnails and progress.",
  },
  {
    icon: Lock,
    tint: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    title: "Private by design",
    desc: "No accounts, no servers, no tracking. Everything is stored in your browser's localStorage. Your API key never leaves your machine.",
  },
];

export const STEPS: Step[] = [
  {
    n: "01",
    icon: Link2,
    title: "Paste a link",
    desc: "Any YouTube URL works — watch links, youtu.be short links, Shorts, embeds, even a raw video ID.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "We split the chapters",
    desc: "Title, thumbnail and timestamps are fetched and parsed into a lesson plan in seconds. No chapters? Paste them manually.",
  },
  {
    n: "03",
    icon: GraduationCap,
    title: "Learn lesson by lesson",
    desc: "Work through trimmed segments from the sidebar with auto-advance, completion tracking and resume.",
  },
];

export const FORMATS: string[] = [
  "youtube.com/watch",
  "youtu.be/…",
  "/shorts/…",
  "/embed/…",
  "raw video ID",
];

export const FAQS: Faq[] = [
  {
    q: "Do I need a YouTube API key?",
    a: "Only for auto-fetching titles and descriptions. It's free from Google Cloud Console (generous free quota), takes two minutes to create, and is stored only in your browser. No key? Use manual mode — paste the video link plus its chapter list and everything else works identically.",
  },
  {
    q: "Is it really free? What's the catch?",
    a: "Yes — there is no backend, no account system and nothing to pay for. The only quota involved is Google's free YouTube API tier, which covers thousands of video lookups per day.",
  },
  {
    q: "Where is my data stored?",
    a: "Exclusively in your browser's localStorage: your courses, lesson edits and progress. Nothing is uploaded anywhere. The trade-off: courses don't sync between devices or browsers (yet).",
  },
  {
    q: "Does it download or re-encode the video?",
    a: "No. Lessons are virtual segments — the embedded player seeks to each chapter's start timestamp and stops at the next one. This keeps the app server-free and respects YouTube's terms.",
  },
  {
    q: "What if a video has no timestamps?",
    a: "You'll get a friendly nudge plus a manual editor: paste the chapter list (00:00 Intro, one per line) and the course builds the same way. You can also create lessons from scratch.",
  },
];
