"use client";

import Link from "next/link";
import Image from "next/image";

export const HeaderSwipe = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-24 bg-white z-[100] flex items-center justify-center font-sans border-b border-zinc-100 shadow-sm">
      <Link href="/yonygames" className="flex items-center gap-6 hover:opacity-90 transition-opacity">
        <div className="relative w-10 h-10 md:w-14 md:h-14">
          <Image 
            src="/yony-games-logo.png" 
            alt="Yony Games Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="text-[#043a82] text-xl md:text-4xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
          Yony Games
        </span>
      </Link>
    </nav>
  );
};
