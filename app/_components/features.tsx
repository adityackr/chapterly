import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/config/home-page";

export default function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Everything a course player needs. Nothing it doesn&apos;t.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Purpose-built for learning from long videos — talks, tutorials, lectures and deep-dives.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <span className={`flex size-10 items-center justify-center rounded-xl ${f.tint}`}>
                <f.icon className="size-5" />
              </span>
              <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
