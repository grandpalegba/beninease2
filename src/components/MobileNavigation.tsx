"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

const categories = [
  { name: "Ambassadeurs", href: "/talents?category=ambassadeurs" },
  { name: "Artistes", href: "/talents?category=artistes" },
  { name: "Culture", href: "/talents?category=culture" },
  { name: "Tous les talents", href: "/talents" },
];

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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
  const toggleAccordion = () => setIsAccordionOpen(!isAccordionOpen);

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-md border-b border-border h-16 flex items-center md:hidden">
        <div className="container flex items-center justify-between px-4">
          <Link href="/" className="font-display text-2xl font-bold text-foreground">
            Beninease
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 text-foreground focus:outline-none"
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
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-[#B25E3B] flex flex-col pt-24 px-6 pb-10 overflow-y-auto md:hidden"
          >
            <nav className="flex flex-col gap-8">
              {/* Talents Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={toggleAccordion}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-display text-3xl font-bold text-white">
                    Talents du Bénin
                  </span>
                  <motion.div
                    animate={{ rotate: isAccordionOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={28} className="text-white" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isAccordionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-white/20">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            onClick={() => setIsOpen(false)}
                            className="font-sans text-xl text-white/90 hover:text-white transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Login Link */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="font-sans text-2xl text-white/90 hover:text-white transition-colors"
              >
                Se connecter
              </Link>

              {/* Postuler Button */}
              <Link
                href="/postuler"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold font-sans text-[#B25E3B] shadow-lg transition-transform active:scale-95 w-full mt-4"
              >
                Postuler
              </Link>
            </nav>

            {/* Optional Footer inside menu */}
            <div className="mt-auto pt-10 text-center">
              <p className="text-white/60 font-sans text-sm">
                © {new Date().getFullYear()} Beninease. Tous droits réservés.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
