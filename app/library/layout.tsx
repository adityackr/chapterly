import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "My courses",
  description:
    "Your personal library of YouTube courses with thumbnails, progress and drag-to-reorder — stored privately in your browser.",
  alternates: { canonical: absoluteUrl("/library") },
  openGraph: {
    title: "My courses | Chapterly",
    description: "Browse, search and reorder your saved YouTube courses.",
    url: absoluteUrl("/library"),
  },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
