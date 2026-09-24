import { Check, MonitorPlay, Play, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FORMATS, MOCK_LESSONS } from "@/config/home-page";

export default function ProductMock() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-4">
      <div aria-hidden className="absolute inset-x-12 top-8 -bottom-4 rounded-[2rem] bg-linear-to-r from-violet-600/25 via-purple-500/20 to-violet-600/25 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border bg-zinc-950 text-zinc-100 shadow-2xl">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-500" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-green-500" />
          <span className="ml-3 hidden truncate text-xs text-zinc-400 sm:block">
            chapterly — Build a SaaS in 3 hours (12 lessons · 72% complete)
          </span>
          <Badge className="ml-auto bg-green-600 text-white hover:bg-green-600">72% complete</Badge>
        </div>
        <div className="grid md:grid-cols-[240px_1fr]">
          {/* sidebar */}
          <div className="hidden border-r border-white/10 md:block">
            <div className="px-4 pt-3 pb-1 text-xs font-medium tracking-wider text-zinc-500">LESSONS</div>
            <ol>
              {MOCK_LESSONS.map((l, i) => (
                <li
                  key={l.title}
                  className={`flex items-center gap-2.5 px-4 py-2.5 ${l.active ? "bg-white/10" : ""}`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      l.done ? "border-green-500 bg-green-500 text-white" : "border-zinc-600 text-transparent"
                    }`}
                  >
                    <Check className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="shrink-0 rounded bg-white/15 px-1.5 py-px font-mono text-xs">{l.time}</span>
                      <span className={`truncate text-sm ${l.active ? "font-semibold text-stone-100" : "text-zinc-300"}`}>
                        {i + 1}. {l.title}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {/* player */}
          <div className="p-4">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-zinc-800 via-zinc-900 to-black">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,oklch(0.55_0.22_295/0.35),transparent_70%)]"
              />
              <span className="absolute top-3 left-3 rounded bg-black/70 px-2 py-0.5 font-mono text-xs">12:40 → 28:05</span>
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-xs">
                <Zap className="size-3 text-amber-400" /> Auto-advance on
              </span>
              <span className="relative flex size-16 items-center justify-center rounded-full bg-violet-600 shadow-[0_0_50px_oklch(0.55_0.22_295/0.6)]">
                <Play className="size-6 fill-white text-white" />
              </span>
              <div className="absolute inset-x-4 bottom-3">
                <div className="h-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-2/3 rounded-full bg-violet-500" />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-xs text-zinc-400">
                  <span>18:22</span>
                  <span>Lesson 3 of 12</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-xs text-zinc-500">LESSON 3/12 · 12:40 → 28:05</div>
                  <div className="truncate text-sm font-semibold text-stone-100">Live demo build</div>
              </div>
              <span className="flex shrink-0 gap-2">
                <span className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300">← Prev</span>
                <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black">Next →</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* formats strip */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            <MonitorPlay className="size-4 text-violet-600" /> Paste any YouTube link format
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {FORMATS.map((f) => (
            <Badge key={f} variant="outline" className="font-mono font-normal">
              {f}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
