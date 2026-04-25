"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Profil, Serie } from "@/data/series";
import { useWallet } from "@/store/wallet";
import { Sparkles, Users } from "lucide-react";

interface ProfileCardProps {
  profil: Profil;
  serie?: Serie | null;
}

export function ProfileCard({ profil }: ProfileCardProps) {
  const router = useRouter();
  const storePrice = useWallet((s) => s.effectivePrice(profil.id));
  const displayPrice = storePrice > 0 ? storePrice : profil.valeur_noix_benies;

  // Swipe up logic
  let touchStartY = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 50) {
      router.push(`/profil/${profil.id}`);
    }
  };

  const handleClick = () => {
    router.push(`/profil/${profil.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group cursor-pointer flex w-[85vw] max-w-[340px] h-[65vh] max-h-[600px] shrink-0 snap-start flex-col rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl transition-all duration-300 mx-auto"
    >
      {/* ── Photo ── */}
      <div className="relative flex-1 w-full overflow-hidden bg-gray-100 pointer-events-none">
        {profil.photo_url ? (
          <Image
            src={profil.photo_url}
            alt={profil.nom_complet}
            fill
            sizes="(max-width: 640px) 85vw, 340px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#008751]/10 text-[#008751] font-serif text-5xl font-bold">
            {profil.nom_complet[0]}
          </div>
        )}

        {/* Gradient bas de carte */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* ── Contenu Minimaliste ── */}
      <div className="flex flex-col p-6 bg-white gap-4 relative z-10 pointer-events-none">
        <div>
          <h3 className="font-bold text-2xl text-gray-900 leading-tight truncate">
            {profil.nom_complet}
          </h3>
          {profil.profession && (
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mt-1 truncate">
              {profil.profession}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#008751]/5 border border-[#008751]/10 px-4 py-3">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Cours
          </span>
          <span className="flex items-center gap-1.5 font-bold text-base tabular-nums text-[#008751]">
            <Sparkles className="h-4 w-4" />
            {displayPrice.toFixed(2)}
            <span className="text-xs font-normal text-gray-400 ml-0.5">
              NB
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
