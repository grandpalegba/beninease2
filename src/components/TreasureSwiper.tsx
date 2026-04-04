"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Trophy, Lock, QrCode } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import type { Mystere, UserTreasure } from "@/types/treasures";

interface TreasureSwiperProps {
  mysteres: Mystere[];
  loading?: boolean;
  onScrollEnd?: () => void;
}

export default function TreasureSwiper({ mysteres, loading = false, onScrollEnd }: TreasureSwiperProps) {
  console.log('🎯 TreasureSwiper render - mysteres:', mysteres.length, 'loading:', loading);
  
  if (!mysteres || mysteres.length === 0) {
    console.log('❌ No mysteres to display');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
        <p className="text-gray-600">Aucun trésor à découvrir.</p>
      </div>
    );
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    startIndex: 0,
    containScroll: "trimSnaps"
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [hasTriggeredLoad, setHasTriggeredLoad] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, UserTreasure>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Récupérer l'utilisateur courant
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // Charger la progression utilisateur
  useEffect(() => {
    const loadProgress = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      
      const progressResponse = await TreasuresService.getUserProgress(user.id);
      if (!progressResponse.error) {
        setUserProgress(progressResponse.data || {});
      }
    };
    
    loadProgress();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setCurrentIndex(currentIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    
    // Reset vertical progress when changing card
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    
    // Trigger lazy loading when approaching end
    if (currentIndex >= mysteres.length - 3 && onScrollEnd && !hasTriggeredLoad) {
      setHasTriggeredLoad(true);
      onScrollEnd();
      // Reset trigger after delay to prevent multiple calls
      setTimeout(() => setHasTriggeredLoad(false), 2000);
    }
  }, [emblaApi, mysteres.length, onScrollEnd, hasTriggeredLoad]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Gérer la réponse à une question
  const handleAnswerSelect = async (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentMystere = mysteres[currentIndex];
    const currentQuestion = currentMystere.questions?.[currentQuestionIndex];
    
    if (!currentQuestion || !currentMystere) return;

    const isCorrect = TreasuresService.isCorrectAnswer(currentQuestion, answerIndex);
    const user = await getCurrentUser();
    
    if (!user) return;

    // Mettre à jour la progression
    await TreasuresService.updateProgress(user.id, currentMystere.id, isCorrect);

    // Recharger la progression
    const progressResponse = await TreasuresService.getUserProgress(user.id);
    if (!progressResponse.error) {
      setUserProgress(progressResponse.data || {});
    }

    // Auto-advance to next question if correct
    if (isCorrect && currentQuestionIndex < 3) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }, 2000);
    }
  };

  // Lever le cooldown
  const handleLiftCooldown = async () => {
    const currentMystere = mysteres[currentIndex];
    const user = await getCurrentUser();
    
    if (!user || !currentMystere) return;

    await TreasuresService.liftCooldown(user.id, currentMystere.id);
    
    // Recharger la progression
    const progressResponse = await TreasuresService.getUserProgress(user.id);
    if (!progressResponse.error) {
      setUserProgress(progressResponse.data || {});
    }
  };

  const currentMystere = mysteres[currentIndex];
  const currentProgress = currentMystere ? userProgress[currentMystere.id] : undefined;
  const remainingLives = TreasuresService.getRemainingLives(currentProgress);
  const isInCooldown = currentProgress ? TreasuresService.checkCooldown(currentProgress) : false;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header avec jauge de vies */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">Trésors</h1>
          <div className="flex items-center gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
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
      </div>

      {/* INDICATEUR DE PROGRESSION */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {mysteres.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-amber-500 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* CONTROLES NAVIGATION */}
      <div className="fixed bottom-10 right-6 z-40 flex flex-col gap-4">
        <button 
          onClick={scrollPrev} 
          disabled={!canScrollPrev}
          className="p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white disabled:opacity-30 shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={scrollNext} 
          disabled={!canScrollNext}
          className="p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white disabled:opacity-30 shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="embla overflow-hidden h-screen pt-20" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {mysteres.map((mystere: Mystere, index) => (
            <div key={mystere.id} className="embla__slide flex-[0_0_100%] min-w-0 h-full overflow-y-auto">
              <TreasureCard
                mystere={mystere}
                userProgress={userProgress[mystere.id]}
                currentQuestionIndex={currentQuestionIndex}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                onAnswerSelect={handleAnswerSelect}
                onLiftCooldown={handleLiftCooldown}
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant de carte individuelle
interface TreasureCardProps {
  mystere: Mystere;
  userProgress?: UserTreasure;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  onLiftCooldown: () => void;
  isActive: boolean;
}

function TreasureCard({ 
  mystere, 
  userProgress, 
  currentQuestionIndex, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect, 
  onLiftCooldown,
  isActive 
}: TreasureCardProps) {
  const isInCooldown = userProgress ? TreasuresService.checkCooldown(userProgress) : false;
  const timeRemaining = userProgress?.locked_until ? TreasuresService.getTimeRemaining(userProgress.locked_until) : '';

  return (
    <div className="relative h-full bg-white">
      {/* Overlay de cooldown */}
      {isInCooldown && (
        <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center text-white">
          <Lock className="w-16 h-16 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Épreuve du Silence</h3>
          <p className="text-lg mb-4">{timeRemaining || '48h 00min'}</p>
          <button
            onClick={onLiftCooldown}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
          >
            <QrCode className="w-5 h-5" />
            Scanner le QR Code partenaire
          </button>
        </div>
      )}

      {/* En-tête de la carte */}
      <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-600 p-8 text-white">
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
          {mystere.theme?.name || 'Thème'}
        </div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-6xl mb-4">{mystere.icon || '🎭'}</div>
          <h2 className="text-3xl font-bold mb-2">{mystere.title}</h2>
          <p className="text-lg opacity-90">{mystere.subtitle}</p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < (userProgress?.current_step || 0) 
                  ? 'bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="relative p-8 bg-gradient-to-b from-amber-50 to-white">
        {/* Fil Doré */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-orange-400"></div>

        {/* Mise en abyme */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-amber-500 mr-2" />
            <h3 className="text-xl font-bold text-amber-900">L'Histoire</h3>
            <Sparkles className="w-6 h-6 text-amber-500 ml-2" />
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {mystere.mise_en_abyme}
          </p>
        </div>

        {/* Questions */}
        {mystere.questions?.slice(0, currentQuestionIndex + 1).map((question, qIndex) => (
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qIndex * 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            {/* Point de connexion au Fil Doré */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-lg"></div>
                {qIndex < currentQuestionIndex && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 48 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-amber-400 to-orange-400"
                  />
                )}
              </div>
              
              <div className="flex-1">
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
                        <motion.button
                          key={oIndex}
                          onClick={() => onAnswerSelect(oIndex)}
                          disabled={selectedAnswer !== null}
                          whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-full text-left transition-all ${
                            selectedAnswer === oIndex
                              ? TreasuresService.isCorrectAnswer(question, oIndex)
                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-600'
                                : 'bg-gradient-to-r from-red-400 to-red-500 text-white border-2 border-red-600'
                              : 'bg-gray-100 hover:bg-gray-200 border-2 border-gray-300'
                          }`}
                          style={{
                            borderRadius: '9999px' // Style Cauris
                          }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                {/* Explication après réponse */}
                {showResult && qIndex === currentQuestionIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-amber-50 rounded-2xl border border-amber-200"
                  >
                    <p className="text-gray-700 mb-4">{question.explanation}</p>
                    {currentQuestionIndex === 3 && (
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-amber-900 mb-2">Trésor Conquis !</h4>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
