"use client";

import React from "react";
import Link from "next/link";
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



  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white z-[100] flex items-center border-b border-zinc-100 font-sans overflow-x-auto scrollbar-hide">
      <div className="w-full flex justify-center items-center gap-2 md:gap-8 px-4">
        {visiblePages.map((page, i) => (
          <Link 
            key={i} 
            href={page.href}
            className="flex-[0_0_auto] cursor-pointer"
          >
            <div className={cn(
              "flex items-center gap-1 md:gap-2 transition-all duration-500",
              pathname === page.href 
                ? "scale-105 opacity-100" 
                : "opacity-50 scale-90 hover:opacity-80"
            )}>
              <CategoryPattern id={page.id} size={14} className={pathname === page.href ? "text-[#D4922A]" : "grayscale opacity-30"} />
              <span className={cn(
                "font-display text-[9px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.25em] whitespace-nowrap transition-colors duration-500",
                pathname === page.href ? "font-bold text-[#1B2A4A]" : "font-medium text-[#1B2A4A]"
              )}>
                {page.name}
              </span>
              <CategoryPattern id={page.id} size={14} className={cn("scale-x-[-1]", pathname === page.href ? "text-[#D4922A]" : "grayscale opacity-20")} />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};
