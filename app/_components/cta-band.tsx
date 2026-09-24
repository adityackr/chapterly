import Link from "next/link";
import { Clock3, LibraryBig, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-center text-white sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_100%,oklch(0.55_0.22_295/0.4),transparent_70%)]"
        />
        <div className="relative">
          <Badge className="bg-white/10 text-white hover:bg-white/10">
            <Clock3 className="size-3.5" /> Stop scrubbing. Start learning.
          </Badge>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance text-stone-200 sm:text-4xl">
            That 3-hour tutorial you keep postponing? It&apos;s 12 small lessons.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Join learners turning video chaos into structured courses. Free forever, private by design.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/add" />} className="w-full bg-violet-600 text-white hover:bg-violet-500 sm:w-auto">
              <Play className="size-4" /> Create your first course
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/library" />} className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto">
              <LibraryBig className="size-4" /> Open my library
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
