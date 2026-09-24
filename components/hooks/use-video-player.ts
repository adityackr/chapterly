"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: { onReady?: () => void };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  cueVideoById(opts: { videoId: string; startSeconds?: number }): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  setPlaybackRate(rate: number): void;
  destroy(): void;
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

const PLAYING = 1;
const SEEK_JUMP = 2; // seconds — bigger deltas between polls mean the user scrubbed

export const PLAYBACK_RATES = [1, 1.25, 1.5, 2];

export interface UseVideoPlayerOptions {
  videoId: string;
  startSeconds: number;
  endSeconds: number | null;
  chapterKey: string;
  autoPlay?: boolean;
  /** Pause when playback naturally reaches the chapter end (auto-advance off). */
  pauseAtEnd?: boolean;
  /** Fired when the chapter ends through natural playback (not scrubbing). */
  onEnded?: () => void;
  /** Fired when the user scrubs to a time — parent follows by switching chapters. */
  onSeek?: (seconds: number) => void;
}

/**
 * Free-scrub chapter player logic. The user can seek anywhere with the native
 * YouTube controls (or the ±10s buttons). A chapter only counts as "ended"
 * when playback crosses endSeconds smoothly — manual seeks never trigger
 * auto-advance, they just move the sidebar highlight.
 */
export function useVideoPlayer({
  videoId,
  startSeconds,
  endSeconds,
  chapterKey,
  autoPlay = true,
  pauseAtEnd = false,
  onEnded,
  onSeek,
}: UseVideoPlayerOptions) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);
  const endedFiredFor = useRef<string>("");
  const boundsRef = useRef({ startSeconds, endSeconds });
  const onEndedRef = useRef(onEnded);
  const onSeekRef = useRef(onSeek);
  const pauseAtEndRef = useRef(pauseAtEnd);
  useEffect(() => {
    boundsRef.current = { startSeconds, endSeconds };
    onEndedRef.current = onEnded;
    onSeekRef.current = onSeek;
    pauseAtEndRef.current = pauseAtEnd;
  }, [startSeconds, endSeconds, onEnded, onSeek, pauseAtEnd]);

  const [rateIdx, setRateIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const cueChapter = useCallback(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    endedFiredFor.current = "";
    lastTimeRef.current = startSeconds;
    if (autoPlay) p.loadVideoById({ videoId, startSeconds });
    else p.cueVideoById({ videoId, startSeconds });
    setIsPlaying(autoPlay);
  }, [videoId, startSeconds, autoPlay]);

  // Init player once (no endSeconds passed — we enforce it ourselves so scrubbing stays free)
  useEffect(() => {
    let cancelled = false;
    let player: YTPlayer | null = null;
    loadYouTubeAPI().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      player = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { rel: 0, autoplay: autoPlay ? 1 : 0, start: startSeconds },
        events: {
          onReady: () => {
            readyRef.current = true;
            try {
              player?.setPlaybackRate(1);
            } catch {
              /* noop */
            }
            cueChapter();
          },
        },
      });
      playerRef.current = player;
    });
    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      readyRef.current = false;
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-cue when the selected chapter changes — UNLESS the player is already
  // inside the new chapter's bounds (i.e. the change came from the user
  // scrubbing, which we must not override).
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    let t: number | null = null;
    try {
      t = p.getCurrentTime();
    } catch {
      /* noop */
    }
    if (
      t != null &&
      t >= startSeconds - 1 &&
      (endSeconds == null || t < endSeconds + 1)
    ) {
      lastTimeRef.current = t;
      return;
    }
    cueChapter();
  }, [chapterKey, startSeconds, endSeconds, cueChapter]);

  // Unified poll: play-state mirror, seek detection, natural chapter-end detection
  useEffect(() => {
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p || !readyRef.current) return;
      let t: number;
      let state: number;
      try {
        t = p.getCurrentTime();
        state = p.getPlayerState();
      } catch {
        return;
      }
      setIsPlaying(state === PLAYING);
      const last = lastTimeRef.current;
      const { endSeconds: end } = boundsRef.current;

      if (last != null && Math.abs(t - last) > SEEK_JUMP) {
        // User scrubbed — follow them, never auto-advance.
        lastTimeRef.current = t;
        endedFiredFor.current = "";
        onSeekRef.current?.(t);
        return;
      }
      if (
        end != null &&
        state === PLAYING &&
        last != null &&
        last < end - 0.15 &&
        t >= end - 0.15 &&
        endedFiredFor.current !== chapterKey
      ) {
        endedFiredFor.current = chapterKey;
        if (pauseAtEndRef.current) {
          try {
            p.pauseVideo();
          } catch {
            /* noop */
          }
        }
        onEndedRef.current?.();
      }
      lastTimeRef.current = t;
    }, 250);
    return () => clearInterval(id);
  }, [chapterKey]);

  function nudge(by: number) {
    const p = playerRef.current;
    if (!p) return;
    try {
      const t = Math.max(0, p.getCurrentTime() + by);
      p.seekTo(t, true);
    } catch {
      /* noop */
    }
  }

  function togglePlay() {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) p.pauseVideo();
      else p.playVideo();
    } catch {
      /* noop */
    }
  }

  function cycleRate() {
    const next = (rateIdx + 1) % PLAYBACK_RATES.length;
    setRateIdx(next);
    try {
      playerRef.current?.setPlaybackRate(PLAYBACK_RATES[next]);
    } catch {
      /* noop */
    }
  }

  return { mountRef, isPlaying, rateIdx, nudge, togglePlay, cycleRate };
}
