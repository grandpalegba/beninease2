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
        <div className="mb-4">
          <h3 className="font-display font-black text-4xl text-gray-900 leading-tight tracking-tighter">
            {profil.nom_complet}
          </h3>
          {profil.profession && (
            <p className="text-sm font-medium text-gray-500 mt-2">
              {profil.profession}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4 mb-4">
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

        {/* ── Miniature de la Série ── */}
        {serie && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="h-12 w-9 relative rounded overflow-hidden shadow-sm bg-gray-100 shrink-0">
              {serie.affiche_url && (
                <Image
                  src={serie.affiche_url}
                  alt={serie.titre}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                Série
              </p>
              <h4 className="text-sm font-bold text-gray-900">
                {serie.titre}
              </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
