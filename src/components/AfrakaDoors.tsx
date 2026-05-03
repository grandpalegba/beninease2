"use client";

import React from "react";
import { DoorCard } from "./DoorCard";
import Image from "next/image";

const FRAGMENTS = [
  {
    id: 1,
    title: "L’Origine",
    fragment: "Dans les temps anciens, les Grands Prêtres fusionnèrent la Sagesse du Fâ (le secret d’Amon) et la Lumière de Râ (la promesse d’Akhenaton) dans l’Œuf Primordial, matrice de l’harmonie universelle.",
    image: "afraka_1.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 2,
    title: "La Mission",
    fragment: "Face à la chute imminente de l'Égypte antique, ils confièrent à une femme, Nyɔnu (Yony), figure de pureté originelle, la mission sacrée d'escorter l'Œuf vers une terre élue : le Bénin.",
    image: "afraka_2.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 3,
    title: "La Parole de Pouvoir",
    fragment: "Ils lui transmirent la Phrase Clé : À mɔn, Gbè hin azi bô ayidjlè, amɔ̌ Acɛ na tɔn. (Tu as vu, l’univers porte l’œuf que la terre convoite, et pourtant la puissance se manifestera.)",
    image: "afraka_3.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 4,
    title: "L’Ancrage",
    fragment: "Arrivée sur cette terre bénie, Nyɔnu (Yony) utilisa ce pouvoir pour imprégner les sols, les champs et les artefacts royaux de l'énergie pure de l’Œuf.",
    image: "afraka_4.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 5,
    title: "La Fragmentation",
    fragment: "Mais comme le corps d'Osiris, l'Œuf fut fragmenté par la colonisation. Ses 256 cellules furent dispersées à travers le monde, emportées pour bâtir un système fondé sur la division.",
    image: "afraka_5.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 6,
    title: "Les Terres Sacrées",
    fragment: "Si les trésors physiques dorment aujourd'hui dans des musées lointains, leur âme est restée liée à 16 terres sacrées. L'énergie demeure en suspens, attendant son réveil.",
    image: "afraka_6.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 7,
    title: "Le Rechargement",
    fragment: "Pour que la puissance jaillisse à nouveau, chaque trésor doit être spirituellement rechargé par le passage des Gardiens sur ces 16 sites ancestraux. Chaque territoire réveille une part du code.",
    image: "afraka_7.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 8,
    title: "La Restauration",
    fragment: "Yonyverse est l'univers parallèle dans lequel la libération des 256 trésors, permet de restaurer la puissance de l'Oeuf originel et l'hamonie du monde.",
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
