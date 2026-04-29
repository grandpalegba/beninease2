"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRitual = searchParams?.get('ritual') === 'true';
  const isSatoChallenge = pathname?.includes('/mysteres/sato-challenge') || pathname?.startsWith('/savoirs/sato-challenge') || pathname?.includes('/savoirs/quiz');

  // Ne pas afficher le Header sur la page Sato Challenge
  if (isSatoChallenge) {
    return null;
  }

  // Afficher le Header sur toutes les autres pages
  return <Header hideTop={isRitual} />;
}
