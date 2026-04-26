"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const ORGANIC_SHAPES = [
  "polygon(10% 0%, 90% 5%, 95% 40%, 85% 95%, 15% 90%, 0% 50%)",
  "polygon(5% 10%, 85% 0%, 100% 45%, 90% 100%, 10% 95%, 0% 55%)",
  "polygon(15% 5%, 95% 10%, 90% 45%, 95% 90%, 10% 85%, 5% 45%)",
  "polygon(0% 15%, 85% 5%, 100% 50%, 85% 95%, 10% 90%, 5% 50%)"
];

export default function TreasurePage({ params }: { params: { id: string } }) {
  const [mystere, setMystere] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEclair, setShowEclair] = useState(false);
  const [jarreIlluminee, setJarreIlluminee] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  useEffect(() => {
    const loadMystere = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer le mystère
        const { data: mystereData, error: mystereError } = await supabase
          .from('mysteres')
          .select('*')
          .eq('id', params.id)
          .single();

        if (mystereError) throw mystereError;

        // Récupérer les questions pour ce mystère
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('mystere_id', params.id)
          .order('question_number', { ascending: true });

        if (questionsError) throw questionsError;

        // Transformer les questions pour le format attendu
        const formattedQuestions = questionsData.map((q: any) => ({
          ...q,
          choices: [q.choice_a, q.choice_b, q.choice_c, q.choice_d]
        }));

        setMystere({
          ...mystereData,
          questions: formattedQuestions
        });

      } catch (error: any) {
        console.error('Error loading mystere:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadMystere();
    }
  }, [params.id]);

  const handleFragmentDrop = (choice: string) => {
    if (!mystere?.questions[currentQuestion]) return;
    
    const question = mystere.questions[currentQuestion];
    const correct = question.correct_answer;
    
    if (choice === correct) {
      setJarreIlluminee(true);
      setTimeout(() => {
        setShowEclair(true);
      }, 500);
    }
  };

  const handleContinueEclair = () => {
    setShowEclair(false);
    setJarreIlluminee(false);
    
    if (currentQuestion < mystere.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCompletedQuestions(prev => [...prev, currentQuestion]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  if (!mystere) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Mystère non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {showEclair && mystere?.questions[currentQuestion] && (
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
                <h2 className="text-yellow-600 text-2xl font-sans font-bold mb-4">
                  ÉCLAIRAGE DE SAVOIR
                </h2>
                <p className="text-black font-sans leading-relaxed mb-8">
                  {mystere.questions[currentQuestion].explanation}
                </p>
                <button
                  onClick={handleContinueEclair}
                  className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-full hover:bg-yellow-700 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIER ÉCRAN (h-screen) : L'Urne 70% hauteur */}
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl px-8">
          {/* L'Urne (Artefact) 70% hauteur */}
          <div className="h-[70vh] flex items-center justify-center mb-8">
            <div className="w-64 h-64 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full border-4 border-yellow-600/30 flex items-center justify-center">
              <div className="text-8xl">🏺</div>
            </div>
          </div>
          
          {/* Titre en Serif Noir */}
          <h1 className="text-black text-5xl font-sans font-bold mb-2 text-center">
            {mystere.title}
          </h1>
          
          {/* Thématique en Sans-serif discret */}
          <p className="text-black/70 font-sans text-center">
            {mystere.theme?.name || 'Thème'}
          </p>
        </div>
      </div>

      {/* SCROLL VERS LE BAS : Zone de Rite */}
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="w-full max-w-4xl px-8">
          {mystere.questions[currentQuestion] && (
            <>
              {/* La Jarre (Canari) au centre */}
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

              {/* L'énigme en Noir profond */}
              <div className="text-center mb-12">
                <h3 className="text-black text-xl font-sans font-bold mb-8">
                  {mystere.questions[currentQuestion].question}
                </h3>
              </div>

              {/* Les Fragments : Formes organiques blanches avec bordure Or */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {mystere.questions[currentQuestion].choices.map((choice: string, index: number) => (
                  <motion.div
                    key={choice}
                    className="relative px-6 py-4 bg-white border-2 border-yellow-600 text-black font-sans text-sm cursor-grab hover:border-yellow-600 transition-colors"
                    style={{ clipPath: ORGANIC_SHAPES[index % ORGANIC_SHAPES.length] }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFragmentDrop(choice)}
                  >
                    <span className="relative z-10 pointer-events-none">
                      <strong>{String.fromCharCode(65 + index)} :</strong> {choice}
                    </span>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Navigation X (Swipe) - Indicateurs de progression */}
          <div className="fixed bottom-10 right-6 z-40 flex flex-col gap-4">
            <div className="text-black/60 font-sans text-sm mb-2">
              Question {currentQuestion + 1} / {mystere.questions.length}
            </div>
            <div className="flex gap-2">
              {mystere.questions.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuestion 
                      ? 'bg-yellow-600 w-8' 
                      : index < currentQuestion 
                        ? 'bg-yellow-600/40' 
                        : 'bg-black/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
