"use client";
/* eslint-disable react-hooks/set-state-in-effect -- client-only localStorage hydration on mount */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GripVertical, LibraryBig, Plus, Search, SearchX, X } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Course } from "@/lib/types";
import { deleteCourse, getCourses, saveCourses } from "@/lib/storage";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function SortableCourseCard({
  course,
  disabled,
  onDelete,
}: {
  course: Course;
  disabled: boolean;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: course.id,
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
        zIndex: isDragging ? 10 : undefined,
      }}
      className="group relative"
    >
      <CourseCard course={course} onDelete={onDelete} />
      {!disabled && (
        <button
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder “${course.title}”`}
          title="Drag to reorder"
          className="absolute top-2 right-2 flex size-7 cursor-grab items-center justify-center rounded-md bg-black/70 text-white transition-opacity touch-none active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
        >
          <GripVertical className="size-4" />
        </button>
      )}
    </div>
  );
}

export default function LibraryPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    setCourses(getCourses());
    setLoaded(true);
  }, []);

  const searching = query.trim() !== "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.videoId.toLowerCase().includes(q) ||
        c.chapters.some((ch) => ch.title.toLowerCase().includes(q))
    );
  }, [courses, query]);

  function handleDelete(id: string) {
    deleteCourse(id);
    setCourses(getCourses());
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setCourses((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      saveCourses(next);
      return next;
    });
  }

  if (!loaded)
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-8 w-full sm:w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-4">
      {courses.length === 0 ? (
        <Card className="mx-auto mt-16 max-w-md border-dashed text-center">
          <CardHeader className="items-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-700 dark:text-violet-300">
              <LibraryBig className="size-6" />
            </span>
            <CardTitle className="mt-2">No courses yet</CardTitle>
            <CardDescription>
              Paste a YouTube link and we&apos;ll split it into lessons using its timestamps.
            </CardDescription>
            <Button nativeButton={false} render={<Link href="/add" />} className="mt-2 bg-violet-600 text-white hover:bg-violet-500">
              <Plus className="size-4" /> Add your first video
            </Button>
            <p className="text-xs text-muted-foreground">
              You&apos;ll need a YouTube Data API key — set it in Settings (free tier is plenty).
            </p>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">My courses ({courses.length})</h1>
              {!searching && courses.length > 1 && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <GripVertical className="size-3" /> Drag the handle on a card to reorder
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, lesson, ID…"
                className="pr-8 pl-9"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X />
                </Button>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchX />
                </EmptyMedia>
                <EmptyTitle>No courses match “{query.trim()}”</EmptyTitle>
                <EmptyDescription>
                  Try a different keyword — search covers titles, lesson names and video IDs.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filtered.map((c) => c.id)} strategy={rectSortingStrategy}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((c) => (
                    <SortableCourseCard
                      key={c.id}
                      course={c}
                      disabled={searching}
                      onDelete={() => handleDelete(c.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}
    </main>
  );
}
