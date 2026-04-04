"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Clock, QrCode, Trophy, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import { useSwipe } from "@/hooks/useSwipe";
import type { Mystere, Question, UserTreasure, TreasuresState } from "@/types/treasures";

// Configuration
const TOTAL_LIVES = 6;
const MYSTERIES_PER_PAGE = 20;

export default function TreasuresPage() {
  // État principal
  const [state, setState] = useState<TreasuresState>({
    mysteres: [],
    currentIndex: 0,
    loading: true,
    error: null,
    userProgress: {},
    currentLives: TOTAL_LIVES,
    isLocked: false,
    lockEndTime: null
  });

  // États pour l'expérience verticale
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  // Références
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  // Hook pour le swipe tactile
  const swipeRef = useSwipe({
    onSwipeLeft: () => handleCardChange('next'),
    onSwipeRight: () => handleCardChange('prev')
  });

  // Récupérer l'utilisateur courant
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Charger les données initiales
  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const user = await getCurrentUser();
      if (!user) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: "Vous devez être connecté pour accéder aux Trésors" 
        }));
        return;
      }

      // Charger les mystères et la progression en parallèle
      const [mysteresResponse, progressResponse] = await Promise.all([
        TreasuresService.getMysteres(0, MYSTERIES_PER_PAGE),
        TreasuresService.getUserProgress(user.id)
      ]);

      if (mysteresResponse.error) throw mysteresResponse.error;
      if (progressResponse.error) throw progressResponse.error;

      setState(prev => ({
        ...prev,
        mysteres: mysteresResponse.data || [],
        userProgress: progressResponse.data || {},
        loading: false
      }));

    } catch (error) {
      console.error('Error loading treasures data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erreur de chargement"
      }));
    }
  }, []);

  // Effet pour charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Navigation horizontale
  const handleCardChange = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'next' && state.currentIndex < state.mysteres.length - 1) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
      resetVerticalProgress();
    } else if (direction === 'prev' && state.currentIndex > 0) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
      resetVerticalProgress();
    }
  }, [state.currentIndex, state.mysteres.length]);

  // Réinitialiser la progression verticale
  const resetVerticalProgress = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCanScroll(false);
  };

  // Gérer la réponse à une question
  const handleAnswerSelect = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const currentMystere = state.mysteres[state.currentIndex];
    const currentQuestion = currentMystere.questions?.[currentQuestionIndex];
    
    if (!currentQuestion || !currentMystere) return;

    const isCorrect = TreasuresService.isCorrectAnswer(currentQuestion, answerIndex);
    const user = await getCurrentUser();
    
    if (!user) return;

    // Mettre à jour la progression avec la nouvelle structure
    await TreasuresService.updateProgress(user.id, currentMystere.id, isCorrect);

    // Recharger la progression pour obtenir les valeurs à jour
    const progressResponse = await TreasuresService.getUserProgress(user.id);
    if (!progressResponse.error) {
      setState(prev => ({
        ...prev,
        userProgress: progressResponse.data || {}
      }));
    }

    if (isCorrect) {
      // Bonne réponse - débloquer le scroll
      setShowExplanation(true);
      setCanScroll(true);
      
      if (currentQuestionIndex < 3) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setCanScroll(false);
        }, 2000);
      }
    } else {
      // Mauvaise réponse - vérifier si le cooldown est activé
      const updatedProgress = progressResponse.data?.[currentMystere.id];
      if (updatedProgress?.lives_remaining === 0) {
        setState(prev => ({
          ...prev,
          isLocked: true,
          lockEndTime: updatedProgress.locked_until ? new Date(updatedProgress.locked_until) : null
        }));
      }
      
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  // Lever le cooldown (QR Code)
  const handleLiftCooldown = async () => {
    const currentMystere = state.mysteres[state.currentIndex];
    const user = await getCurrentUser();
    
    if (!user || !currentMystere) return;

    await TreasuresService.liftCooldown(user.id, currentMystere.id);
    
    setState(prev => ({
      ...prev,
      isLocked: false,
      lockEndTime: null
    }));

    // Recharger la progression
    const progressResponse = await TreasuresService.getUserProgress(user.id);
    if (!progressResponse.error) {
      setState(prev => ({
        ...prev,
        userProgress: progressResponse.data || {}
      }));
    }
  };

  // Calculer les états dérivés
  const currentMystere = state.mysteres[state.currentIndex];
  const currentProgress = currentMystere ? state.userProgress[currentMystere.id] : undefined;
  const remainingLives = TreasuresService.getRemainingLives(currentProgress);
  const timeRemaining = state.lockEndTime ? TreasuresService.getTimeRemaining(state.lockEndTime.toISOString()) : '';
  const isInCooldown = currentProgress ? TreasuresService.checkCooldown(currentProgress) : false;

  // Animation du swipe horizontal
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-900">Chargement des Trésors...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4">{state.error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">
      {/* Header avec jauge de vies */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 px-4 py-3"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">Trésors</h1>
          <div className="flex items-center gap-1">
            {Array.from({ length: TOTAL_LIVES }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: i < remainingLives ? 1 : 0,
                  opacity: i < remainingLives ? 1 : 0.3
                }}
                className={`w-8 h-8 rounded-full ${
                  i < remainingLives 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.header>

      {/* Navigation horizontale */}
      <div className="pt-20 h-screen flex items-center">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Flèches de navigation */}
          <button
            onClick={() => handleCardChange('prev')}
            disabled={state.currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 shadow-lg disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleCardChange('next')}
            disabled={state.currentIndex === state.mysteres.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 shadow-lg disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carte mystère actuelle */}
          <AnimatePresence initial={false} custom={state.currentIndex}>
            <motion.div
              key={state.currentIndex}
              custom={state.currentIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              ref={swipeRef}
              className="relative h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {currentMystere && (
                <>
                  {/* Overlay de cooldown */}
                  {(isInCooldown || state.isLocked) && (
                    <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center text-white">
                      <Lock className="w-16 h-16 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Épreuve du Silence</h3>
                      <p className="text-lg mb-4">{timeRemaining || '48h 00min'}</p>
                      <button
                        onClick={handleLiftCooldown}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
                      >
                        <QrCode className="w-5 h-5" />
                        Scanner le QR Code partenaire
                      </button>
                    </div>
                  )}

                  {/* Contenu scrollable */}
                  <div 
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto"
                    style={{ scrollBehavior: canScroll ? 'smooth' : 'auto' }}
                  >
                    {/* En-tête de la carte */}
                    <div 
                      className="relative h-64 p-8 text-white"
                      style={{ 
                        background: `linear-gradient(135deg, #92400e, #92400edd)` 
                      }}
                    >
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
                        {currentMystere.theme?.name || 'Thème'}
                      </div>
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-6xl mb-4">{currentMystere.icon || '🎭'}</div>
                        <h2 className="text-3xl font-bold mb-2">{currentMystere.title}</h2>
                        <p className="text-lg opacity-90">{currentMystere.subtitle}</p>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i < (currentProgress?.current_step || 0) 
                                ? 'bg-white' 
                                : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mise en abyme */}
                    <div className="p-8 bg-gradient-to-b from-amber-50 to-white">
                      <div className="max-w-2xl mx-auto text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                          <Sparkles className="w-6 h-6 text-amber-500 mr-2" />
                          <h3 className="text-xl font-bold text-amber-900">L'Histoire</h3>
                          <Sparkles className="w-6 h-6 text-amber-500 ml-2" />
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {currentMystere.mise_en_abyme}
                        </p>
                      </div>

                      {/* Questions */}
                      {currentMystere.questions?.slice(0, currentQuestionIndex + 1).map((question, qIndex) => (
                        <motion.div
                          key={qIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: qIndex * 0.1 }}
                          className="max-w-2xl mx-auto mb-8"
                        >
                          {/* Fil de l'Initié */}
                          {qIndex > 0 && (
                            <div className="flex justify-center mb-6">
                              <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></div>
                            </div>
                          )}

                          {qIndex === currentQuestionIndex && (
                            <>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                                  {qIndex + 1}
                                </div>
                                <span className="text-sm text-gray-500">Étape {qIndex + 1} sur 4</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
                              <div className="space-y-3">
                                {TreasuresService.getQuestionOptions(question).map((option: string, oIndex: number) => (
                                  <button
                                    key={oIndex}
                                    onClick={() => handleAnswerSelect(oIndex)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${
                                      selectedAnswer === oIndex
                                        ? TreasuresService.isCorrectAnswer(question, oIndex)
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
                              <p className="text-gray-700 mb-4">{question.explication}</p>
                              {currentQuestionIndex < 3 && (
                                <div className="text-center">
                                  <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full mx-auto mb-4"></div>
                                  <p className="text-sm text-amber-600">Continuez de défiler pour la question suivante...</p>
                                </div>
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
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
