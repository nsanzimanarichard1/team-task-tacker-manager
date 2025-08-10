import Hero from "@/components/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bolt, Layout, Palette } from "lucide-react";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Modern React Starter",
    description: "Beautiful React + Tailwind starter with shadcn components.",
    url: typeof window !== "undefined" ? window.location.origin : "",
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="container mx-auto py-16 space-y-12">
        <section id="features" className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-glow transition-shadow">
            <CardHeader className="flex-row items-center gap-3">
              <Bolt className="text-foreground" />
              <CardTitle>Fast by default</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Vite + React + Tailwind deliver instant reloads and a silky dev
              experience.
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-shadow">
            <CardHeader className="flex-row items-center gap-3">
              <Layout className="text-foreground" />
              <CardTitle>Beautiful components</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              shadcn-ui primitives styled by a rich, extensible design system.
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-shadow">
            <CardHeader className="flex-row items-center gap-3">
              <Palette className="text-foreground" />
              <CardTitle>Design tokens</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Semantic HSL tokens, gradients, and motion for consistent theming.
            </CardContent>
          </Card>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default Index;
