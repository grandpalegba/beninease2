"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CategoryPattern } from "@/components/talents/CategoryPattern";

const PAGES = [
  { name: "Trésors", href: "/tresors", id: "vision" },
  { name: "Histoires", href: "/histoires", id: "mythes-legendes" },
  { name: "Savoirs", href: "/savoirs", id: "sagesse" },
  { name: "Sagesses", href: "/sagesses", id: "parole-aines" },
  { name: "Talents", href: "/talents", id: "beninois-monde" },
];

export const HeaderSwipe = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    containScroll: false
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    // With loop: true, we need to handle the index properly if it wraps
    const engine = emblaApi.internalEngine();
    const index = engine.index.get();
    const targetPage = PAGES[index % PAGES.length];
    
    if (pathname !== targetPage.href && pathname !== "/") {
      router.push(targetPage.href);
    }
  }, [emblaApi, pathname, router]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    
    // Initial scroll to active page (if not on home)
    if (pathname !== "/") {
      const activeIndex = PAGES.findIndex(p => p.href === pathname);
      if (activeIndex !== -1) {
        emblaApi.scrollTo(activeIndex, true);
      }
    }
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, pathname, onSelect]);

  const handleTitleClick = (index: number, href: string) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-[100] flex items-center border-b border-gray-100 font-sans overflow-hidden">
      <div className="w-full px-4 overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-x items-center">
          {PAGES.map((page, i) => (
            <div 
              key={i} 
              className="flex-[0_0_auto] px-3 cursor-pointer"
              onClick={() => handleTitleClick(i, page.href)}
            >
              <div className={cn(
                "flex items-center gap-3 px-5 py-2 rounded-full transition-all duration-700",
                pathname === page.href 
                  ? "bg-white text-[#1a1c1c] border border-zinc-200 shadow-sm scale-100 opacity-100" 
                  : "bg-transparent text-gray-300 border border-transparent scale-90 opacity-50 blur-[0.3px]"
              )}>
                <CategoryPattern id={page.id} className={pathname !== page.href ? "opacity-50 grayscale" : ""} />
                <span className={cn(
                  "font-display text-[10px] uppercase tracking-[0.2em] whitespace-nowrap",
                  pathname === page.href ? "font-bold text-black" : "font-medium text-gray-400"
                )}>
                  {page.name}
                </span>
                <CategoryPattern id={page.id} className={cn("scale-x-[-1]", pathname !== page.href ? "opacity-50 grayscale" : "")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
