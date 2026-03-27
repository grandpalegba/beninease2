"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center md:hidden">
        <div className="container flex items-center justify-between px-6">
          <Link 
            href="/" 
            className="font-display text-2xl font-bold text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Beninease
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 text-foreground focus:outline-none transition-transform active:scale-90"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[55] bg-[#B25E3B] flex flex-col pt-32 px-10 md:hidden"
          >
            <nav className="flex flex-col items-start gap-8 w-full max-w-sm">
              {/* Talents du Bénin - Link Sans-Serif moderne */}
              <Link
                href="/talents"
                onClick={() => setIsOpen(false)}
                className="font-sans text-xl font-semibold text-[#FDFBF7] hover:opacity-80 transition-opacity"
              >
                Talents du Bénin
              </Link>

              {/* Se connecter - Link Sans-Serif moderne (Identique) */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="font-sans text-xl font-semibold text-[#FDFBF7] hover:opacity-80 transition-opacity"
              >
                Se connecter
              </Link>

              {/* Postuler - Bouton Pilule Blanc */}
              <Link
                href="/postuler"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 rounded-full bg-white text-[#B25E3B] font-sans text-xl font-bold shadow-xl transition-transform active:scale-95 flex items-center justify-center mt-4"
              >
                Postuler
              </Link>
            </nav>

            {/* Copyright Footer */}
            <div className="absolute bottom-10 text-[#FDFBF7]/40 font-sans text-xs">
              © {new Date().getFullYear()} Beninease
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
