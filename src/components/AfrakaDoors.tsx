"use client";

import React from "react";
import { DoorCard } from "./DoorCard";
import Image from "next/image";

const FRAGMENTS = [
  {
    id: 1,
    title: "L'Alliance Primordiale",
    fragment: "Il y a très longtemps, la sagesse du Fâ et la lumière de Râ s’unirent pour préserver l’équilibre du monde. De cette alliance sacrée naquit une mère originelle : ÂFRÂ.",
    image: "afraka_1.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 2,
    title: "Le Souffle Sacré",
    fragment: "Les sages de l’Égypte antique reconnurent en elle une force primordiale qu’ils appelèrent ÂFRAKA — le Ka d’ÂFRÂ. Un œuf sacré fut forgé pour en protéger l’unité.",
    image: "afraka_2.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 3,
    title: "Le Verbe Révélé",
    fragment: "Trois paroles furent confiées au messager de l'œuf : À mɔn (Tu as vu), Ashé na tọ́n (L’énergie va se manifester), et Gbèhin azi bô ayidjlè (L'univers porte l’œuf).",
    image: "afraka_3.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 4,
    title: "La Terre Choisie",
    fragment: "Le messager traversa les terres jusqu’à atteindre le point de rencontre entre le visible et l’invisible : le Bénin. Là, l’œuf fut déposé et son énergie imprégna le sol du Danxomè.",
    image: "afraka_4.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 5,
    title: "Les Gardiens du Ka",
    fragment: "ÂFRAKA vécut à travers les trônes, les artefacts et les trésors royaux. Avec le temps, ce nom voyagea et se transforma, devenant Africa, puis Afrique.",
    image: "afraka_5.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  },
  {
    id: 6,
    title: "La Mémoire Arrachée",
    fragment: "Les envahisseurs arrivèrent et les trésors furent arrachés à leur terre, emportant avec eux des fragments de la puissance d’ÂFRÂ. L'équilibre fut brisé.",
    image: "afraka_6.jpg",
    className: "md:col-span-1 md:row-span-2 h-full min-h-[300px]"
  },
  {
    id: 7,
    title: "L'Appel du Fâ",
    fragment: "Le 10 janvier, il fut révélé qu'il est temps de réveiller l'œuf. Libérer les trésors exilés, c'est restaurer la force vitale du Bénin et de ses enfants.",
    image: "afraka_7.jpg",
    className: "md:col-span-2 md:row-span-1 h-[250px]"
  },
  {
    id: 8,
    title: "Black To Benin",
    fragment: "Ouvrir la Porte du Retour, c'est reconstituer l'unité d'ÂFRAKA. Pour l’essor des peuples noirs à travers le monde, l'énergie se manifeste enfin : Ashé na tọ́n.",
    image: "afraka_8.jpg",
    className: "md:col-span-1 md:row-span-1 h-[250px]"
  }
];

export const AfrakaDoors = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Bento Grid - 4 columns for desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-fr">
          
          {/* Row 1 */}
          <DoorCard {...FRAGMENTS[0]} className="h-[250px] md:h-[300px]" />
          <DoorCard {...FRAGMENTS[1]} className="h-[250px] md:h-[300px]" />
          <DoorCard {...FRAGMENTS[2]} className="h-[250px] md:h-[300px]" />
          <DoorCard {...FRAGMENTS[3]} className="h-[250px] md:h-[300px]" />

          {/* Row 2 & 3 */}
          <DoorCard {...FRAGMENTS[4]} className="h-[250px] md:h-[300px]" />
          
          {/* BLOC CENTRAL LOGO (2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#1a1a1a] rounded-[2.5rem] flex flex-col items-center justify-center p-8 shadow-2xl relative overflow-hidden group min-h-[300px] md:min-h-[624px]">
             <div className="absolute inset-0 opacity-10 bg-[url('/afraka_logo.png')] bg-center bg-no-repeat bg-contain scale-150" />
             <div className="relative z-10 w-full h-full flex items-center justify-center">
               <Image 
                  src="/afraka_logo.png" 
                  alt="ÂFRAKA Logo" 
                  width={400} 
                  height={400} 
                  className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_30px_rgba(252,209,22,0.3)]" 
               />
             </div>
          </div>

          <DoorCard {...FRAGMENTS[5]} className="h-[250px] md:h-[300px]" />
          <DoorCard {...FRAGMENTS[6]} className="h-[250px] md:h-[300px]" />
          <DoorCard {...FRAGMENTS[7]} className="h-[250px] md:h-[300px]" />

        </div>

      </div>
    </section>
  );
};
