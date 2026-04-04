import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DraggableAnswer from "./DraggableAnswer";

export default function MysteryCard({ mystere, onComplete }) {
  const [questionStep, setQuestionStep] = useState(0);
  const [lives, setLives] = useState(6);
  const [shakingChoice, setShakingChoice] = useState(null);
  const questionRefs = useRef([]);

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.droppableId !== "canari") return;
    
    const question = mystere.questions[questionStep];
    const correct = question.correct_answer;
    
    if (result.draggableId === correct) {
      setQuestionStep(prev => prev + 1);
      // Logic pour afficher EclairSavoir ici
    } else {
      setLives(l => l - 1);
      setShakingChoice(result.draggableId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden text-ivoire">
      <div className="p-4 border-b border-or-royal/20 flex justify-between">
        <h1 className="text-or-royal font-display uppercase">{mystere.title}</h1>
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < lives ? 'bg-or-royal' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="canari">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex justify-center py-10">
               {/* KnowledgeCanari Component ICI */}
               <div className="w-32 h-32 border-2 border-or-royal rounded-full flex items-center justify-center">CANARI</div>
               {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        <div className="px-6 space-y-20 pb-40">
          {mystere.questions.map((q, idx) => (
            <motion.div key={idx} animate={{ opacity: idx === questionStep ? 1 : 0.2 }}>
              <h2 className="text-center mb-8">{q.question}</h2>
              {idx === questionStep && (
                <Droppable droppableId="choices" isDropDisabled>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-4">
                      {q.choices.map((c, ci) => (
                        <DraggableAnswer 
                          key={c} 
                          choice={c} 
                          index={ci} 
                          isShaking={shakingChoice === c} 
                          onShakeEnd={() => setShakingChoice(null)} 
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </motion.div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
