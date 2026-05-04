"use client";

import Image from "next/image";

interface LiberationStatusProps {
  rarete: number;
  conservation: number;
  restitution: number;
}

type Phase = {
  phase: string;
  divinite: string;
  message: string;
  statut: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
};

function getPhase(score: number): Phase {
  if (score <= 16) {
    return {
      phase: "PHASE I",
      divinite: "GRANDPA LEGBA",
      message: "GrandPa Legba lève le voile : le Trésor sort de l'oubli.",
      statut: "LOCALISÉ",
      color: "#C97B2E",
      borderColor: "#C97B2E",
      badgeBg: "#FEF3E2",
      badgeText: "#C97B2E",
      icon: "/quest/emblem-legba.png",
    };
  }
  if (score <= 33) {
    return {
      phase: "PHASE II",
      divinite: "NAN AÏZAN",
      message: "Nan Aïzan restaure la dignité du Trésor par le souffle sacré.",
      statut: "SÉCURISÉ",
      color: "#4A8C5C",
      borderColor: "#4A8C5C",
      badgeBg: "#E9F5EE",
      badgeText: "#4A8C5C",
      icon: "/quest/deity-aizan.png",
    };
  }
  if (score <= 50) {
    return {
      phase: "PHASE III",
      divinite: "ABUELA WATA",
      message: "Abuela Wata porte le Trésor sur les courants du retour.",
      statut: "EN CHEMIN",
      color: "#2563A8",
      borderColor: "#2563A8",
      badgeBg: "#EEF4FD",
      badgeText: "#2563A8",
      icon: "/quest/emblem-wata.png",
    };
  }
  if (score <= 67) {
    return {
      phase: "PHASE IV",
      divinite: "AVÔ HEVIOSSO",
      message: "Avô Heviosso foudroie les verrous qui retiennent le Trésor.",
      statut: "EN DÉLIVRANCE",
      color: "#C0392B",
      borderColor: "#C0392B",
      badgeBg: "#FDECEA",
      badgeText: "#C0392B",
      icon: "/quest/emblem-heviosso.png",
    };
  }
  if (score <= 84) {
    return {
      phase: "PHASE V",
      divinite: "BABA SAKPATA",
      message: "Baba Sakpata prépare la terre rouge à embrasser le Trésor.",
      statut: "RECONNU",
      color: "#8B4513",
      borderColor: "#8B4513",
      badgeBg: "#F5EBE0",
      badgeText: "#8B4513",
      icon: "/quest/emblem-sakpata.png",
    };
  }
  return {
    phase: "PHASE VI",
    divinite: "YONY",
    message: "Yony couronne le retour : le Trésor respire à nouveau chez lui.",
    statut: "LIBÉRÉ",
    color: "#6D28D9",
    borderColor: "#6D28D9",
    badgeBg: "#F3F0FF",
    badgeText: "#6D28D9",
    icon: "/quest/deity-yony.png",
  };
}

export function LiberationStatus({ rarete, conservation, restitution }: LiberationStatusProps) {
  const score = Math.round((rarete + conservation + restitution) / 3);
  const phase = getPhase(score);

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
        {/* Icône Divinité */}
        <div
          className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-md border-2 border-white"
          style={{ background: phase.badgeBg }}
        >
          <Image
            src={phase.icon}
            alt={phase.divinite}
            fill
            className="object-cover"
          />
        </div>

        {/* Texte central */}
        <div className="flex-1 min-w-0">
          {/* Badge phase */}
          <p
            className="text-[9px] font-black uppercase tracking-[0.25em] mb-0.5"
            style={{ color: phase.color }}
          >
            {phase.phase} · Éveil du Trésor
          </p>

          {/* Nom Divinité */}
          <p
            className="font-black text-sm uppercase tracking-wider leading-tight"
            style={{ color: "#1A1A1A", letterSpacing: "1px" }}
          >
            {phase.divinite}
          </p>

          {/* Message narratif */}
          <p
            className="text-xs mt-1 leading-relaxed"
            style={{ fontStyle: "italic", color: "#555" }}
          >
            {phase.message}
          </p>
        </div>

        {/* Badge Statut */}
        <div className="shrink-0">
          <span
            className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg whitespace-nowrap"
            style={{
              background: phase.badgeBg,
              color: phase.badgeText,
            }}
          >
            {phase.statut}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mx-5 mb-4">
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              background: `linear-gradient(to right, ${phase.color}88, ${phase.color})`,
            }}
          />
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 text-right">
          Score de libération : {score}%
        </p>
      </div>
    </div>
  );
}

export default LiberationStatus;
