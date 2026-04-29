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
    containScroll: false,
    dragFree: false,
    skipSnaps: false
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
      <div className="w-full max-w-[800px] mx-auto overflow-hidden px-4" ref={emblaRef}>
        <div className="flex touch-pan-x items-center">
          {PAGES.map((page, i) => (
            <div 
              key={i} 
              className="flex-[0_0_auto] px-2 md:px-4 cursor-pointer"
              onClick={() => handleTitleClick(i, page.href)}
            >
              <div className={cn(
                "flex items-center px-8 py-2.5 rounded-full transition-all duration-500",
                pathname === page.href 
                  ? "bg-white text-black border border-black/10 shadow-lg scale-110 opacity-100" 
                  : "bg-transparent text-gray-400 border border-transparent scale-90 opacity-100"
              )}>
                <span className={cn(
                  "font-display text-[10px] md:text-[11px] uppercase tracking-[0.25em] whitespace-nowrap",
                  pathname === page.href ? "font-black text-black" : "font-semibold text-gray-500"
                )}>
                  {page.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
