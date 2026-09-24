"use client";

import Image from "next/image";
import Link from "next/link";
import { ListVideo, Play, Trash2 } from "lucide-react";
import type { Course } from "@/lib/types";
import { getProgress } from "@/lib/storage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CourseCard({ course, onDelete }: { course: Course; onDelete: () => void }) {
  const progress = typeof window !== "undefined" ? getProgress(course.id) : null;
  const done = progress?.completedIds.length ?? 0;
  const pct =
    course.chapters.length === 0 ? 0 : Math.round((done / course.chapters.length) * 100);

  return (
    <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <Link href={`/course/${course.id}`} className="group relative block">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            width={480}
            height={270}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted text-3xl">
            🎬
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <span className="flex size-12 scale-90 items-center justify-center rounded-full bg-violet-600 text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
            <Play className="size-5 fill-white" />
          </span>
        </span>
        <Badge className="absolute top-2 left-2 bg-black/70 text-white hover:bg-black/70">
          <ListVideo className="size-3" /> {course.chapters.length} lessons
        </Badge>
      </Link>
      <CardHeader className="px-4 pt-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={`/course/${course.id}`}
                className="block rounded outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <CardTitle className="line-clamp-1 text-sm leading-snug font-medium hover:underline">
                  {course.title}
                </CardTitle>
              </Link>
            }
          />
          <TooltipContent side="top" className="max-w-xs">
            {course.title}
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="px-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {done}/{course.chapters.length} done
          </span>
          <span className="font-medium">{pct}%</span>
        </div>
        <Progress value={pct} className="[&>div]:bg-green-600 mb-2" />
      </CardContent>
      <CardFooter className="mt-auto flex justify-end px-4 pb-3">
        <AlertDialog>
          <AlertDialogTrigger
            data-slot="button"
            className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-xs font-medium  transition-all outline-none select-none hover:text-destructive focus-visible:ring-3 [&_svg]:size-3.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 focus-visible:ring-red-400"
          >
            <Trash2 className="size-3.5" /> Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                “{course.title}” and its progress will be permanently removed from this browser.
                This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-white hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
