"use client";

import React from "react";
import { DoorCard } from "./DoorCard";
import Image from "next/image";

const FRAGMENTS = [
  {
    id: 1,
    title: "1. ORIGINE",
    fragment: "Dans les temps anciens, les Grands Prêtres fusionnèrent la Sagesse du Fâ (le secret d’Amon) et la Lumière de Râ (la promesse d’Akhenaton) dans l’Œuf Primordial, matrice de l’harmonie universelle.",
    image: "afraka_1.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 2,
    title: "2. MISSION de Yony",
    fragment: "Face à la chute imminente de l’Égypte antique, ils confièrent à une femme, Nyɔnu (Yony), figure de pureté originelle, la mission sacrée d'escorter l'Œuf vers une terre élue : le Bénin.",
    image: "afraka_2.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 3,
    title: "3. PAROLES DE POUVOIR",
    fragment: "Ils lui transmirent la Phrase Clé : À mɔn, Gbè hin azi bô ayidjlè, amɔ̃ Acɛ na tɔn. (Tu as vu, l'univers porte l'œuf que la terre convoite, et pourtant la puissance se manifestera.)",
    image: "afraka_3.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 4,
    title: "4. ANCRAGE",
    fragment: "Arrivée sur cette terre bénie, Yony utilisa ce pouvoir pour imprégner et consacrer les artefacts royaux de l'énergie pure de l'Œuf, concentré de la puissance des 256 signes du Fâ.",
    image: "afraka_4.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 5,
    title: "5. LA FRAGMENTATION",
    fragment: "Mais l'Œuf fut fragmenté par des Envahisseurs conscients que la dispersion des 256 trésors sacrés à travers le monde faciliterait la création d'un système mondial fondé sur la division.",
    image: "afraka_5.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 6,
    title: "6. Alliance des 16",
    fragment: "La prophétie annonce que la guérison exige un acte de souveraineté mondiale : l'union de 16 pays alliés pour briser les chaînes de la dispersion et restaurer l'intégrité de la mémoire.",
    image: "afraka_6.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 7,
    title: "7. LA RENAISSANCE",
    fragment: "Ce rassemblement sacré redonnera une voix aux lignées invisibilisées, célébrant la puissance créatrice des femmes et la profondeur des gardiens de savoirs, piliers de notre complétude.",
    image: "afraka_7.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 8,
    title: "8. LA RESTAURATION",
    fragment: "Yonyverse est l'univers parallèle où la libération et le retour des 256 trésors permettent de restaurer la puissance de l'Œuf originel : celle de restaurer et de maintenir l'harmonie sur Terre",
    image: "afraka_8.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  }
];

import useEmblaCarousel from "embla-carousel-react";

export const AfrakaDoors = () => {
  const [emblaRef] = useEmblaCarousel({ 
    align: "center", 
    loop: false,
    skipSnaps: false
  });

  return (
    <section className="bg-white py-12 md:py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* VIEW MOBILE : DIAPORAMA (Carousel) */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              
              {/* Image Centrale en Premier sur Mobile */}
              <div className="flex-[0_0_85%] min-w-0 relative">
                <div className="bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl border border-zinc-100 h-[450px] relative overflow-hidden">
                  <Image 
                    src="/afraka_logo.png" 
                    alt="ÂFRAKA Logo" 
                    fill
                    className="object-contain p-6" 
                  />
                </div>
              </div>

              {/* Les 8 Portes */}
              {FRAGMENTS.map((fragment) => (
                <div key={fragment.id} className="flex-[0_0_85%] min-w-0">
                  <DoorCard 
                    {...fragment} 
                    className="h-[450px]" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Indicateur de swipe mobile */}
          <div className="mt-8 flex justify-center">
             <div className="flex gap-1.5 items-center">
                <div className="w-8 h-1 bg-[#FCD116] rounded-full" />
                <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                   Faire défiler
                </span>
             </div>
          </div>
        </div>

        {/* VIEW DESKTOP : BENTO GRID */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 auto-rows-fr">
          
          {/* Row 1 */}
          <DoorCard {...FRAGMENTS[0]} className="h-[300px]" />
          <DoorCard {...FRAGMENTS[1]} className="h-[300px]" />
          <DoorCard {...FRAGMENTS[2]} className="h-[300px]" />
          <DoorCard {...FRAGMENTS[3]} className="h-[300px]" />

          {/* Row 2 & 3 */}
          <DoorCard {...FRAGMENTS[4]} className="h-[300px]" />
          
          {/* BLOC CENTRAL LOGO (2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2.5rem] flex items-center justify-center p-0 shadow-xl border border-zinc-100 relative overflow-hidden group min-h-[624px]">
             <div className="relative z-10 w-full h-full">
               <Image 
                  src="/afraka_logo.png" 
                  alt="ÂFRAKA Logo" 
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" 
               />
             </div>
          </div>

          <DoorCard {...FRAGMENTS[5]} className="h-[300px]" />
          <DoorCard {...FRAGMENTS[6]} className="h-[300px]" />
          <DoorCard {...FRAGMENTS[7]} className="h-[300px]" />

        </div>

      </div>
    </section>
  );
};
