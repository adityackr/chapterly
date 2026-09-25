export const siteConfig = {
  name: "Chapterly",
  tagline: "Turn YouTube videos into courses",
  description:
    "Paste a YouTube link and Chapterly splits it by timestamps into bite-size lessons with a course sidebar, trimmed playback, progress tracking and resume — free, private, no backend.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://chapterly.app"
  ).replace(/\/$/, ""),
  locale: "en_US",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  keywords: [
    "YouTube to course",
    "YouTube chapters",
    "video timestamps to lessons",
    "YouTube course maker",
    "learn from YouTube",
    "video lesson planner",
    "YouTube Data API",
  ],
  author: "Chapterly",
  twitterHandle: "@chapterly",
} as const;

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
