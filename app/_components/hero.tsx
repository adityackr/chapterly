import Link from "next/link";
import {
  ArrowRight,
  Infinity as InfinityIcon,
  KeyRound,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.55_0.22_295/0.14),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0_0_0/0.04)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-10 text-center sm:pt-24">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <Sparkles className="size-3.5 text-violet-600" />
          Free · No backend · 100% private
        </Badge>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Turn any YouTube video into a{" "}
          <span className="bg-linear-to-r from-violet-600 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
            proper course
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Paste a link. We split the video by its timestamps into bite-size lessons with a
          course-style sidebar, trimmed playback, progress tracking and resume — all stored
          safely in your browser.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<Link href="/add" />} className="w-full bg-violet-600 text-white hover:bg-violet-500 sm:w-auto">
            <Play className="size-4" /> Start learning free
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/#how" />} className="w-full sm:w-auto">
            See how it works <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-green-600" /> Data never leaves your browser
          </span>
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="size-4 text-amber-600" /> Your API key, your control
          </span>
          <span className="inline-flex items-center gap-1.5">
            <InfinityIcon className="size-4 text-sky-600" /> Unlimited courses & lessons
          </span>
        </div>
      </div>
    </section>
  );
}
