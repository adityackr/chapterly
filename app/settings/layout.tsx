import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Connect your free YouTube Data API v3 key in ~2 minutes. Your key stays in this browser's localStorage and never touches a server.",
  alternates: { canonical: absoluteUrl("/settings") },
  openGraph: {
    title: "Settings | Chapterly",
    description: "Set your free YouTube API key with a step-by-step guide.",
    url: absoluteUrl("/settings"),
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
