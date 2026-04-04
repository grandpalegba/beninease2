import { motion } from "framer-motion";

const DATA = [
  { 
    t: "La Fraternité", 
    p: "Le Roi Guézo voyait son peuple comme les doigts d'une main. La Jarre Trouée symbolise que seule l'union retient l'eau de la prospérité." 
  },
  { 
    t: "Le Devoir", 
    p: "Chaque enfant du Bénin est un porteur d'argile. Boucher un trou, c'est restaurer une vérité oubliée." 
  },
  { 
    t: "L'Asen", 
    p: "L'Asen relie les vivants aux ancêtres. En bouchant ce trou, vous réveillez un lien sacré." 
  },
  { 
    t: "Le Trésor", 
    p: "La jarre est pleine. Vous avez prouvé que votre esprit est prêt à porter l'héritage de notre nation." 
  }
];

interface EclairSavoirProps {
  holeIndex: number;
  onContinue: () => void;
}

export default function EclairSavoir({ holeIndex, onContinue }: EclairSavoirProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-terre-sombre border border-or-royal p-8 rounded-2xl text-center max-w-xs"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-or-royal/20 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <span className="text-2xl">✨</span>
        </motion.div>
        
        <h3 className="text-or-royal font-bold mb-4 uppercase tracking-wider text-lg">
          {DATA[holeIndex]?.t}
        </h3>
        <p className="text-ivoire/80 italic text-sm mb-8 leading-relaxed">
          "{DATA[holeIndex]?.p}"
        </p>
        
        <motion.button
          onClick={onContinue}
          className="bg-or-royal text-black px-6 py-2 rounded-full font-bold hover:bg-or-royal/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Je poursuis le rite
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
