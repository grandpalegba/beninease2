"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalSwiperProps {
  children: React.ReactNode[];
  className?: string;
}

export default function HorizontalSwiper({ children, className }: HorizontalSwiperProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative group w-full", className)}>
      <div className="overflow-hidden px-4 md:px-12" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 py-8">
          {children.map((child, index) => (
            <div key={index} className="flex-[0_0_85%] min-w-0 md:flex-[0_0_350px]">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Hidden on Mobile, Hover on Desktop */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center transition-all opacity-0 md:group-hover:opacity-100 disabled:opacity-0",
          !prevBtnEnabled && "pointer-events-none"
        )}
      >
        <ChevronLeft className="w-6 h-6 text-[#008751]" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center transition-all opacity-0 md:group-hover:opacity-100 disabled:opacity-0",
          !nextBtnEnabled && "pointer-events-none"
        )}
      >
        <ChevronRight className="w-6 h-6 text-[#008751]" />
      </button>
    </div>
  );
}
