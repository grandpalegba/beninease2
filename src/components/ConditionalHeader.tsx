"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRitual = searchParams?.get('ritual') === 'true';
  const hidesTop = isRitual || pathname?.startsWith('/sagesses') || pathname?.startsWith('/savoirs');
  const hidesHeader = 
    pathname?.includes('/mysteres/sato-challenge') || 
    pathname?.startsWith('/savoirs/sato-challenge') || 
    pathname?.includes('/savoirs/quiz') ||
    pathname?.includes('/talents/explorer') ||
    pathname?.includes('/sagesses/explorer');

  // Ne pas afficher le Header sur les rituels ou explorations immersives
  if (hidesHeader) {
    return null;
  }

  // Afficher le Header sur toutes les autres pages
  return <Header hideTop={hidesTop} />;
}
