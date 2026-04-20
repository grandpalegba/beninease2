'use client';

import { motion } from "framer-motion";
import { resolveFaSign, type SignMeaning } from "@/data/signMeanings";

interface Props {
  signXIdx: number;
  signYIdx: number;
  /** Compact mode: smaller image, shorter text */
  compact?: boolean;
  /** Fallback context used when no curated meaning exists yet */
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}

/**
 * Displays the authentic Fa sign representation extracted from the PDF
 * along with its reformulated meaning (proverb, essence, vigilance, engagement).
 */
const SignDisplay = ({
  signXIdx,
  signYIdx,
  compact = false,
  signXName,
  signYName,
  dynamicWord,
}: Props) => {
  const meaning: SignMeaning | null = resolveFaSign(signXIdx, signYIdx);

  const combinedName =
    meaning?.name ??
    (signXName && signYName ? `${signXName}-${signYName}` : "Signe combiné");

  const fallbackEssence = buildFallbackEssence({
    signXName,
    signYName,
    dynamicWord,
  });

  const essence = meaning?.essence?.trim() || fallbackEssence;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="font-body rounded-xl p-6 flex flex-col"
      style={{
        background: "#ffffff",
        boxShadow: "inset 0 0 0 1px rgba(172, 173, 173, 0.25)",
        minHeight: "260px",
      }}
    >
      <h4
        className="font-headline text-2xl md:text-3xl leading-tight mb-4"
        style={{ color: "#00693e" }}
      >
        {combinedName}
      </h4>
      <p
        className="text-sm md:text-base leading-relaxed"
        style={{ color: "rgba(45, 47, 47, 0.9)" }}
      >
        {essence}
      </p>
    </motion.div>
  );
};

function buildFallbackEssence({
  signXName,
  signYName,
  dynamicWord,
}: {
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}): string {
  if (signXName && signYName && dynamicWord) {
    return `Ce signe combine la force de ${signXName} et celle de ${signYName}. Leur rencontre dessine une voie d'${dynamicWord.toLowerCase()} : un appel à honorer ce qui, en toi, cherche à s'accorder. Écoute ce que cette tension intérieure veut révéler — c'est là que se trouve ta réponse.`;
  }
  if (signXName && signYName) {
    return `La rencontre de ${signXName} et ${signYName} ouvre un passage singulier. Prends le temps d'observer ce qui s'éveille en toi à la lecture de ce signe : la sagesse du Fâ se reçoit autant qu'elle se déchiffre.`;
  }
  return "Ce signe t'invite à un temps d'écoute intérieure. Ce qui se présente à toi en ce moment porte une parole — accueille-la sans hâte.";
}

export default SignDisplay;
