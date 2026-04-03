"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Clock, QrCode, Trophy, Lock } from "lucide-react";

// Types pour les cartes mystères
interface Question {
  text: string;
  options: string[];
  correct_index: number;
  explanation_text: string;
}

interface MysteryCard {
  id: string;
  theme_id: string;
  mystery_title: string;
  subtitle: string;
  narrative_intro: string;
  icon: string;
  questions: Question[];
  is_locked: boolean;
  lock_until?: Date;
  is_conquered: boolean;
}

// Données des cartes mystères (16 univers avec 4 catégories chacun)
const mysteryCards: MysteryCard[] = [
  {
    id: "1",
    theme_id: "T6",
    mystery_title: "Rois d'Abomey",
    subtitle: "Le pouvoir des ancêtres",
    narrative_intro: "Au cœur du royaume d'Abomey, chaque roi laisse une trace indélébile. Les palais racontent des siècles de pouvoir, de rituels et de sagesse...",
    icon: "👑",
    is_locked: false,
    is_conquered: false,
    questions: [
      {
        text: "Combien de rois ont régné sur le royaume d'Abomey ?",
        options: ["12", "16", "18", "20"],
        correct_index: 0,
        explanation_text: "Douze rois ont successivement régné sur Abomey de 1600 à 1900, chacun laissant son palais."
      },
      {
        text: "Quel symbole représente le pouvoir royal dans la culture Fon ?",
        options: ["Le lion", "L'éléphant", "Le cauris", "Le fer de lance"],
        correct_index: 2,
        explanation_text: "Le cauris symbolise la richesse, le pouvoir et la communication avec les ancêtres."
      },
      {
        text: "Pourquoi les murs des palais d'Abomey sont-ils décorés de bas-reliefs ?",
        options: ["Purement décoratifs", "Raconter l'histoire du royaume", "Effrayer les ennemis", "Protéger des esprits"],
        correct_index: 1,
        explanation_text: "Les bas-reliefs racontent les exploits des rois, les batailles et les rituels du royaume."
      },
      {
        text: "Quel roi a résisté le plus longtemps à la colonisation française ?",
        options: ["Guezo", "Béhanzin", "Agonglo", "Agaja"],
        correct_index: 1,
        explanation_text: "Le roi Béhanzin a mené une résistance acharnée de 1890 à 1894 avant d'être exilé."
      }
    ]
  },
  {
    id: "2",
    theme_id: "T15",
    mystery_title: "Tata Somba",
    subtitle: "L'habitat fortifié des Batammariba",
    narrative_intro: "Au cœur de l'Atacora, le Tata n'est pas qu'une maison. C'est une forteresse spirituelle où chaque étage protège un secret des anciens...",
    icon: "🏰",
    is_locked: false,
    is_conquered: false,
    questions: [
      {
        text: "Combien d'étages compte traditionnellement un Tata Somba ?",
        options: ["2", "3", "4", "5"],
        correct_index: 0,
        explanation_text: "Le Tata Somba traditionnel compte deux étages : le rez-de-chaussée pour les animaux et le premier étage pour les humains."
      },
      {
        text: "Pourquoi les entrées des Tata Somba sont-elles très basses ?",
        options: ["Économiser les matériaux", "Obliger à s'incliner en signe de respect", "Protéger des animaux", "Réguler la température"],
        correct_index: 1,
        explanation_text: "L'entrée basse oblige les visiteurs à s'incliner, marquant le respect et l'humilité avant d'entrer."
      },
      {
        text: "Quel matériau principal est utilisé dans la construction des Tata Somba ?",
        options: ["Pierre", "Bois", "Terre battue", "Bambou"],
        correct_index: 2,
        explanation_text: "La terre battue (banco) est le matériau principal, offrant une isolation thermique naturelle."
      },
      {
        text: "Que symbolisent les symboles gravés sur les murs extérieurs ?",
        options: ["La richesse", "La protection spirituelle", "Le statut social", "Les récoltes"],
        correct_index: 1,
        explanation_text: "Les symboles gravés servent de protection spirituelle et racontent l'histoire de la famille."
      }
    ]
  },
  // Ajouter d'autres cartes mystères ici...
];

