"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { useVoter } from "@/lib/auth/use-voter";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, isAuthenticated, logout } = useVoter();

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
      <header className="fixed top-0 left-0 right-0 z-[60] bg-[#F9F9F7]/90 backdrop-blur-md border-b border-black/5 h-16 flex items-center md:hidden">
        <div className="container flex items-center justify-between px-6">
          <Link 
            href="/" 
            className="font-display text-2xl font-bold text-[#006B3F]"
            onClick={() => setIsOpen(false)}
          >
            Beninease
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 text-[#006B3F] focus:outline-none transition-transform active:scale-90"
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
            className="fixed inset-0 z-[55] bg-[#006B3F] flex flex-col pt-32 px-10 md:hidden"
          >
            <nav className="flex flex-col items-start gap-8 w-full max-w-sm">
              {isAuthenticated && (
                <div className="flex items-center gap-3 mb-4 bg-white/10 p-4 rounded-2xl w-full">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Votant</span>
                    <span className="text-white/60 text-xs">{session?.whatsapp}</span>
                  </div>
                </div>
              )}

              {/* Talents du Bénin - Link Sans-Serif moderne */}
              <Link
                href="/talents"
                onClick={() => setIsOpen(false)}
                className="font-sans text-xl font-semibold text-[#F9F9F7] hover:text-[#E9B113] transition-colors"
              >
                Talents du Bénin
              </Link>

              <Link
                href="/classement"
                onClick={() => setIsOpen(false)}
                className="font-sans text-xl font-semibold text-[#F9F9F7] hover:text-[#E9B113] transition-colors"
              >
                Classement
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/talentssoutenus"
                    onClick={() => setIsOpen(false)}
                    className="font-sans text-xl font-semibold text-[#F9F9F7] hover:text-[#E9B113] transition-colors flex items-center gap-2"
                  >
                    <Heart size={20} className="fill-white" />
                    Mes Soutiens
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="font-sans text-xl font-semibold text-red-300 hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-xl font-semibold text-[#F9F9F7] hover:text-[#E9B113] transition-colors"
                >
                  Voter / Se connecter
                </Link>
              )}

              {/* Postuler - Bouton Pilule Ivoire/Vert */}
              <Link
                href="/postuler"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 rounded-full bg-[#F9F9F7] text-[#006B3F] font-sans text-xl font-bold shadow-xl transition-all hover:bg-[#E9B113] hover:text-[#008751] active:scale-95 flex items-center justify-center mt-4"
              >
                Postuler
              </Link>
            </nav>

            {/* Copyright Footer */}
            <div className="absolute bottom-10 text-[#F9F9F7]/40 font-sans text-xs">
              © {new Date().getFullYear()} Beninease
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
