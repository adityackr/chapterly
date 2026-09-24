"use client";

import type { Chapter } from "@/lib/types";
import { formatTimestamp } from "@/lib/youtube";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  chapters: Chapter[];
  activeId: string | null;
  completedIds: string[];
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function ChapterSidebar({
  chapters,
  activeId,
  completedIds,
  onSelect,
  onToggleComplete,
}: Props) {
  return (
    <ol className="divide-y">
      {chapters.map((c, i) => {
        const active = c.id === activeId;
        const done = completedIds.includes(c.id);
        return (
          <li key={c.id} className={active ? "bg-muted" : ""}>
            <div className="flex items-start gap-2 px-3 py-2.5">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => onToggleComplete(c.id)}
                aria-label={done ? `Mark "${c.title}" incomplete` : `Mark "${c.title}" complete`}
                title={done ? "Mark incomplete" : "Mark complete"}
                className={`mt-0.5 size-5 rounded-full p-0 ${
                  done
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-600 hover:text-white dark:border-green-600 dark:bg-green-600 dark:text-white dark:hover:bg-green-600 dark:hover:text-white"
                    : "text-transparent"
                }`}
              >
                <Check className="size-3" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onSelect(c.id)}
                className="h-auto min-w-0 flex-1 justify-start px-1 py-0.5 text-left font-normal"
              >
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <Badge variant="secondary" className="shrink-0 font-mono">
                      {formatTimestamp(c.startSeconds)}
                    </Badge>
                    <span className={`truncate text-sm ${active ? "font-semibold" : ""} ${done ? "text-muted-foreground line-through" : ""}`}>
                      {i + 1}. {c.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block pl-1 font-mono text-xs text-muted-foreground">
                    {c.endSeconds != null
                      ? `${formatTimestamp(c.endSeconds)} • ${Math.max(1, Math.round(c.endSeconds - c.startSeconds))}s`
                      : "until end"}
                  </span>
                </span>
              </Button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
