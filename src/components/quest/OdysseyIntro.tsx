"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export function OdysseyIntro() {
  return (
    <section className="pt-4 pb-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4 text-[#1B2A4A]"
        >
          <div className="text-2xl md:text-3xl font-semibold font-display">
            Première Odyssée : Yony Games
          </div>
          <div className="text-lg md:text-xl font-light italic opacity-70">
            « Libérer 256 trésors du monde pour ramener l'harmonie sur Terre »
          </div>

          <div className="mt-12">
            <Link 
              href="/yonygames" 
              className="inline-block bg-[#2E5FA3] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#1B2A4A] transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20"
            >
              Découvrir Yony Games
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
