import { ArrowRight, Database, Globe, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";

const features = [
  {
    icon: Zap,
    title: "React + Vite",
    description:
      "Lightning-fast HMR and optimised production builds out of the box.",
  },
  {
    icon: Layers,
    title: "shadcn/ui + Tailwind",
    description:
      "Accessible, composable components with a utility-first CSS foundation.",
  },
  {
    icon: Database,
    title: "Supabase",
    description:
      "Auth, Postgres database, storage, and realtime — all pre-wired.",
  },
  {
    icon: Globe,
    title: "React Router v7",
    description:
      "File-friendly nested routing with a clean layout/page separation.",
  },
];

const stack = ["React 19", "TypeScript", "Vite 6", "Tailwind CSS 3", "shadcn/ui", "Supabase", "React Router 7"];

export default function Home() {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Ready to build!",
      description: "Edit src/pages/Home.tsx to start customising your app.",
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container flex flex-col items-center gap-6 py-24 text-center md:py-32">
        <Badge variant="secondary" className="text-sm">
          Full-stack template
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Ship faster with a{" "}
          <span className="text-primary">production-ready</span> stack
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          React, Vite, TypeScript, Tailwind, shadcn/ui, Supabase, and React
          Router — fully configured so you can focus on what makes your product
          unique.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={handleGetStarted}>
            Get started <ArrowRight className="ml-1" />
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {stack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            A curated stack that covers the full journey from local dev to
            production.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/40">
        <div className="container flex flex-col items-center gap-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Start building today</h2>
          <p className="max-w-md text-muted-foreground">
            Copy <code className="rounded bg-muted px-1 py-0.5 text-sm">.env.example</code> to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">.env</code>, add your
            Supabase keys, and run <code className="rounded bg-muted px-1 py-0.5 text-sm">npm run dev</code>.
          </p>
          <Button onClick={handleGetStarted}>
            Let&apos;s go <ArrowRight className="ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
}
