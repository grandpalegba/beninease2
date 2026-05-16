"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const LEGEND_ITEMS = [
  {
    id: 1,
    title: "I. La Matrice de l’Harmonie",
    content: "Dans les temps anciens, les Grands Prêtres fusionnèrent la Sagesse du Fâ (le secret d'Amon), la Lumière de Râ (la promesse d'Akhenaton) et la beauté du Yanantin (le don d'Imhotep) dans l'Œuf Primordial, matrice absolue de l'Harmonie universelle.",
    image: "/afraka_1.jpg"
  },
  {
    id: 2,
    title: "II. La Messagère des Étoiles",
    content: "Face à la chute de l'Égypte antique, les Sages confièrent à une femme la mission sacrée de scinder la puissance de l'Œuf vers deux terres élues : le Dahomey (Bénin) et le Tahuan-tinsuyo (Pérou). Appelée Yana ou Yɔnnu, les grands Initiés murmurent son nom secret : Yony.",
    image: "/afraka_2.jpg"
  },
  {
    id: 3,
    title: "III. La Phrase Clé Sacrée",
    content: "Avant son grand voyage, ils lui transmirent la formule de pouvoir qui traverse les âges : « À mɔn, Gbè hin azi bô ayidjlè, amɔ̃ Acɛ na tɔn » — Tu as vu, l'univers porte l'œuf que la terre convoite, et pourtant la puissance se manifestera.",
    image: "/afraka_3.jpg"
  },
  {
    id: 4,
    title: "IV. L'Ancrage du Dahomey",
    content: "Arrivée sur la terre bénie du Bénin, la première moitié de l'énergie de Yony imprégna et consacra les artefacts royaux. Ainsi naquirent les 256 Trésors mémoriels, concentrés sacrés de la puissance géomantique des signes du Fâ.",
    image: "/afraka_4.jpg"
  },
  {
    id: 5,
    title: "V. Le Souffle de Cusco",
    content: "L'autre moitié de sa puissance fut déployée directement dans la Terre des Andes, façonnant la Vallée Sacrée de Cusco. L'énergie de Yony imprégna le sol pendant 328 nuits, donnant naissance au réseau mystique des Huacas sacrées de l'Empire Inca.",
    image: "/afraka_5.jpg"
  },
  {
    id: 6,
    title: "VI. La Grande Cassure",
    content: "Conscients de ce pouvoir, des Envahisseurs conspirèrent pour soumettre l'humanité en brisant le réseau : ils orchestrèrent la dispersion des 256 trésors africains et la profanation des 328 huacas andines pour imposer un ordre mondial fondé sur la division et l'oubli.",
    image: "/afraka_6.jpg"
  },
  {
    id: 7,
    title: "VII. Le Secret du Nombre 41",
    content: "Dans l'ombre, le monde tint bon grâce au nombre sacré 41, qui régit secrètement les lignes de force du Pérou et les lois de justice du Roi Houegbaja au Bénin. Mais aujourd'hui, cet équilibre fragile ne suffit plus.",
    image: "/afraka_7.jpg"
  },
  {
    id: 8,
    title: "VIII. L'Appel des Yony Games",
    content: "La prophétie est désormais en marche : pour guérir la Terre, l'énergie collective de l'humanité doit s'unir à travers des Jeux collaboratifs. En libérant les 256 trésors et en réactivant 256 huacas, les peuples restaureront l'Œuf de Yony et rétabliront l'Harmonie sur Terre.",
    image: "/afraka_8.jpg"
  }
];

export function YonyLegend() {
  return (
    <section className="pt-24 pb-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#043a82] mb-16 text-center tracking-tight font-display">
          La légende des Yony Games
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
