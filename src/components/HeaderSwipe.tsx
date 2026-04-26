"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PAGES = [
  { name: "Sagesses", href: "/sagesses" },
  { name: "Savoirs", href: "/savoirs" },
  { name: "Histoires", href: "/histoires" },
  { name: "Ambassadeurs", href: "/ambassadeurs" },
  { name: "Trésors", href: "/tresors" },
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
              className="flex-[0_0_auto] px-8 cursor-pointer"
              onClick={() => handleTitleClick(i, page.href)}
            >
              <span className={cn(
                "text-lg uppercase tracking-[0.2em] transition-all duration-700 block whitespace-nowrap",
                pathname === page.href 
                  ? "text-black font-black scale-110 opacity-100" 
                  : "text-gray-300 font-medium scale-90 opacity-60 blur-[0.2px]"
              )}>
                {page.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
