"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Mystere, Question } from "@/types/treasures";
import { TreasuresService } from "@/lib/treasures-service";

interface QuizCardProps {
  mystere: Mystere;
  onComplete: () => void;
}

export default function QuizCard({ mystere, onComplete }: QuizCardProps) {
  const [currentStep, setCurrentStep] = useState<'presentation' | 'quiz' | 'completed'>('presentation');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(6);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Charger les questions depuis Supabase
    const loadQuestions = async () => {
      try {
        const { data, error } = await TreasuresService.getQuestionsForMystere(mystere.id);
        if (error) throw error;
        setQuestions(data || []);
      } catch (error) {
        console.error('Erreur chargement questions:', error);
      }
    };
    
    loadQuestions();
  }, [mystere.id]);

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const correct = TreasuresService.isCorrectAnswer(currentQuestion, answerIndex);
    setIsCorrect(correct);
    setShowResult(true);

    if (!correct) {
      setLives(prev => prev - 1);
    }
  };

  const handleContinue = () => {
    if (isCorrect && currentQuestionIndex < questions.length - 1) {
      // Passer à la question suivante
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (isCorrect && currentQuestionIndex === questions.length - 1) {
      // Quiz complété
      setCurrentStep('completed');
    } else {
      // Mauvaise réponse - réessayer la même question
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (currentStep === 'presentation') {
    return (
      <div className="h-full bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-or-royal/20 flex justify-between bg-terre-sombre/90">
          <span className="text-or-royal font-bold uppercase tracking-wider">
            {mystere.title}
          </span>
          <div className="flex gap-1 items-center">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${
                  i < lives ? 'bg-or-royal shadow-lg shadow-or-royal/50' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Contenu présentation */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Image/Icon */}
          <div className="w-full h-48 bg-gradient-to-br from-or-royal/20 to-terre-sombre rounded-xl flex items-center justify-center mb-6">
            <div className="text-6xl">{mystere.icon || '🏺'}</div>
          </div>

          {/* Informations */}
          <div className="text-center mb-8">
            <h2 className="text-ivoire text-2xl font-bold mb-2">{mystere.title}</h2>
            <p className="text-or-royal/80 text-sm mb-4">{mystere.subtitle}</p>
            <div className="text-ivoire/60 text-sm bg-terre-sombre/50 p-4 rounded-lg mb-6">
              <p className="italic leading-relaxed">"{mystere.mise_en_abyme}"</p>
            </div>
          </div>

          {/* Thème */}
          <div className="text-center mb-8">
            <div className="inline-block bg-or-royal/10 border border-or-royal/30 px-4 py-2 rounded-full">
              <span className="text-or-royal text-sm font-medium">
                {mystere.theme?.name || 'Thème'}
              </span>
            </div>
          </div>

          {/* Bouton de démarrage */}
          <div className="text-center">
            <motion.button
              onClick={handleStartQuiz}
              className="px-8 py-4 bg-gradient-to-r from-or-royal to-orange-500 text-black font-bold rounded-full hover:from-or-royal/90 hover:to-orange-500/90 transition-all shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer le Défi
            </motion.button>
            <p className="text-ivoire/60 text-sm mt-4">
              {questions.length} questions • Testez vos connaissances
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'completed') {
    return (
      <div className="h-full bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden flex items-center justify-center">
        <motion.div 
          className="text-center p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-or-royal text-3xl font-bold mb-4">Trésor Libéré !</h2>
          <p className="text-ivoire/80 mb-6">
            Vous avez maîtrisé "{mystere.title}" et débloqué un nouvel héritage culturel.
          </p>
          <div className="text-ivoire/60 text-sm mb-8">
            <p>Localisation : {mystere.subtitle}</p>
            <p>Vies restantes : {lives}/6</p>
          </div>
          <motion.button
            onClick={onComplete}
            className="px-6 py-3 bg-or-royal text-black font-bold rounded-full hover:bg-or-royal/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuer l'Aventure
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-or-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ivoire">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-terre-sombre to-black rounded-2xl border border-or-royal/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-or-royal/20 flex justify-between bg-terre-sombre/90">
        <span className="text-or-royal font-bold uppercase tracking-wider">
          {mystere.title}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-ivoire/60 text-sm">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div className="flex gap-1 items-center">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${
                  i < lives ? 'bg-or-royal shadow-lg shadow-or-royal/50' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenu quiz */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentQuestionIndex}
        >
          {/* Question */}
          <h3 className="text-ivoire text-xl font-bold mb-8 text-center leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Réponses */}
          <div className="space-y-4">
            {TreasuresService.getQuestionOptions(currentQuestion).map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400'
                    : 'bg-terre-sombre/50 border-2 border-or-royal/20 text-ivoire hover:bg-terre-sombre hover:border-or-royal/40'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-or-royal/20 rounded-full flex items-center justify-center text-or-royal font-bold mr-4">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Résultat */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-6 p-6 rounded-xl border-2 ${
                  isCorrect 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center mb-4">
                  <span className={`text-2xl mr-3 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
                  </span>
                </div>
                
                <p className="text-ivoire/80 mb-6">
                  {currentQuestion.explanation}
                </p>

                <motion.button
                  onClick={handleContinue}
                  className={`w-full py-3 rounded-full font-bold transition-all ${
                    isCorrect
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isCorrect 
                    ? (currentQuestionIndex < questions.length - 1 ? 'Continuer' : 'Terminer')
                    : 'Réessayer'
                  }
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
