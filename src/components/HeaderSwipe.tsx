"use client";

import Link from "next/link";
import Image from "next/image";

export const HeaderSwipe = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#043a82] z-[100] flex items-center justify-center font-sans border-b border-white/5 shadow-lg">
      <Link href="/yonygames" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          <Image 
            src="/yony-games-logo.png" 
            alt="Yony Games Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-white text-lg md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
          Yony Games
        </span>
      </Link>
    </nav>
  );
};
