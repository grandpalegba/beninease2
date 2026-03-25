"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 16, label: "Secteurs", suffix: "" },
  { value: 64, label: "Catégories", suffix: "" },
  { value: 256, label: "Visages sélectionnés", suffix: "" },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

const ConceptSection = () => {
  return (
    <section id="concept" className="py-24 md:py-32">
      <div className="container max-w-4xl text-center px-4">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance" style={{ lineHeight: "1.15" }}>
          Le Bénin, un pays facile à aimer.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-16 max-w-2xl mx-auto text-balance font-body" style={{ lineHeight: "2" }}>
          Beninease est le premier label de confiance communautaire dédié à l&apos;excellence béninoise.
          À travers un système de sélection transparent, ludique et validé par la communauté,
          nous transformons des pépites locales en véritables Ambassadeurs pour une vitrine de prestige célébrant un Bénin qui gagne.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display text-5xl md:text-6xl font-bold text-primary mb-2">
                <AnimatedCounter target={stat.value} />
                {stat.suffix}
              </span>
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground font-body">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
