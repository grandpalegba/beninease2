'use client';

/**
 * Trois symboles ethniques (inspirés des glyphes Adinkra/géométrie Fon)
 * remplaçant les pastilles vert/jaune/rouge du drapeau béninois.
 *
 * - Vert : Gye Nyame (omniprésence, sagesse) — étoile à 8 pointes stylisée
 * - Jaune : Sankofa (revenir aux racines) — spirale
 * - Rouge : Adinkrahene (chefferie, primauté) — cercles concentriques
 */
interface Props {
  size?: number;
  gap?: number;
}

const EthnicDots = ({ size = 14, gap = 8 }: Props) => (
  <div className="flex items-center" style={{ gap }}>
    {/* Vert — étoile à 8 pointes (Nyame Dua, sagesse) */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ color: "#008751" }}
    >
      <path
        d="M12 2 L14 9 L21 7 L16 12 L21 17 L14 15 L12 22 L10 15 L3 17 L8 12 L3 7 L10 9 Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="2" fill="#fff" />
    </svg>

    {/* Jaune — Sankofa (spirale, retour aux racines) */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ color: "#fcd116" }}
    >
      <path
        d="M12 3 a9 9 0 1 1 -9 9 a7 7 0 0 1 7 -7 a5 5 0 0 1 5 5 a3 3 0 0 1 -3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>

    {/* Rouge — Adinkrahene (cercles concentriques, autorité) */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ color: "#e8112d" }}
    >
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  </div>
);

export default EthnicDots;
