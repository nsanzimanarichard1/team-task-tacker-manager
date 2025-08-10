import { useRef } from "react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-abstract.jpg";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const handlePointerMove: React.PointerEventHandler<HTMLElement> = (e) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  return (
    <header className="relative">
      <section
        ref={sectionRef}
        onPointerMove={handlePointerMove}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-8 md:p-12 shadow-elegant"
        aria-label="Hero section"
      >
        <div className="pointer-events-none absolute inset-0 bg-hero-interactive opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="text-left space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Modern React Starter
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              Beautiful, responsive UI powered by Tailwind and shadcn components.
              Crafted tokens, subtle motion, and an elegant gradient accent.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" aria-label="Get started now">
                Get Started
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#features" aria-label="Learn more about features">
                  Learn more
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Abstract gradient hero for a modern React starter"
              className="w-full rounded-xl border border-border shadow-elegant md:animate-float"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Hero;
