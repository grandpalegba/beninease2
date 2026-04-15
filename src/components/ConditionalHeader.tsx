"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isSatoChallenge = pathname?.includes('/mysteres/sato-challenge');

  // Ne pas afficher le Header sur la page Sato Challenge
  if (isSatoChallenge) {
    return null;
  }

  // Afficher le Header sur toutes les autres pages
  return <Header />;
}
