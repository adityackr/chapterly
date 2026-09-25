import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Add a video",
  description:
    "Paste any YouTube URL or video ID — Chapterly fetches the title and splits timestamps into lessons, or let you paste chapters manually.",
  alternates: { canonical: absoluteUrl("/add") },
  openGraph: {
    title: "Add a video | Chapterly",
    description: "Paste a YouTube link and turn it into a lesson-by-lesson course.",
    url: absoluteUrl("/add"),
  },
};

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return children;
}
