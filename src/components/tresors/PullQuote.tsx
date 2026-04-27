"use client";

interface PullQuoteProps {
  texte: string;
  auteur: string;
  role: string;
}

export function PullQuote({ texte, auteur, role }: PullQuoteProps) {
  return (
    <div className="relative py-12 px-8 border-l-4 border-[#8B4513] bg-[#F9F7F2]/50 my-12">
      <span className="absolute top-0 left-4 text-6xl text-[#8B4513]/10 font-serif leading-none select-none">
        “
      </span>
      <p className="font-serif text-2xl md:text-3xl italic text-gray-800 leading-snug mb-6">
        {texte}
      </p>
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">{auteur}</span>
        <span className="text-gray-500 uppercase tracking-[0.2em] text-[10px] mt-1">{role}</span>
      </div>
    </div>
  );
}
