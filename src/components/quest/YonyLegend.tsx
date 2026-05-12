"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LEGEND_ITEMS = [
  {
    id: 1,
    title: "1. ORIGINE",
    content: "Dans les temps anciens, les Grands Prêtres fusionnèrent la Sagesse du Fâ (le secret d'Amon) et la Lumière de Râ (la promesse d'Akhenaton) dans l'Œuf Primordial, matrice de l'harmonie universelle.",
    image: "/afraka_1.jpg"
  },
  {
    id: 2,
    title: "2. MISSION DE YONY",
    content: "Face à la chute imminente de l'Égypte antique, ils confièrent à une femme, Nyonu (Yony), figure de pureté originelle, la mission sacrée d'escorter l'Œuf vers une terre élue : le Bénin.",
    image: "/afraka_2.jpg"
  },
  {
    id: 3,
    title: "3. PAROLES DE POUVOIR",
    content: "Ils lui transmirent la Phrase Clé : À mɔn, Gbè hin azi bô ayidjlè, amɔ̃ Acɛ na tɔn. (Tu as vu, l'univers porte l'œuf que la terre convoite, et pourtant la puissance se manifestera.)",
    image: "/afraka_3.jpg"
  },
  {
    id: 4,
    title: "4. ANCRAGE",
    content: "Arrivée sur cette terre bénie, Yony utilisa ce pouvoir pour imprégner et consacrer les artefacts royaux de l'énergie pure de l'Œuf, concentré de la puissance des 256 signes du Fâ.",
    image: "/afraka_4.jpg"
  },
  {
    id: 5,
    title: "5. LA FRAGMENTATION",
    content: "Mais l'Œuf fut fragmenté par des Envahisseurs conscients que la dispersion des 256 trésors sacrés à travers le monde faciliterait la création d'un système mondial fondé sur la division.",
    image: "/afraka_5.jpg"
  },
  {
    id: 6,
    title: "6. ALLIANCE DES 16",
    content: "La prophétie annonce que la guérison exige un acte de souveraineté mondiale : l'union de 16 pays alliés pour briser les chaînes de la dispersion et restaurer l'intégrité de la mémoire.",
    image: "/afraka_6.jpg"
  },
  {
    id: 7,
    title: "7. LA RENAISSANCE",
    content: "Ce rassemblement sacré redonnera une voix aux lignées invisibilisées, célébrant la puissance créatrice des femmes et la profondeur des gardiens de savoirs, piliers de notre complétude.",
    image: "/afraka_7.jpg"
  },
  {
    id: 8,
    title: "8. LA RESTAURATION",
    content: "Yonyverse est l'univers parallèle où la libération et le retour des 256 trésors permettent de restaurer la puissance de l'Œuf originel : celle de restaurer et de maintenir l'harmonie sur Terre.",
    image: "/afraka_8.jpg"
  }
];

export function YonyLegend() {
  return (
    <section className="pt-12 pb-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1B2A4A] mb-16 text-center md:text-left tracking-tight font-display">
          La légende de Yony
        </h2>

        {/* Layout for Desktop: Custom Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-4 auto-rows-fr">
          {/* Row 1: 1, 2, 3, 4 */}
          {LEGEND_ITEMS.slice(0, 4).map((item) => (
            <LegendCard key={item.id} item={item} />
          ))}

          {/* Row 2: 5, Central, 6 */}
          <LegendCard item={LEGEND_ITEMS[4]} />
          
          <div className="col-span-2 row-span-2 flex items-center justify-center p-4">
             <div className="relative w-full h-full min-h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-100 bg-white">
                <Image 
                  src="/afraka_logo.png" 
                  alt="L'Œuf Primordial" 
                  fill 
                  className="object-contain p-8"
                />
             </div>
          </div>

          <LegendCard item={LEGEND_ITEMS[5]} />

          {/* Row 3: 7, (Central Spanned), 8 */}
          <LegendCard item={LEGEND_ITEMS[6]} />
          <LegendCard item={LEGEND_ITEMS[7]} />
        </div>

        {/* Layout for Mobile/Tablet: Standard Grid/List */}
        <div className="lg:hidden flex flex-col gap-8">
           {/* Central Image for mobile at the top or middle? User screenshot shows it integrated. */}
           <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-xl mb-4">
              <Image 
                src="/quest/legend-center.png" 
                alt="L'Œuf Primordial" 
                fill 
                className="object-cover"
              />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEGEND_ITEMS.map((item) => (
                <LegendCard key={item.id} item={item} />
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}

function LegendCard({ item }: { item: typeof LEGEND_ITEMS[0] }) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div 
      className="relative aspect-square cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front: Image */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Back: Text Content */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl bg-zinc-50 border border-zinc-200 p-6 flex flex-col justify-center items-center text-center shadow-inner"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
            {item.title}
          </h4>
          <p className="text-[12px] md:text-[13px] text-zinc-600 leading-relaxed font-light">
            {item.content}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
