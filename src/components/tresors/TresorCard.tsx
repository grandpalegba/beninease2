"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface TresorCardProps {
  tresor: {
    id: string;
    nom: string;
    sous_titre: string;
    image_url: string;
    localisation?: string;
  };
}

export function TresorCard({ tresor }: TresorCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tresors/${tresor.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer flex w-full h-full shrink-0 flex-col rounded-3xl bg-[#FFFFFF] border border-gray-100 overflow-hidden shadow-xl transition-all duration-300 relative"
    >
      {/* ── Image avec masque dégradé (Look Ibrahim Sow / ProfileCard) ── */}
      <div className="absolute top-8 left-8 right-8 h-[55%] overflow-hidden bg-[#000000] rounded-[2rem] pointer-events-none">
        {tresor.image_url ? (
          <Image
            src={tresor.image_url}
            alt={tresor.nom}
            fill
            sizes="(max-width: 640px) 85vw, 400px"
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
            draggable={false}
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#008751] font-sans text-5xl font-bold opacity-20 uppercase">
            {tresor.nom[0]}
          </div>
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="flex flex-col p-10 mt-auto bg-transparent relative z-10 pointer-events-none justify-end h-full">
        <div className="mb-6">
          <h3 className="text-4xl text-black leading-tight tracking-tighter font-bold font-display">
            {tresor.nom}
          </h3>
          <p className="text-base font-medium text-gray-500 mt-3 font-sans leading-relaxed">
            {tresor.sous_titre?.replace(/\.\s*$/, '')}
          </p>
        </div>

        {/* ── Localisation (Style badge) ── */}
        <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
          <div className="h-10 w-10 relative rounded-full overflow-hidden bg-[#D4AF37]/20 flex items-center justify-center">
             <div className="w-5 h-5 bg-[#D4AF37] rounded-full" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
              Localisation probable
            </p>
            <h4 className="text-xs font-bold text-black uppercase tracking-widest font-sans">
              {tresor.localisation || "Non renseignée"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TresorCard;
