"use client";

import Image from "next/image";

interface LiberationStatusProps {
  rarete: number;
  conservation: number;
  restitution: number;
  numero: number; // Utilisé pour varier la phase selon le trésor
}

type Phase = {
  phase: string;
  phaseNum: number;
  divinite: string;
  message: string;
  statut: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  deityImg: string; // Photo de l'entité
  stepImg: string;  // Œuf/obturateur de la phase
};

const PHASES: Phase[] = [
  {
    phase: "PHASE I",
    phaseNum: 1,
    divinite: "GRANDPA LEGBA",
    message: "GrandPa Legba lève le voile : le Trésor sort de l'oubli.",
    statut: "LOCALISÉ",
    color: "#C97B2E",
    borderColor: "#C97B2E",
    badgeBg: "#FEF3E2",
    badgeText: "#C97B2E",
    deityImg: "/quest/deity-legba.jpg",
    stepImg: "/quest/step-1.png",
  },
  {
    phase: "PHASE II",
    phaseNum: 2,
    divinite: "NAN AÏZAN",
    message: "Nan Aïzan restaure la dignité du Trésor par le souffle sacré.",
    statut: "SÉCURISÉ",
    color: "#4A8C5C",
    borderColor: "#4A8C5C",
    badgeBg: "#E9F5EE",
    badgeText: "#4A8C5C",
    deityImg: "/quest/deity-aizan.png",
    stepImg: "/quest/step-2.png",
  },
  {
    phase: "PHASE III",
    phaseNum: 3,
    divinite: "ABUELA WATA",
    message: "Abuela Wata porte le Trésor sur les courants du retour.",
    statut: "EN CHEMIN",
    color: "#2563A8",
    borderColor: "#2563A8",
    badgeBg: "#EEF4FD",
    badgeText: "#2563A8",
    deityImg: "/quest/deity-wata.jpg",
    stepImg: "/quest/step-3.png",
  },
  {
    phase: "PHASE IV",
    phaseNum: 4,
    divinite: "AVÔ HEVIOSSO",
    message: "Avô Heviosso foudroie les verrous qui retiennent le Trésor.",
    statut: "EN DÉLIVRANCE",
    color: "#C0392B",
    borderColor: "#C0392B",
    badgeBg: "#FDECEA",
    badgeText: "#C0392B",
    deityImg: "/quest/deity-heviosso.jpg",
    stepImg: "/quest/step-4.png",
  },
  {
    phase: "PHASE V",
    phaseNum: 5,
    divinite: "BABA SAKPATA",
    message: "Baba Sakpata prépare la terre rouge à embrasser le Trésor.",
    statut: "RECONNU",
    color: "#8B4513",
    borderColor: "#8B4513",
    badgeBg: "#F5EBE0",
    badgeText: "#8B4513",
    deityImg: "/quest/deity-sakpata.jpg",
    stepImg: "/quest/step-5.png",
  },
  {
    phase: "PHASE VI",
    phaseNum: 6,
    divinite: "YONY",
    message: "Yony couronne le retour : le Trésor respire à nouveau chez lui.",
    statut: "LIBÉRÉ",
    color: "#6D28D9",
    borderColor: "#6D28D9",
    badgeBg: "#F3F0FF",
    badgeText: "#6D28D9",
    deityImg: "/quest/deity-yony.png",
    stepImg: "/quest/step-6.png",
  },
];

export function LiberationStatus({ rarete, conservation, restitution, numero }: LiberationStatusProps) {
  // Phase déterminée par le numéro du trésor (modulo 6) → variation garantie entre trésors
  const phaseIndex = (numero - 1) % 6;
  const phase = PHASES[phaseIndex];

  // Score affiché = moyenne des métriques
  const score = Math.round((rarete + conservation + restitution) / 3);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "#F9F9F7",
        borderLeft: `4px solid ${phase.borderColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3 p-4">

        {/* Œuf/Step : visualisation de la phase */}
        <div className="relative shrink-0 w-12 h-12">
          <Image
            src={phase.stepImg}
            alt={`Étape ${phase.phaseNum}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Photo de l'entité */}
        <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md border-2 border-white">
          <Image
            src={phase.deityImg}
            alt={phase.divinite}
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Texte central */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-black uppercase tracking-[0.25em] mb-0.5"
            style={{ color: phase.color }}
          >
            {phase.phase} · Éveil du Trésor
          </p>
          <p
            className="font-black text-sm uppercase tracking-wider leading-tight truncate"
            style={{ color: "#1A1A1A" }}
          >
            {phase.divinite}
          </p>
          <p
            className="text-[11px] mt-0.5 leading-relaxed text-gray-500 italic line-clamp-2"
          >
            {phase.message}
          </p>
        </div>

        {/* Badge Statut */}
        <div className="shrink-0">
          <span
            className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg whitespace-nowrap"
            style={{ background: phase.badgeBg, color: phase.badgeText }}
          >
            {phase.statut}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-4 mb-3">
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              background: `linear-gradient(to right, ${phase.color}88, ${phase.color})`,
            }}
          />
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 text-right">
          Score de libération : {score}%
        </p>
      </div>
    </div>
  );
}

export default LiberationStatus;
