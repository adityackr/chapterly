import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { STEPS } from "@/config/home-page";

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="text-center">
        <Badge variant="secondary">How it works</Badge>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">From link to lessons in 30 seconds</h2>
      </div>
      <div className="relative mt-10 grid gap-4 md:grid-cols-3">
        <div aria-hidden className="absolute top-10 right-[16%] left-[16%] hidden h-px bg-border md:block" />
        {STEPS.map((s) => (
          <Card key={s.n} className="relative">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
                  <s.icon className="size-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button size="lg" nativeButton={false} render={<Link href="/add" />} className="bg-violet-600 text-white hover:bg-violet-500">
          Try it now — paste your first link <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
