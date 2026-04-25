"use client";

/**
 * src/components/histoires/ProfileCard.tsx
 *
 * Carte profil pour la section Histoires.
 * Basé sur la référence fournie, adapté pour Next.js (next/link au lieu de @tanstack/react-router).
 * Utilise les types snake_case de @/data/series.
 */

import Link from "next/link";
import Image from "next/image";
import type { Profil, Serie } from "@/data/series";
import { useWallet } from "@/store/wallet";
import { Sparkles, Users } from "lucide-react";

interface ProfileCardProps {
  profil: Profil;
  serie?: Serie | null;
}

export function ProfileCard({ profil, serie }: ProfileCardProps) {
  const storePrice = useWallet((s) => s.effectivePrice(profil.id));
  // Si pas de snapshot en store → affiche la valeur de la DB directement
  const displayPrice =
    storePrice > 0 ? storePrice : profil.valeur_noix_benies;

  return (
    <Link
      href={`/profil/${profil.id}`}
      className="group flex w-[280px] sm:w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* ── Photo 4/5 ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        {profil.photo_url ? (
          <Image
            src={profil.photo_url}
            alt={profil.nom_complet}
            fill
            sizes="(max-width: 640px) 280px, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          /* Fallback initiale */
          <div className="absolute inset-0 flex items-center justify-center bg-[#008751]/10 text-[#008751] font-serif text-5xl font-bold">
            {profil.nom_complet[0]}
          </div>
        )}

        {/* Badge numéro profil */}
        {profil.numero_profil !== null && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
            #{profil.numero_profil}
          </div>
        )}

        {/* Gradient bas de carte */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ── Contenu ── */}
      <div className="flex flex-col p-4 gap-3">
        {/* Nom */}
        <div>
          <h3 className="font-bold text-base text-gray-900 leading-tight truncate">
            {profil.nom_complet}
          </h3>
          {profil.profession && (
            <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5 truncate">
              {profil.profession}
            </p>
          )}
        </div>

        {/* Prix dynamique Noix Bénies */}
        <div className="flex items-center justify-between rounded-xl bg-[#008751]/5 border border-[#008751]/10 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Cours
          </span>
          <span className="flex items-center gap-1 font-bold text-sm tabular-nums text-[#008751]">
            <Sparkles className="h-3.5 w-3.5" />
            {displayPrice.toFixed(2)}
            <span className="text-[10px] font-normal text-gray-400 ml-0.5">
              NB
            </span>
          </span>
        </div>

        {/* Investisseurs */}
        {profil.total_investisseurs > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Users className="h-3 w-3" />
            <span>
              {profil.total_investisseurs} investisseur
              {profil.total_investisseurs > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Série associée */}
        {serie && (
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5">
            {/* Affiche miniature */}
            <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-sm">
              {serie.affiche_url && (
                <Image
                  src={serie.affiche_url}
                  alt={serie.titre}
                  width={36}
                  height={48}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">
                Série
              </p>
              <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                {serie.titre}
              </p>
              {serie.episode_titre && (
                <p className="text-[10px] text-gray-400 truncate">
                  Ép. {serie.episode_numero} · {serie.episode_titre}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default ProfileCard;
