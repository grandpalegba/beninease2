import { motion } from "framer-motion";

export default function SanctionScreen() {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-8xl mb-8 grayscale"
      >
        🤫
      </motion.div>
      
      <motion.h2 
        className="text-or-royal text-xl mb-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        LE RITUEL DU SILENCE
      </motion.h2>
      
      <motion.p 
        className="text-ivoire/60 italic mb-10 max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        "Les Ancêtres vous imposent un moment de silence. Votre esprit doit s'apaiser."
      </motion.p>
      
      <motion.button
        onClick={() => window.location.reload()}
        className="border border-or-royal text-or-royal px-8 py-2 rounded-full hover:bg-or-royal/10 transition-all"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Se retirer
      </motion.button>
    </motion.div>
  );
}
