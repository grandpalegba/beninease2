"use client";

import Image from "next/image";

interface LiberationStatusProps {
  rarete: number;
  conservation: number;
  restitution: number;
  numero: number;
}

type Phase = {
  phase: string;
  message: string;
  color: string;
  borderColor: string;
  stepImg: string;
};

const PHASES: Phase[] = [
  {
    phase: "PHASE I",
    message: "GrandPa Legba lève le voile : le Trésor sort de l'oubli.",
    color: "#C97B2E",
    borderColor: "#C97B2E",
    stepImg: "/quest/step-1.png",
  },
  {
    phase: "PHASE II",
    message: "Nan Aïzan restaure la dignité du Trésor par le souffle sacré.",
    color: "#4A8C5C",
    borderColor: "#4A8C5C",
    stepImg: "/quest/step-2.png",
  },
  {
    phase: "PHASE III",
    message: "Abuela Wata porte le Trésor sur les courants du retour.",
    color: "#2563A8",
    borderColor: "#2563A8",
    stepImg: "/quest/step-3.png",
  },
  {
    phase: "PHASE IV",
    message: "Avô Heviosso foudroie les verrous qui retiennent le Trésor.",
    color: "#C0392B",
    borderColor: "#C0392B",
    stepImg: "/quest/step-4.png",
  },
  {
    phase: "PHASE V",
    message: "Baba Sakpata prépare la terre rouge à embrasser le Trésor.",
    color: "#8B4513",
    borderColor: "#8B4513",
    stepImg: "/quest/step-5.png",
  },
  {
    phase: "PHASE VI",
    message: "Yony couronne le retour : le Trésor respire à nouveau chez lui.",
    color: "#6D28D9",
    borderColor: "#6D28D9",
    stepImg: "/quest/step-6.png",
  },
];

export function LiberationStatus({ numero }: LiberationStatusProps) {
  const phaseIndex = (numero - 1) % 6;
  const phase = PHASES[phaseIndex];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "#F9F9F7",
        borderLeft: `4px solid ${phase.borderColor}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Œuf/Step : visualisation de la phase */}
        <div className="relative shrink-0 w-12 h-12">
          <Image
            src={phase.stepImg}
            alt={`Étape ${phaseIndex + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
            style={{ color: phase.color }}
          >
            {phase.phase} · Éveil du Trésor
          </p>
          <p className="text-xs leading-relaxed text-gray-500 italic">
            {phase.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiberationStatus;
