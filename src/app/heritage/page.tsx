"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeritagePage() {
  const [showEclair, setShowEclair] = useState(false);
  const [jarreIlluminee, setJarreIlluminee] = useState(false);

  const handleDrop = (choice: string) => {
    if (choice === "B") {
      setJarreIlluminee(true);
      setTimeout(() => setShowEclair(true), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {showEclair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-2 border-yellow-600 rounded-2xl p-8 max-w-2xl w-full"
            >
              <div className="text-center">
                <div className="text-6xl mb-6">⚡</div>
                <h2 className="text-yellow-600 text-2xl font-serif font-bold mb-4">
                  ÉCLAIRAGE DE SAVOIR
                </h2>
                <p className="text-black font-sans leading-relaxed mb-8">
                  Exact. En Fon, "Kou" signifie la mort et "Tonou" le bord de la lagune. Le nom vient des carcasses d'éléphants qui s'y échouaient autrefois.
                </p>
                <button
                  onClick={() => setShowEclair(false)}
                  className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-full hover:bg-yellow-700 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1 - 100vh BLANC PUR */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-48 h-48 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full border-4 border-yellow-600 flex items-center justify-center mx-auto mb-8">
            <div className="text-8xl">🏺</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 - TITRE */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-black text-6xl font-serif font-bold mb-4">
            La Lagune des Morts
          </h1>
          <p className="text-black text-xl font-sans mb-8">
            (Cotonou)
          </p>
          <p className="text-black/80 font-sans italic max-w-3xl mx-auto mb-16">
            "Avant d'être la capitale économique, cette terre était un simple rivage. On raconte qu'un capitaine de navire y vit un jour des cadavres d'éléphants s'échouer..."
          </p>

          {/* JARRE (CANARI) */}
          <div className="flex justify-center mb-16">
            <div 
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                jarreIlluminee 
                  ? 'bg-yellow-600 shadow-2xl shadow-yellow-600/50' 
                  : 'bg-yellow-600/30 border-4 border-yellow-600'
              }`}
            >
              <motion.div
                animate={jarreIlluminee ? { 
                  scale: [1, 1.1, 1], 
                  opacity: [1, 0.8, 1] 
                } : {}}
                transition={{ duration: 1, repeat: jarreIlluminee ? Infinity : 0 }}
                className="text-5xl"
              >
                🏺
              </motion.div>
            </div>
          </div>

          {/* QUESTION */}
          <h3 className="text-black text-xl font-serif font-bold mb-8">
            Que signifie réellement le nom Koutonou en langue Fon ?
          </h3>

          {/* CHOIX DRAG & DROP */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { id: "A", text: "Le port de l'espoir" },
              { id: "B", text: "La lagune des morts" },
              { id: "C", text: "Le marché du sel" }
            ].map((choice) => (
              <motion.div
                key={choice.id}
                className="px-6 py-4 bg-white border-2 border-yellow-600/30 text-black font-sans text-center cursor-grab hover:border-yellow-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDrop(choice.id)}
              >
                <strong>{choice.id}:</strong> {choice.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
