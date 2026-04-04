import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import KnowledgeCanari from "./KnowledgeCanari";
import DraggableAnswer from "./DraggableAnswer";
import EclairSavoir from "./EclairSavoir";
import CelebrationScreen from "./CelebrationScreen";
import SanctionScreen from "./SanctionScreen";
import type { Mystere } from "@/types/treasures";

interface MysteryCardProps {
  mystere: Mystere;
  onComplete: () => void;
}

export default function MysteryCard({ mystere, onComplete }: MysteryCardProps) {
  const [step, setStep] = useState(0);
  const [lives, setLives] = useState(6);
  const [eclairIdx, setEclairIdx] = useState<number | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [end, setEnd] = useState(false);
  const qRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (qRefs.current[step]) {
      qRefs.current[step]?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, [step]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    // Si déposé sur la jarre
    if (result.destination.droppableId === "canari") {
      const currentQuestion = mystere.questions?.[step];
      if (!currentQuestion) return;

      if (result.draggableId === currentQuestion.correct_answer) {
        // Bonne réponse
        const currentStep = step;
        setTimeout(() => { 
          setStep(s => s + 1); 
          setEclairIdx(currentStep); 
        }, 600);
      } else {
        // Mauvaise réponse
        setLives(l => l - 1); 
        setShake(result.draggableId);
      }
    }
  };

  const handleShakeEnd = () => {
    setShake(null);
  };

  const handleEclairContinue = () => {
    const isLast = eclairIdx === mystere.questions?.length! - 1;
    setEclairIdx(null); 
    if (isLast) {
      setEnd(true);
    }
  };

  if (lives <= 0) return <SanctionScreen />;

  return (
    <div className="h-full bg-gradient-to-b from-terre-sombre to-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-or-royal/20 flex justify-between sticky top-0 bg-terre-sombre/90 z-40 backdrop-blur-sm">
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

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto pb-40">
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Jarre Trouée */}
          <Droppable droppableId="canari">
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef} 
                {...provided.droppableProps} 
                className="flex justify-center py-6"
              >
                <KnowledgeCanari 
                  fillStep={step} 
                  isDropTarget={snapshot.isDraggingOver}
                  size="medium"
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Questions */}
          <div className="flex flex-col gap-20 px-6">
            {mystere.questions?.map((q, i) => (
              <div 
                key={q.id} 
                ref={el => qRefs.current[i] = el} 
                className={`transition-all duration-500 ${
                  i === step ? 'opacity-100' : 'opacity-20'
                }`}
              >
                <h2 className="text-ivoire text-center mb-8 text-lg font-medium leading-relaxed">
                  {q.question}
                </h2>
                
                {i === step ? (
                  // Zone de réponse active
                  <Droppable 
                    droppableId="choices" 
                    isDropDisabled={false}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps} 
                        className="grid grid-cols-2 gap-4"
                      >
                        {TreasuresService.getQuestionOptions(q).map((choice, choiceIndex) => (
                          <DraggableAnswer
                            key={choice}
                            choice={choice}
                            index={choiceIndex}
                            isShaking={shake === choice}
                            onShakeEnd={handleShakeEnd}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ) : i < step ? (
                  // Question déjà répondue - bouton pour relire
                  <div className="text-center">
                    <button 
                      onClick={() => setEclairIdx(i)} 
                      className="text-[10px] text-or-royal border border-or-royal/30 px-4 py-1 rounded-full hover:bg-or-royal/10 transition-all"
                    >
                      RELIRE L'ÉCLAIRAGE
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {eclairIdx !== null && (
          <EclairSavoir 
            holeIndex={eclairIdx} 
            onContinue={handleEclairContinue} 
          />
        )}
        {end && (
          <CelebrationScreen 
            artefact={{ 
              image_placeholder: mystere.icon,
              title: mystere.title 
            }} 
            onContinue={onComplete} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Import du service pour obtenir les options
import { TreasuresService } from "@/lib/treasures-service";
