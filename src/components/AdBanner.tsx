"use client";

import { Megaphone, ExternalLink } from "lucide-react";
import Image from "next/image";

interface AdBannerProps {
  imageUrl?: string;
  linkUrl?: string;
  title?: string;
}

export function AdBanner({ imageUrl, linkUrl, title }: AdBannerProps) {
  return (
    <div className="mt-12 w-full">
      <div className="relative w-full h-32 md:h-48 rounded-[32px] overflow-hidden group bg-gradient-to-br from-[#004d3d] to-[#008751] shadow-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Publicité"}
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
            <Megaphone className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="text-xl font-display font-bold mb-2">
              Votre marque ici
            </h3>
            <p className="text-sm text-white/70 max-w-md mx-auto">
              Devenez partenaire de Beninease et touchez une audience engagée.
            </p>
          </div>
        )}
        
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-8 px-6 py-3 bg-white text-[#008751] rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#F9F9F7] transition-colors shadow-lg"
          >
            En savoir plus
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      
      <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="w-8 h-[1px] bg-gray-200" />
        Sponsorisé par nos partenaires
        <div className="w-8 h-[1px] bg-gray-200" />
      </div>
    </div>
  );
}
