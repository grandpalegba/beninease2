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
        
        {/* Nom + Affiche Série */}
        <div className="flex items-center gap-4 mb-5">
          {serie && (
            <div className="h-20 w-14 relative rounded-xl overflow-hidden shadow-xl bg-gray-100 shrink-0 border border-gray-100">
              {serie.affiche_url && (
                <Image
                  src={serie.affiche_url}
                  alt={serie.titre}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="font-display font-black text-3xl text-gray-900 leading-tight tracking-tighter">
              {profil.nom_complet}
            </h3>
            {profil.profession && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#008751] mt-1">
                {profil.profession}
              </p>
            )}
          </div>
        </div>

        {/* Valeurs en Noix Bénies */}
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4 mb-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            Valeurs en Noix Bénies
          </span>
          <span className="flex items-center gap-1.5 font-black text-xl tabular-nums text-gray-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {displayPrice.toFixed(2)}
            <span className="text-xs font-bold text-gray-400 ml-0.5">
              NB
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
