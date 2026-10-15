"use client";

import { ListVideo, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { PLAYBACK_RATES, useVideoPlayer, type UseVideoPlayerOptions } from "./hooks/use-video-player";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/lib/types";
import { formatTimestamp } from "@/lib/youtube";

type Props = UseVideoPlayerOptions & {
  /** All course chapters — shows a floating "now playing" chapter chip on the video. */
  chapters?: Chapter[];
};

/** Which chapter contains absolute video time `t` (last start at or before `t`). */
function chapterAtTime(chapters: Chapter[], t: number): { chapter: Chapter; index: number } | null {
  if (chapters.length === 0) return null;
  let idx = 0;
  chapters.forEach((c, i) => {
    if (t >= c.startSeconds - 0.5) idx = i;
  });
  return { chapter: chapters[idx], index: idx };
}

/**
 * Free-scrub chapter player. The user can seek anywhere with the native
 * YouTube controls (or the ±10s buttons). We only treat a chapter as
 * "ended" when playback crosses endSeconds smoothly — manual seeks never
 * trigger auto-advance, they just move the sidebar highlight.
 */
export default function VideoPlayer(props: Props) {
  const { chapters, ...playerOpts } = props;
  const { mountRef, isPlaying, rateIdx, currentTime, nudge, seekTo, togglePlay, cycleRate } =
    useVideoPlayer(playerOpts);
  const current = chapters ? chapterAtTime(chapters, currentTime) : null;

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <div ref={mountRef} className="h-full w-full" />
        {current && (
          <button
            key={current.chapter.id}
            type="button"
            onClick={() => seekTo(current.chapter.startSeconds)}
            title={`Restart chapter "${current.chapter.title}"`}
            aria-label={`Now playing: ${current.chapter.title}. Activate to restart the chapter.`}
            className="absolute top-3 left-3 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 truncate rounded-full bg-black/70 py-1 pr-3 pl-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/85"
          >
            <ListVideo className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {current.index + 1}. {current.chapter.title}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-white/70 tabular-nums">
              {formatTimestamp(current.chapter.startSeconds)}
            </span>
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => nudge(-10)} title="Back 10 seconds">
          <RotateCcw /> 10s
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
          className="rounded-full"
        >
          {isPlaying ? <Pause /> : <Play className="fill-current" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => nudge(10)} title="Forward 10 seconds">
          <RotateCw /> 10s
        </Button>
        <Button variant="outline" size="sm" onClick={cycleRate} title="Playback speed" className="font-mono">
          {PLAYBACK_RATES[rateIdx]}x
        </Button>
      </div>
    </div>
  );
}
