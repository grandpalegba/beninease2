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

export function ProfileCard({ profil, serie }: ProfileCardProps) {
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
      className="group cursor-pointer flex w-full h-full shrink-0 flex-col rounded-3xl bg-white border border-gray-100 overflow-hidden shadow-xl transition-all duration-300 relative"
    >
      {/* ── Photo avec masque dégradé (Look Ibrahim Sow) ── */}
      <div className="absolute inset-0 w-full h-[65%] overflow-hidden bg-gray-50 pointer-events-none">
        {profil.photo_url ? (
          <Image
            src={profil.photo_url}
            alt={profil.nom_complet}
            fill
            sizes="(max-width: 640px) 85vw, 400px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            draggable={false}
            priority
            style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#008751] font-sans text-5xl font-bold opacity-20">
            {profil.nom_complet[0]}
          </div>
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="flex flex-col p-6 mt-auto bg-transparent relative z-10 pointer-events-none justify-end h-full">
        
        {/* Nom + Profession */}
        <div className="flex flex-col mb-4">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900 leading-tight tracking-tighter truncate">
            {profil.nom_complet}
          </h3>
          {profil.profession && (
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#008751] mt-1 truncate">
              {profil.profession}
            </p>
          )}
        </div>

        {/* ── Affiche Série (Plus grande, remplace la valeur) ── */}
        {serie && (
          <div className="flex justify-center mt-4">
            <div className="h-32 w-24 relative rounded-xl overflow-hidden shadow-2xl bg-gray-100 border-2 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300">
              {serie.affiche_url ? (
                <Image
                  src={serie.affiche_url}
                  alt={serie.titre}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                   <span className="text-[8px] text-gray-400 font-bold text-center px-1">SÉRIE</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
