"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroBg from "@/assets/hero-collage.jpg";

const HeroSection = () => {
  const words = ['Beautiful', 'Powerful', 'Creative', 'Space', 'Magic', 'United', 'Shining', 'Rich'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentIndex];
    const duration = currentWord === 'Rich' ? 4000 : 2500;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, words]);

  return (
    <section className="relative bg-[#F9F9F7] overflow-hidden">
      <div className="container max-w-6xl px-4 pt-28 pb-10 text-center md:pt-32 md:pb-14 relative z-10">
        <div className="mb-8 md:mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h1
            className="font-display text-6xl font-bold text-black sm:text-7xl md:text-8xl lg:text-9xl mb-4"
            style={{ lineHeight: "1.05" }}
          >
            Benin Is
          </h1>
          <div className="h-12 md:h-14 lg:h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                className="font-display text-xl font-medium text-[#008751] sm:text-2xl md:text-3xl lg:text-4xl"
                style={{ letterSpacing: "0.02em" }}
              >
                {words[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div
          className="mx-auto w-full max-w-5xl opacity-0 animate-fade-up overflow-hidden rounded-2xl bg-white/10 shadow-xl ring-1 ring-black/5"
          style={{ animationDelay: "0.35s" }}
        >
          <Image
            src={heroBg}
            alt="Collage célébrant l'excellence béninoise"
            className="mx-auto block h-auto w-full object-contain object-center shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
