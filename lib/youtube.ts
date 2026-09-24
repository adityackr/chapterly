import type { Chapter, VideoMeta } from "./types";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Extract an 11-char YouTube video ID from a URL or raw ID. Returns null if invalid. */
export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

  // Try URL parsing (handles watch?v=, youtu.be, /embed/, /shorts/, /live/, /v/)
  try {
    const url = new URL(s.includes("://") ? s : `https://${s}`);
    const host = url.hostname.replace(/^www\.|^m\.|^music\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split(/[?#/]/)[0];
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      for (const prefix of ["/embed/", "/shorts/", "/live/", "/v/"]) {
        if (url.pathname.startsWith(prefix)) {
          const id = url.pathname.slice(prefix.length).split(/[?#/]/)[0];
          if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
        }
      }
    }
  } catch {
    // not a URL — fall through to regex search
  }

  const m = s.match(/[A-Za-z0-9_-]{11}/);
  // Only accept bare-regex hit if the whole string looks like URL-ish context
  // to avoid false positives; prefer explicit parse above.
  if (m && (s.includes("youtube") || s.includes("youtu.be"))) return m[0];
  return null;
}

export function toSeconds(h: string | undefined, m: string, sec: string): number {
  const hours = h ? parseInt(h, 10) : 0;
  return hours * 3600 + parseInt(m, 10) * 60 + parseInt(sec, 10);
}

export function formatTimestamp(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** True if a line looks like a chapter/timestamp entry (e.g. "00:00 Intro"). */
export function isChapterLine(raw: string): boolean {
  const line = raw.trim().replace(/^[(<[]+/, "");
  if (!line) return false;
  const m =
    line.match(/^(?:(\d+):)?([0-5]?\d):([0-5]\d)\b\s*[-–—:|.)\]]?\s*(.+?)\s*$/) ??
    line.match(/^(.+?)\s+[-–—:|]\s*(?:(\d+):)?([0-5]?\d):([0-5]\d)\s*$/);
  if (!m) return false;
  const title = (m.length === 5 ? m[4] : m[1] ?? "").replace(/^[-–—:|.)\]]+\s*/, "").trim();
  return title.length > 0;
}

/** Description with chapter/timestamp lines removed, blank runs collapsed. */
export function stripTimestampLines(description: string): string {
  const kept = description
    .split("\n")
    .filter((line) => line.trim() !== "" && !isChapterLine(line));
  // collapse 3+ consecutive blanks (already removed) — join and trim
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Parse YouTube-style chapters from a description / pasted list.
 * Accepts lines like: "00:00 Intro", "05:12 - Setup", "(1:02:03) Deep dive".
 */
export function parseChapters(text: string, videoDuration: number | null = null): Chapter[] {
  const lines = text.split("\n");
  const found: { start: number; title: string }[] = [];

  for (const raw of lines) {
    const line = raw.trim().replace(/^[(<[]+/, "");
    if (!line) continue;
    // timestamp at start of line
    const m =
      line.match(/^(?:(\d+):)?([0-5]?\d):([0-5]\d)\b\s*[-–—:|.)\]]?\s*(.+?)\s*$/) ??
      line.match(/^(.+?)\s+[-–—:|]\s*(?:(\d+):)?([0-5]?\d):([0-5]\d)\s*$/);
    if (!m) continue;

    let start: number;
    let title: string;
    if (m.length === 5) {
      start = toSeconds(m[1], m[2], m[3]);
      title = m[4].trim();
    } else {
      // timestamp at end: "Intro - 00:00"
      start = toSeconds(m[3], m[4], m[5]);
      title = (m[1] ?? "").trim();
    }
    title = title.replace(/^[-–—:|.)\]]+\s*/, "").trim();
    if (!title) continue;
    found.push({ start, title });
  }

  // sort, dedupe by start (keep first)
  found.sort((a, b) => a.start - b.start);
  const deduped = found.filter((c, i) => i === 0 || c.start !== found[i - 1].start);
  if (deduped.length === 0) return [];

  return deduped.map((c, i) => ({
    id: newId(),
    title: c.title,
    startSeconds: c.start,
    endSeconds:
      i < deduped.length - 1
        ? deduped[i + 1].start
        : videoDuration && videoDuration > c.start
          ? videoDuration
          : null,
  }));
}

/** YouTube chapter guidelines: >=3 chapters, first starts at 0. We warn but still allow fewer. */
export function chapterWarnings(chapters: Chapter[]): string[] {
  const warnings: string[] = [];
  if (chapters.length === 0) return ["No timestamps found."];
  if (chapters.length < 3)
    warnings.push("YouTube recommends at least 3 chapters — fewer still work in this player.");
  if (chapters[0].startSeconds !== 0)
    warnings.push("First chapter doesn't start at 00:00 — consider adding a 00:00 intro chapter.");
  return warnings;
}

function parseIso8601Duration(iso: string): number | null {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const s = m[3] ? parseInt(m[3], 10) : 0;
  const total = h * 3600 + min * 60 + s;
  return total > 0 ? total : null;
}

export async function fetchVideoMeta(videoId: string, apiKey: string): Promise<VideoMeta> {
  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}` +
    `&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 400) throw new Error("Invalid request — check the video ID and API key.");
    if (res.status === 403)
      throw new Error("API key rejected or quota exceeded (403). Check key or try manual paste.");
    throw new Error(`YouTube API error (${res.status}). Try manual paste instead.`);
  }
  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) throw new Error("Video not found. Check the link/ID (it may be private or deleted).");
  const thumbs = item.snippet?.thumbnails;
  return {
    title: item.snippet?.title ?? videoId,
    description: item.snippet?.description ?? "",
    thumbnail:
      thumbs?.maxres?.url ?? thumbs?.standard?.url ?? thumbs?.high?.url ?? thumbs?.medium?.url ?? "",
    durationSeconds: item.contentDetails?.duration
      ? parseIso8601Duration(item.contentDetails.duration)
      : null,
  };
}
