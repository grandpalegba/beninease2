import { motion } from "framer-motion";
import { Draggable } from "@hello-pangea/dnd";

const ORGANIC_SHAPES = [
  "polygon(10% 0%, 90% 5%, 95% 40%, 85% 95%, 15% 90%, 0% 50%)",
  "polygon(5% 10%, 85% 0%, 100% 45%, 90% 100%, 10% 95%, 0% 55%)"
];

export default function DraggableAnswer({ choice, index, isShaking, onShakeEnd }) {
  const shape = ORGANIC_SHAPES[index % ORGANIC_SHAPES.length];
  
  return (
    <Draggable draggableId={choice} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <motion.div
            className={`relative px-5 py-3 cursor-grab bg-terre-sombre border border-or-royal/30 text-ivoire font-body text-sm ${snapshot.isDragging ? 'shadow-lg z-50 border-or-royal' : ''}`}
            style={{ clipPath: shape }}
            animate={isShaking ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            onAnimationComplete={() => isShaking && onShakeEnd()}
            whileHover={{ scale: 1.04 }}
          >
            <span className="relative z-10 pointer-events-none">{choice}</span>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
