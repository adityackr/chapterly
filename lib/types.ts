export interface Chapter {
  id: string;
  title: string;
  startSeconds: number;
  endSeconds: number | null; // null = until end of video
}

export interface Course {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  description: string;
  durationSeconds: number | null;
  chapters: Chapter[];
  createdAt: number;
}

export interface CourseProgress {
  completedIds: string[];
  lastChapterId: string | null;
  updatedAt: number;
  /** Per-chapter resume positions: chapterId -> absolute video time in seconds. */
  positions?: Record<string, number>;
}

export interface VideoMeta {
  title: string;
  description: string;
  thumbnail: string;
  durationSeconds: number | null;
}
