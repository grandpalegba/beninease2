"use client";

import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CategoryPattern } from "@/components/talents/CategoryPattern";

const PAGES = [
  { name: "Trésors", href: "/tresors", id: "startup-innovation" },
  { name: "Histoires", href: "/histoires", id: "mythes-legendes" },
  { name: "Savoirs", href: "/savoirs", id: "sagesse" },
  { name: "Sagesses", href: "/sagesses", id: "parole-aines" },
  { name: "Talents", href: "/talents", id: "beninois-monde" },
  { name: "Yony Games", href: "/yony-games", id: "vision" },
];

export const HeaderSwipe = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Define dynamic pages based on the current route
  const getVisiblePages = () => {
    if (pathname === "/") {
      return PAGES.filter(p => p.href === "/yony-games");
    }
    // If on Yony Games or any of the game categories, show only the categories
    const categoryRoutes = ["/sagesses", "/talents", "/tresors", "/histoires", "/savoirs"];
    if (pathname === "/yony-games" || categoryRoutes.some(route => pathname.startsWith(route))) {
      return PAGES.filter(p => ["/sagesses", "/talents", "/tresors", "/histoires", "/savoirs"].includes(p.href));
    }
    return PAGES;
  };

  const visiblePages = getVisiblePages();

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: visiblePages.length > 1, 
    align: "center",
    containScroll: false,
    dragFree: false,
    skipSnaps: false
  });

  const onSelect = useCallback(() => {
    if (!emblaApi || visiblePages.length <= 1) return;
    const engine = emblaApi.internalEngine();
    const index = engine.index.get();
    const targetPage = visiblePages[index % visiblePages.length];
    
    if (pathname !== targetPage.href && pathname !== "/") {
      router.push(targetPage.href);
    }
  }, [emblaApi, pathname, router, visiblePages]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    
    // Initial scroll to active page (if not on home)
    if (pathname !== "/" && pathname !== "/yony-games") {
      const activeIndex = visiblePages.findIndex(p => p.href === pathname);
      if (activeIndex !== -1) {
        emblaApi.scrollTo(activeIndex, true);
      }
    }
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, pathname, onSelect, visiblePages]);

  const handleTitleClick = (index: number, href: string) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-[100] flex items-center border-b border-zinc-100 font-sans overflow-hidden">
      <div className="w-full max-w-[800px] mx-auto overflow-hidden px-4" ref={emblaRef}>
        <div className="flex touch-pan-x items-center">
          {visiblePages.map((page, i) => (
            <div 
              key={i} 
              className="flex-[0_0_auto] px-1 md:px-3 cursor-pointer"
              onClick={() => handleTitleClick(i, page.href)}
            >
              <div className={cn(
                "flex items-center gap-1 md:gap-2 transition-all duration-500",
                pathname === page.href 
                  ? "scale-105 opacity-100" 
                  : "opacity-40 scale-90"
              )}>
                <CategoryPattern id={page.id} size={14} className={pathname === page.href ? "text-[#D4922A]" : "grayscale opacity-20"} />
                <span className={cn(
                  "font-display text-[9px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.25em] whitespace-nowrap transition-colors duration-500",
                  pathname === page.href ? "font-black text-zinc-950" : "font-semibold text-zinc-400"
                )}>
                  {page.name}
                </span>
                <CategoryPattern id={page.id} size={14} className={cn("scale-x-[-1]", pathname === page.href ? "text-[#D4922A]" : "grayscale opacity-20")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
