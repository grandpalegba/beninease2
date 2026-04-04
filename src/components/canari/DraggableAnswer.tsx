import { motion } from "framer-motion";
import { Draggable } from "@hello-pangea/dnd";

const SHAPES = [
  "polygon(10% 0%, 90% 5%, 95% 40%, 85% 95%, 15% 90%, 0% 50%)",
  "polygon(5% 10%, 85% 0%, 100% 45%, 90% 100%, 10% 95%, 0% 55%)"
];

interface DraggableAnswerProps {
  choice: string;
  index: number;
  isShaking?: boolean;
  onShakeEnd?: () => void;
  isDragging?: boolean;
}

export default function DraggableAnswer({ 
  choice, 
  index, 
  isShaking = false, 
  onShakeEnd,
  isDragging = false
}: DraggableAnswerProps) {
  return (
    <Draggable draggableId={choice} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
          className="w-full"
        >
          <motion.div
            className={`px-4 py-3 text-sm font-medium transition-all duration-200 ${
              snapshot.isDragging 
                ? 'z-50 shadow-2xl scale-105 border-2 border-or-royal' 
                : 'border border-or-royal/30 hover:border-or-royal/60'
            } bg-terre-sombre text-ivoire`}
            style={{ 
              clipPath: SHAPES[index % 2],
              backgroundColor: snapshot.isDragging ? '#D4AF37' : '#1A1412'
            }}
            animate={isShaking ? { 
              x: [0, -5, 5, -5, 5, 0],
              rotate: [0, -2, 2, -2, 2, 0]
            } : {}}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
            onAnimationComplete={() => isShaking && onShakeEnd?.()}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
            }}
            whileTap={{ 
              scale: 0.98 
            }}
          >
            {choice}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
