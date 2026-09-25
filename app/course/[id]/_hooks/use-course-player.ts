"use client";
/* eslint-disable react-hooks/set-state-in-effect -- client-only localStorage hydration on mount */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Course } from "@/lib/types";
import { getCourse, getProgress, saveCourse, setProgress } from "@/lib/storage";

const SIDEBAR_KEY = "yt-course:sidebar-open";

export function useCoursePlayer() {
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [editing, setEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(SIDEBAR_KEY) !== "0";
  });

  function toggleSidebar() {
    setSidebarOpen((v) => {
      localStorage.setItem(SIDEBAR_KEY, v ? "0" : "1");
      return !v;
    });
  }

  useEffect(() => {
    const c = getCourse(params.id);
    setCourse(c);
    if (c) {
      const p = getProgress(c.id);
      setCompletedIds(p.completedIds);
      setActiveId(p.lastChapterId ?? c.chapters[0]?.id ?? null);
    }
    setLoaded(true);
  }, [params.id]);

  const activeIndex = useMemo(
    () => course?.chapters.findIndex((c) => c.id === activeId) ?? -1,
    [course, activeId]
  );
  const active = activeIndex >= 0 ? course!.chapters[activeIndex] : null;
  const pct =
    !course || course.chapters.length === 0
      ? 0
      : Math.round((completedIds.length / course.chapters.length) * 100);

  function persistProgress(nextCompleted: string[], nextActive: string | null) {
    if (!course) return;
    setProgress(course.id, { completedIds: nextCompleted, lastChapterId: nextActive, updatedAt: Date.now() });
  }

  function completeThrough(targetIdx: number, base: string[]) {
    if (!course || targetIdx <= 0) return base;
    const idsToAdd = course.chapters.slice(0, targetIdx).map((c) => c.id);
    const set = new Set(base);
    for (const id of idsToAdd) set.add(id);
    return [...set];
  }

  function select(id: string) {
    if (!course) return;
    const currentIdx = course.chapters.findIndex((c) => c.id === activeId);
    const targetIdx = course.chapters.findIndex((c) => c.id === id);
    if (targetIdx < 0) return;
    // Forward jump: auto-complete the chapter(s) being skipped.
    // Backward jumps leave completion untouched.
    let nextCompleted = completedIds;
    if (currentIdx >= 0 ? targetIdx > currentIdx : targetIdx > 0) {
      nextCompleted = completeThrough(targetIdx, completedIds);
      setCompletedIds(nextCompleted);
    }
    setActiveId(id);
    persistProgress(nextCompleted, id);
  }

  function toggleComplete(id: string) {
    const next = completedIds.includes(id)
      ? completedIds.filter((x) => x !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    persistProgress(next, activeId);
  }

  function go(dir: -1 | 1) {
    if (!course) return;
    const j = activeIndex + dir;
    if (j < 0 || j >= course.chapters.length) return;
    if (dir === 1) {
      // Next button: auto-complete current + everything before the target.
      const nextCompleted = completeThrough(j, completedIds);
      setCompletedIds(nextCompleted);
      setActiveId(course.chapters[j].id);
      persistProgress(nextCompleted, course.chapters[j].id);
      return;
    }
    // Prev button: just navigate, never auto-complete.
    setActiveId(course.chapters[j].id);
    persistProgress(completedIds, course.chapters[j].id);
  }

  function handleSeek(t: number) {
    if (!course) return;
    // Follow the user: highlight whichever chapter contains the scrubbed-to time.
    let idx = 0;
    course.chapters.forEach((c, i) => {
      if (t >= c.startSeconds - 0.5) idx = i;
    });
    const target = course.chapters[idx];
    if (target && target.id !== activeId) {
      // Forward scrub: auto-complete all chapters before the scrubbed-to time.
      // Backward scrub leaves completion untouched.
      let nextCompleted = completedIds;
      if (idx > activeIndex) {
        nextCompleted = completeThrough(idx, completedIds);
        setCompletedIds(nextCompleted);
      }
      setActiveId(target.id);
      persistProgress(nextCompleted, target.id);
    }
  }

  function handleEnded() {
    if (!course || activeIndex < 0) return;
    // mark current complete on natural end
    const id = course.chapters[activeIndex].id;
    const nextCompleted = completedIds.includes(id) ? completedIds : [...completedIds, id];
    setCompletedIds(nextCompleted);
    const next = course.chapters[activeIndex + 1];
    if (next && autoAdvance) {
      setActiveId(next.id);
      persistProgress(nextCompleted, next.id);
    } else {
      persistProgress(nextCompleted, activeId);
    }
  }

  function handleChaptersChange(next: Course["chapters"]) {
    if (!course) return;
    const updated = { ...course, chapters: next };
    setCourse(updated);
    saveCourse(updated);
    if (activeId && !next.find((c) => c.id === activeId)) {
      setActiveId(next[0]?.id ?? null);
    }
  }

  return {
    course,
    loaded,
    activeId,
    activeIndex,
    active,
    pct,
    completedIds,
    autoAdvance,
    setAutoAdvance,
    editing,
    setEditing,
    sidebarOpen,
    toggleSidebar,
    select,
    toggleComplete,
    go,
    handleSeek,
    handleEnded,
    handleChaptersChange,
  };
}
