"use client";

import React from "react";
import { DoorCard } from "./DoorCard";
import Image from "next/image";

const FRAGMENTS = [
  {
    id: 1,
    title: "L'Alliance Primordiale",
    fragment: "Il y a très longtemps, la sagesse du Fâ et la lumière de Râ s’unirent pour préserver l’équilibre du monde. De cette alliance sacrée naquit une mère originelle : ÂFRÂ.",
    image: "media__1777354591130.png",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 2,
    title: "Le Souffle Sacré",
    fragment: "Les sages de l’Égypte antique reconnurent en elle une force primordiale qu’ils appelèrent ÂFRAKA — le Ka d’ÂFRÂ. Un œuf sacré fut forgé pour en protéger l’unité.",
    image: "media__1777354591157.png",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 3,
    title: "Le Verbe Révélé",
    fragment: "Trois paroles furent confiées au messager de l'œuf : À mɔn (Tu as vu), Ashé na tọ́n (L’énergie va se manifester), et Gbèhin azi bô ayidjlè (L'univers porte l’œuf).",
    image: "media__1777363479508.png",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 4,
    title: "La Terre Choisie",
    fragment: "Le messager traversa les terres jusqu’à atteindre le point de rencontre entre le visible et l’invisible : le Bénin. Là, l’œuf fut déposé et son énergie imprégna le sol du Danxomè.",
    image: "media__1777363023822.png",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 5,
    title: "Les Gardiens du Ka",
    fragment: "ÂFRAKA vécut à travers les trônes, les artefacts et les trésors royaux. Avec le temps, ce nom voyagea et se transforma, devenant Africa, puis Afrique.",
    image: "media__1777363334693.png",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 6,
    title: "La Mémoire Arrachée",
    fragment: "Les envahisseurs arrivèrent et les trésors furent arrachés à leur terre, emportant avec eux des fragments de la puissance d’ÂFRÂ. L'équilibre fut brisé.",
    image: "media__1777354591136.png",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 7,
    title: "L'Appel du Fâ",
    fragment: "Le 10 janvier, il fut révélé qu'il est temps de réveiller l'œuf. Libérer les trésors exilés, c'est restaurer la force vitale du Bénin et de ses enfants.",
    image: "media__1777354591153.png",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 8,
    title: "Black To Benin",
    fragment: "Ouvrir la Porte du Retour, c'est reconstituer l'unité d'ÂFRAKA. Pour l’essor des peuples noirs à travers le monde, l'énergie se manifeste enfin : Ashé na tọ́n.",
    image: "media__1777354637775.png",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  }
];

export const AfrakaDoors = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header de section */}
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter">
            Les Portes d'ÂFRAKA
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-500 text-sm md:text-base uppercase tracking-[0.3em] font-medium leading-relaxed">
            Huit fragments. Une vérité. <br />
            Reconstituez l'unité primordiale de l'excellence noire.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
          
          {/* Fragment 1 */}
          <DoorCard {...FRAGMENTS[0]} />

          {/* Fragment 2 */}
          <DoorCard {...FRAGMENTS[1]} />

          {/* Fragment 3 */}
          <DoorCard {...FRAGMENTS[2]} />

          {/* Fragment 4 */}
          <DoorCard {...FRAGMENTS[3]} />

          {/* BLOC CENTRAL LOGO (Fixe) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#1a1a1a] rounded-[2.5rem] flex flex-col items-center justify-center p-12 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 opacity-10 bg-[url('/logo.png')] bg-center bg-repeat bg-[length:40px_40px]" />
             <Image 
                src="/logo.png" 
                alt="Black To Benin Logo" 
                width={80} 
                height={80} 
                className="mb-8 relative z-10 transition-transform duration-700 group-hover:scale-110" 
             />
             <h3 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] uppercase text-center relative z-10">
                Black To <br />
                <span className="text-[#FCD116]">Benin</span>
             </h3>
             <div className="mt-8 w-12 h-[1px] bg-white/20 relative z-10" />
             <p className="mt-8 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] text-center relative z-10">
                Gardien de l'œuf
             </p>
          </div>

          {/* Fragment 5 */}
          <DoorCard {...FRAGMENTS[4]} />

          {/* Fragment 6 */}
          <DoorCard {...FRAGMENTS[5]} />

          {/* Fragment 7 */}
          <DoorCard {...FRAGMENTS[6]} />

          {/* Fragment 8 */}
          <DoorCard {...FRAGMENTS[7]} />

        </div>

        {/* Footer de section */}
        <div className="mt-24 text-center">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
            Cliquez sur une porte pour explorer le Ka
          </p>
        </div>
      </div>
    </section>
  );
};
