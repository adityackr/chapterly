import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl p-8 text-center">
      <h1 className="text-xl font-semibold">Course not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        It may have been deleted.
      </p>
      <Button nativeButton={false} render={<Link href="/library" />} className="mt-4">
        Back to library
      </Button>
    </main>
  );
}
