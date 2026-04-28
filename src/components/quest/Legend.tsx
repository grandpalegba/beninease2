"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Legend() {
  return (
    <section className="relative py-32 px-6 bg-white border-t border-zinc-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.35)] aspect-[4/3]">
            <Image 
              src="/quest/black-escape.png" 
              alt="La famille noire en marche vers sa renaissance" 
              fill
              className="object-cover" 
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
            Une famille.
            <br />
            <span className="text-zinc-400">Une seule marche.</span>
          </h2>
          <div className="mt-8 space-y-5 text-[17px] text-zinc-700 font-light leading-relaxed">
            <p>
              Les peuples Noirs sont <span className="font-medium text-zinc-950">une seule famille</span>,
              dispersée par les vents de l'Histoire, mais unie par un sang, une mémoire, un horizon commun.
            </p>
            <p>
              De l'Afrique aux Amériques, des Caraïbes à l'Europe, nous avançons ensemble —
              génération après génération — vers notre <span className="font-medium text-zinc-950">Renaissance</span>.
            </p>
            <p>
              La Porte du Retour n'est pas une fin : c'est un <em className="italic">seuil</em>.
              Celui que nos ancêtres ont franchi en partant, celui que nous franchissons aujourd'hui en revenant.
              Chaque trésor ramené est un pas de plus. Chaque voix qui s'élève est un cheval de plus dans la marche.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
