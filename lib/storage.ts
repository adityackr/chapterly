import type { Course, CourseProgress } from "./types";

const COURSES_KEY = "yt-course:courses";
const PROGRESS_PREFIX = "yt-course:progress:";
const API_KEY = "yt-course:api-key";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getCourses(): Course[] {
  if (typeof window === "undefined") return [];
  return safeParse<Course[]>(localStorage.getItem(COURSES_KEY), []);
}

export function getCourse(id: string): Course | null {
  return getCourses().find((c) => c.id === id) ?? null;
}

export function saveCourses(courses: Course[]): void {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function saveCourse(course: Course): void {
  const courses = getCourses();
  const i = courses.findIndex((c) => c.id === course.id);
  if (i >= 0) courses[i] = course;
  else courses.unshift(course);
  saveCourses(courses);
}

export function deleteCourse(id: string): void {
  const courses = getCourses().filter((c) => c.id !== id);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  localStorage.removeItem(PROGRESS_PREFIX + id);
}

export function getProgress(courseId: string): CourseProgress {
  if (typeof window === "undefined")
    return { completedIds: [], lastChapterId: null, updatedAt: 0 };
  return safeParse<CourseProgress>(localStorage.getItem(PROGRESS_PREFIX + courseId), {
    completedIds: [],
    lastChapterId: null,
    updatedAt: 0,
  });
}

export function setProgress(courseId: string, progress: CourseProgress): void {
  localStorage.setItem(
    PROGRESS_PREFIX + courseId,
    JSON.stringify({ ...progress, updatedAt: Date.now() })
  );
}

export function getApiKey(): string {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "";
  return (
    localStorage.getItem(API_KEY) ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? ""
  ).trim();
}

export function setApiKey(key: string): void {
  if (key.trim()) localStorage.setItem(API_KEY, key.trim());
  else localStorage.removeItem(API_KEY);
}