export default function TreasuresPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [lives, setLives] = useState(6);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentCard = mysteryCards[currentCardIndex];

  // Gestion du compte à rebours
  useEffect(() => {
    if (isLocked && lockEndTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = lockEndTime.getTime() - now;
        
        if (distance < 0) {
          setIsLocked(false);
          setLockEndTime(null);
          setTimeRemaining("");
        } else {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining(`${hours}h ${minutes}min`);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLocked, lockEndTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === currentCard.questions[currentQuestionIndex].correct_index;
    
    if (isCorrect) {
      // Bonne réponse
      setTimeout(() => {
        setShowExplanation(true);
        if (currentQuestionIndex === 3) {
          // Dernière question - trésor conquis
          currentCard.is_conquered = true;
        }
      }, 500);
    } else {
      // Mauvaise réponse - perte d'une vie
      setLives(prev => prev - 1);
      if (lives <= 1) {
        // Plus de vies - épreuve du silence
        const lockEnd = new Date();
        lockEnd.setHours(lockEnd.getHours() + 48);
        setIsLocked(true);
        setLockEndTime(lockEnd);
      }
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < 3) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleCardChange = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentCardIndex < mysteryCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (direction === 'prev' && currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">
      {/* Header avec jauge de vies */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">Trésors</h1>
          <div className="flex items-center gap-1">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: i < lives ? 1 : 0,
                  opacity: i < lives ? 1 : 0.3
                }}
                className={`w-8 h-8 rounded-full ${
                  i < lives 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Navigation horizontale des cartes */}
      <div className="pt-20 h-screen flex items-center">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Flèches de navigation */}
          <button
            onClick={() => handleCardChange('prev')}
            disabled={currentCardIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 shadow-lg disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleCardChange('next')}
            disabled={currentCardIndex === mysteryCards.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 shadow-lg disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carte mystère actuelle */}
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Overlay de verrouillage */}
            {isLocked && (
              <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center text-white">
                <Lock className="w-16 h-16 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Épreuve du Silence</h3>
                <p className="text-lg mb-4">{timeRemaining}</p>
                <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors">
                  <QrCode className="w-5 h-5" />
                  Scanner le QR Code partenaire
                </button>
              </div>
            )}

            {/* Contenu de la carte */}
            <div ref={scrollContainerRef} className="h-full overflow-y-auto">
              {/* En-tête de la carte */}
              <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-600 p-8 text-white">
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
                  {currentCard.theme_id}
                </div>
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">{currentCard.icon}</div>
                  <h2 className="text-3xl font-bold mb-2">{currentCard.mystery_title}</h2>
                  <p className="text-lg opacity-90">{currentCard.subtitle}</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < currentQuestionIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Mise en abyme */}
              <div className="p-8 bg-gradient-to-b from-amber-50 to-white">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-gray-700 leading-relaxed mb-8">
                    {currentCard.narrative_intro}
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                  {currentCard.questions.slice(0, currentQuestionIndex + 1).map((question, qIndex) => (
                    <motion.div
                      key={qIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.1 }}
                      className="max-w-2xl mx-auto"
                    >
                      {qIndex === currentQuestionIndex && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                              {qIndex + 1}
                            </div>
                            <span className="text-sm text-gray-500">Étape {qIndex + 1} sur 4</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-6">{question.text}</h3>
                          <div className="space-y-3">
                            {question.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => handleAnswerSelect(oIndex)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-4 rounded-xl text-left transition-all ${
                                  selectedAnswer === oIndex
                                    ? oIndex === question.correct_index
                                      ? 'bg-green-100 border-2 border-green-500'
                                      : 'bg-red-100 border-2 border-red-500'
                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Explication après réponse */}
                      {showExplanation && qIndex === currentQuestionIndex && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-6 p-6 bg-amber-50 rounded-xl border border-amber-200"
                        >
                          <p className="text-gray-700 mb-4">{question.explanation_text}</p>
                          {currentQuestionIndex < 3 && (
                            <button
                              onClick={handleNextQuestion}
                              className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                            >
                              Question suivante
                            </button>
                          )}
                          {currentQuestionIndex === 3 && (
                            <div className="text-center">
                              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                              <h4 className="text-xl font-bold text-amber-900 mb-2">Trésor Conquis !</h4>
                              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all">
                                Réclamer le Trésor
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
