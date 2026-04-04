import { motion } from "framer-motion";

interface CelebrationScreenProps {
  artefact: {
    image_placeholder?: string;
    title?: string;
  };
  onContinue: () => void;
}

export default function CelebrationScreen({ artefact, onContinue }: CelebrationScreenProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-terre-sombre to-black p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Artefact animé */}
      <motion.div 
        className="text-7xl mb-8 filter drop-shadow-2xl"
        animate={{ 
          y: [-20, 0, -20],
          rotate: [-5, 5, -5]
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      >
        {artefact.image_placeholder || '🏺'}
      </motion.div>

      {/* Danse des ancêtres */}
      <div className="flex gap-10 items-end mb-10">
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ 
            repeat: Infinity, 
            duration: 0.6,
            ease: "easeOut"
          }}
          className="text-center"
        >
          <div className="text-4xl">👶🏾</div>
          <span className="block text-[10px] text-or-royal font-bold mt-1">Kirikou</span>
        </motion.div>
        
        {/* Jarre centrale */}
        <motion.div 
          className="w-16 h-20 rounded-full border-2 border-or-royal bg-or-royal/20 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px rgba(212, 175, 55, 0.3)",
              "0 0 40px rgba(212, 175, 55, 0.6)",
              "0 0 20px rgba(212, 175, 55, 0.3)"
            ]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <span className="text-2xl">🏺</span>
        </motion.div>
        
        <motion.div 
          animate={{ rotate: [-10, 10, -10] }} 
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <div className="text-4xl">👴🏾</div>
          <span className="block text-[10px] text-or-royal font-bold mt-1">L'Ancêtre</span>
        </motion.div>
      </div>

      {/* Messages */}
      <motion.h2 
        className="text-or-royal text-xl font-bold mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        LES ANCÊTRES SONT FIERS !
      </motion.h2>
      
      <motion.p 
        className="text-ivoire/70 italic mb-8 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        "Vous avez contribué à la libération d'un Trésor de notre nation."
      </motion.p>
      
      <motion.button
        onClick={onContinue}
        className="bg-or-royal text-black px-10 py-3 rounded-full font-bold hover:bg-or-royal/90 transition-all"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        L'Aventure Continue
      </motion.button>
    </motion.div>
  );
}
