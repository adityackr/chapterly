import type { Metadata } from "next";

// Courses live in the visitor's localStorage — private per-browser pages
// that should never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
