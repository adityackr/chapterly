"use client";

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { PLAYBACK_RATES, useVideoPlayer, type UseVideoPlayerOptions } from "./hooks/use-video-player";
import { Button } from "@/components/ui/button";

type Props = UseVideoPlayerOptions;

/**
 * Free-scrub chapter player. The user can seek anywhere with the native
 * YouTube controls (or the ±10s buttons). We only treat a chapter as
 * "ended" when playback crosses endSeconds smoothly — manual seeks never
 * trigger auto-advance, they just move the sidebar highlight.
 */
export default function VideoPlayer(props: Props) {
  const { mountRef, isPlaying, rateIdx, nudge, togglePlay, cycleRate } = useVideoPlayer(props);

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <div ref={mountRef} className="h-full w-full" />
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
