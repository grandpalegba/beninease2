"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { CategoryPattern } from "@/components/talents/CategoryPattern";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Mystere {
  id: string;
  theme_id: string;
  titre: string;
  description: string;
  periode: string;
  lieu: string;
  info_complementaire: string;
  fiche_tresor: string;
  image_url: string;
}

interface Question {
  id: string;
  mystere_id: string;
  numero: number;
  question_text: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explication: string;
}

interface Theme {
  id: string;
  nom: string;
  couleur: string;
  icone: string;
}

// ─── CSV Parser (no external dep) ────────────────────────────────────────────

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));
  return lines.slice(1).map((line) => {
    // Handle commas within values — simple split (our data uses commas only in descriptions w/ escaped commas)
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; }
      else { current += ch; }
    }
    values.push(current.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || "").replace(/\r/g, ""); });
    return obj;
  });
}

async function fetchCSV(path: string) {
  const res = await fetch(path);
  const text = await res.text();
  return parseCSV(text);
}

// ─── Sacred Jar Component ────────────────────────────────────────────────────

function SacredJar({ filledHoles }: { filledHoles: number }) {
  const holePositions = [
    { top: "42%", left: "28%" },
    { top: "35%", left: "55%" },
    { top: "65%", left: "38%" },
    { top: "58%", left: "68%" },
  ];

  return (
    <div className="relative w-52 h-[272px] flex-shrink-0 z-10">
      {/* Glow behind jar */}
      <div className="absolute -z-10 inset-0 scale-[1.4] bg-[#a0412d]/10 rounded-full blur-3xl" />

      {/* Vessel mouth */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-[50%] z-0"
        style={{
          background: "#3d1810",
          boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)",
          border: "3px solid rgba(160,65,45,0.3)",
        }}
      />

      {/* Vessel body */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)",
          borderRadius: "42% 38% 34% 36% / 45% 45% 32% 32%",
          boxShadow:
            "inset -8px -8px 20px rgba(0,0,0,0.22), inset 8px 8px 20px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Top shadow */}
        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-black/25 to-transparent" />

        {/* Holes */}
        {holePositions.map((pos, i) => {
          const isFilled = i < filledHoles;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={
                isFilled
                  ? { backgroundColor: "#7a2a1b", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3)" }
                  : { backgroundColor: "#2a100a", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8)" }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute rounded-full border border-black/10"
              style={{
                top: pos.top,
                left: pos.left,
                width: i === 2 ? "44px" : i === 0 ? "40px" : "36px",
                height: i === 2 ? "44px" : i === 0 ? "40px" : "36px",
                opacity: isFilled ? 0.85 : 0.9,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Seed / Life Display ──────────────────────────────────────────────────────

function LifeBar({ lives, shake }: { lives: number; shake: boolean }) {
  const renderHole = (i: number) => (
    <div
      key={i}
      className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-inner"
      style={{ backgroundColor: "#2a100a", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.8)" }}
    >
      <motion.div
        initial={false}
        animate={
          i < lives
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
        className="rounded-full w-2 h-2.5 md:w-2.5 md:h-3"
        style={{
          backgroundColor: "#fdb813",
          boxShadow: "0 0 8px rgba(253,184,19,0.9), 0 0 3px rgba(253,184,19,0.5)",
        }}
      />
    </div>
  );

  return (
    <motion.div
      animate={shake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-center"
    >
      <div
        className="p-3 rounded-[20px] flex items-center shadow-xl overflow-hidden relative"
        style={{ 
          background: "linear-gradient(to right, #5c3c35 0%, #4a2f29 48%, #1a0f0c 50%, #4a2f29 52%, #5c3c35 100%)",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)",
          border: "1px solid #3e241e"
        }}
      >
        <div className="flex">
          <div className="flex flex-col gap-2 md:gap-3 pr-2 border-r border-[#1a0f0c]">
            {Array.from({ length: 4 }).map((_, i) => renderHole(i))}
          </div>
          <div className="flex flex-col gap-2 md:gap-3 pl-2 border-l border-[#6b473f]">
            {Array.from({ length: 4 }).map((_, i) => renderHole(i + 4))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Choice Button ────────────────────────────────────────────────────────────

function ChoiceButton({
  letter,
  text,
  state,
  onClick,
  disabled,
}: {
  letter: string;
  text: string;
  state: "idle" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
}) {
  const colors = {
    idle: {
      bg: "#fff8e7",
      border: "#ffe082",
      label: "#fdb813",
      text: "#303333",
    },
    correct: {
      bg: "#d4edda",
      border: "#198754",
      label: "#198754",
      text: "#155724",
    },
    wrong: {
      bg: "#f8d7da",
      border: "#ac3149",
      label: "#ac3149",
      text: "#6f1325",
    },
  };
  const c = colors[state];

  return (
    <motion.div
      drag={!disabled}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (!disabled && (info.offset.y < -60 || Math.abs(info.offset.x) > 100)) {
          onClick();
        }
      }}
      className="w-full"
    >
      <motion.button
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        animate={
          state === "wrong"
            ? { x: [-4, 4, -4, 4, 0] }
            : { x: 0 }
        }
        transition={state === "wrong" ? { duration: 0.35 } : {}}
        className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 p-2 md:p-3 rounded-xl md:rounded-2xl text-center md:text-left w-full transition-all duration-200 relative z-20 shadow-sm"
        style={{
          backgroundColor: c.bg,
          border: `1.5px solid ${c.border === "transparent" ? "transparent" : c.border}`,
          cursor: disabled ? "default" : "grab",
        }}
      >
      <span
        className="w-6 h-6 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-md md:rounded-xl font-bold text-[10px] md:text-sm"
        style={{ backgroundColor: c.label, color: state === "idle" ? "#303333" : "#fff" }}
      >
        {letter}
      </span>
      <span className="text-[10px] md:text-sm font-medium leading-tight md:leading-snug" style={{ color: c.text }}>
        {text}
      </span>
      </motion.button>
    </motion.div>
  );
}

// ─── Locked Screen ────────────────────────────────────────────────────────────

function LockedScreen({ onPowerWord }: { onPowerWord: (word: string) => void }) {
  const [remaining, setRemaining] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const lockTime = localStorage.getItem("mystere_lock_time");
    if (!lockTime) return;
    const updateTimer = () => {
      const unlockAt = parseInt(lockTime) + 24 * 60 * 60 * 1000;
      const diff = unlockAt - Date.now();
      if (diff <= 0) {
        localStorage.removeItem("mystere_lock_time");
        window.location.reload();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6 py-10"
    >
      <div className="text-6xl">🔒</div>
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#a0412d" }}>
        Jarre Verrouillée
      </h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Vos 6 graines sacrées sont épuisées. La jarre se rouvre dans :
      </p>
      <div
        className="text-4xl font-black tabular-nums"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5c3c35" }}
      >
        {remaining || "Calcul…"}
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        <input
          type="text"
          placeholder="Entrer le mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-full text-center border-2 border-[#a0412d]/20 outline-none focus:border-[#a0412d] transition-all bg-transparent"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onPowerWord(password)}
          className="w-full px-8 py-3 rounded-full font-bold text-white text-sm tracking-wide shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a0412d, #5c3c35)",
            boxShadow: "0 8px 24px rgba(160,65,45,0.3)",
          }}
        >
          🌟 Déverrouiller la Jarre
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Treasure Card ────────────────────────────────────────────────────────────

function TreasureCard({
  mystere,
  points,
  onLiberate,
  isLiberated,
}: {
  mystere: Mystere;
  points: number;
  onLiberate: () => void;
  isLiberated: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto text-center pb-20"
    >
      {/* Flame separator */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #a0412d)" }} />
        <span className="text-2xl">🔥</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #a0412d)" }} />
      </div>

      <div>
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-2"
          style={{ color: "#a0412d", fontFamily: "'Inter', sans-serif" }}
        >
          Fiche Trésor
        </p>
        <h2
          className="text-4xl font-extrabold mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#3d1810" }}
        >
          {mystere.titre}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">{mystere.fiche_tresor}</p>
      </div>

      {/* Ritual phrase */}
      <div
        className="px-6 py-5 rounded-2xl border text-left w-full"
        style={{ background: "#fdf6f3", borderColor: "rgba(160,65,45,0.15)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a0412d" }}>
          Phrase Rituelle
        </p>
        <p className="text-sm italic text-gray-600 leading-relaxed">
          « Visualisez que le <strong>{mystere.titre}</strong> revient sur sa terre d'origine. »
        </p>
      </div>

      {/* Points display */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">⭐</span>
        <span className="text-3xl font-black" style={{ color: "#a0412d", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {points} pts
        </span>
        <span className="text-sm text-gray-400">accumulés</span>
      </div>

      {isLiberated ? (
        <div
          className="px-8 py-4 rounded-full font-bold text-sm tracking-wide"
          style={{ background: "#d4edda", color: "#198754", border: "1.5px solid #c3e6cb" }}
        >
          ✅ Trésor Libéré !
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLiberate}
          className="px-10 py-5 rounded-full font-bold text-white text-base tracking-wide shadow-xl"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: "linear-gradient(135deg, #a0412d 0%, #7a2a1b 100%)",
            boxShadow: "0 12px 30px rgba(160,65,45,0.3)",
          }}
        >
          🏺 Libérer le Trésor
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── Explanation Toast / Card ─────────────────────────────────────────────────

function ExplanationCard({
  text,
  questionNum,
  onContinue,
}: {
  text: string;
  questionNum: number;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className="rounded-2xl p-6 mb-6 border text-left"
        style={{ background: "#fdf6f3", borderColor: "rgba(160,65,45,0.2)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📖</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a0412d" }}>
            Connaissance ancestrale
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {questionNum < 4 ? "Swipe ↑ ou bouton pour la suite" : "Swipe ↑ pour la Fiche Trésor"}
        </span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="px-6 py-3 rounded-full font-bold text-white text-sm shadow-md"
          style={{
            background: "linear-gradient(135deg, #a0412d, #7a2a1b)",
            boxShadow: "0 6px 20px rgba(160,65,45,0.25)",
          }}
        >
          {questionNum < 4 ? "Question suivante →" : "Voir la Fiche Trésor →"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MystereDetailPage() {
  // Data
  const [mysteres, setMysteres] = useState<Mystere[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation
  const [mystereIndex, setMystereIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0); // 0-3
  const [showTreasure, setShowTreasure] = useState(false);

  // Game state
  const [lives, setLives] = useState(8);
  const [isLocked, setIsLocked] = useState(false);
  const [filledHoles, setFilledHoles] = useState(0); // 0-4
  const [choiceState, setChoiceState] = useState<Record<string, "idle" | "correct" | "wrong">>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [previousExplanation, setPreviousExplanation] = useState<{text: string; questionNum: number} | null>(null);
  const [points, setPoints] = useState(0);
  const [shakeLives, setShakeLives] = useState(false);
  const [isLiberated, setIsLiberated] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  // Swipe
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Load data ────────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([
      fetchCSV("/data/mysteres_rows.csv"),
      fetchCSV("/data/questions_rows.csv"),
      fetchCSV("/data/themes_rows.csv"),
    ]).then(([m, q, t]) => {
      setMysteres(m as unknown as Mystere[]);
      setQuestions(q as unknown as Question[]);
      setThemes(t as unknown as Theme[]);
      setLoading(false);
    });
  }, []);

  // ── Check lock status ─────────────────────────────────────────────────────────

  useEffect(() => {
    const lockTime = localStorage.getItem("mystere_lock_time");
    if (lockTime) {
      const unlockAt = parseInt(lockTime) + 24 * 60 * 60 * 1000;
      if (Date.now() < unlockAt) setIsLocked(true);
      else localStorage.removeItem("mystere_lock_time");
    }
    const savedLives = localStorage.getItem("mystere_lives");
    if (savedLives) setLives(parseInt(savedLives));
    const savedPoints = localStorage.getItem("mystere_points");
    if (savedPoints) setPoints(parseInt(savedPoints));
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────────

  const currentMystere = mysteres[mystereIndex];
  const currentQuestions = questions
    .filter((q) => q.mystere_id === currentMystere?.id)
    .sort((a, b) => Number(a.numero) - Number(b.numero));
  const currentQuestion = currentQuestions[questionIndex];
  const currentTheme = themes.find((t) => t.id === currentMystere?.theme_id);

  // Reset state on mystere change
  useEffect(() => {
    setQuestionIndex(0);
    setShowTreasure(false);
    setFilledHoles(0);
    setShowExplanation(false);
    setChoiceState({});
    setQuestionAnswered(false);
    const key = `mystere_liberated_${mysteres[mystereIndex]?.id}`;
    setIsLiberated(localStorage.getItem(key) === "true");
  }, [mystereIndex, mysteres]);

  // Reset choice state on question change
  useEffect(() => {
    setShowExplanation(false);
    setChoiceState({});
    setQuestionAnswered(false);
  }, [questionIndex]);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (choice: string) => {
      if (questionAnswered || isLocked) return;

      if (choice === currentQuestion.correct_answer) {
        // CORRECT
        setChoiceState({ [choice]: "correct" });
        setFilledHoles((h) => Math.min(h + 1, 4));
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.35, x: 0.5 },
          colors: ["#fdb813", "#ffffff", "#ffea00"],
          disableForReducedMotion: true,
          gravity: 1.2,
          ticks: 80,
          zIndex: 50
        });
        setPoints((p) => {
          const newP = p + 10;
          localStorage.setItem("mystere_points", String(newP));
          return newP;
        });
        setQuestionAnswered(true);

        // Auto-advance logic
        if (questionIndex < questions.length - 1) {
          setPreviousExplanation({
            text: currentQuestion.explication,
            questionNum: questionIndex + 1,
          });
          setTimeout(() => goNextQuestion(), 1500); // auto advance after 1.5s
        } else {
          // For the final question, we still show the explanation card before the Treasure
          setTimeout(() => setShowExplanation(true), 600);
        }
      } else {
        // WRONG
        setChoiceState((prev) => ({ ...prev, [choice]: "wrong" }));
        const newLives = lives - 1;
        setLives(newLives);
        localStorage.setItem("mystere_lives", String(newLives));
        setShakeLives(true);
        setTimeout(() => setShakeLives(false), 500);
        if (newLives <= 0) {
          localStorage.setItem("mystere_lock_time", String(Date.now()));
          setTimeout(() => setIsLocked(true), 800);
        }
      }
    },
    [currentQuestion, lives, questionAnswered, isLocked]
  );

  const goNextQuestion = useCallback(() => {
    if (questionIndex >= 3) {
      setShowTreasure(true);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }, [questionIndex]);

  const goNextMystere = useCallback(() => {
    setMystereIndex((i) => (i + 1) % mysteres.length);
  }, [mysteres.length]);

  const goPrevMystere = useCallback(() => {
    setMystereIndex((i) => (i - 1 + mysteres.length) % mysteres.length);
  }, [mysteres.length]);

  const handleLiberate = useCallback(async () => {
    const key = `mystere_liberated_${currentMystere?.id}`;
    localStorage.setItem(key, "true");
    setIsLiberated(true);
    setPoints((p) => {
      const newP = p + 10;
      localStorage.setItem("mystere_points", String(newP));
      return newP;
    });
    toast.success("✨ Trésor libéré ! +10 pts Bonus");
    await confetti(document.createElement("canvas"), {
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#fdb813", "#a0412d", "#5c3c35", "#FCD116", "#E8112D"],
    });
  }, [currentMystere]);

  const handlePowerWord = (word: string) => {
    if (word.trim().toLowerCase() === "benin") {
      localStorage.removeItem("mystere_lock_time");
      localStorage.setItem("mystere_lives", "6");
      setLives(6);
      setIsLocked(false);
      toast.success("🔐 Jarre déverrouillée !");
    } else {
      toast.error("❌ Mot de pouvoir incorrect");
    }
  };

  // ── Swipe handlers ────────────────────────────────────────────────────────────

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number; y: number } }) => {
      const THRESHOLD = 70;
      if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
        // Horizontal swipe → change mystere
        if (info.offset.x < -THRESHOLD) goNextMystere();
        else if (info.offset.x > THRESHOLD) goPrevMystere();
      } else {
        // Vertical swipe ↑ → next question (only if answered)
        if (info.offset.y < -THRESHOLD && questionAnswered) goNextQuestion();
      }
    },
    [goNextMystere, goPrevMystere, goNextQuestion, questionAnswered]
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf9f8" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin border-4 border-[#a0412d] border-t-transparent" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Invocation en cours…</p>
        </div>
      </div>
    );
  }

  if (!currentMystere) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf9f8" }}>
        <p className="text-gray-400">Aucun mystère trouvé.</p>
      </div>
    );
  }

  const choices = [
    { letter: "A", text: currentQuestion?.choice_a },
    { letter: "B", text: currentQuestion?.choice_b },
    { letter: "C", text: currentQuestion?.choice_c },
    { letter: "D", text: currentQuestion?.choice_d },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-16 md:pt-20 pb-28 md:pb-10 px-4 relative overflow-x-hidden"
      style={{ background: "#faf9f8", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Decorative circles (desktop) ────────────────────────────────── */}
      <div className="fixed top-1/2 -left-20 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden xl:block">
        <div className="w-72 h-72 border-[32px] border-[#a0412d] rounded-full" />
      </div>
      <div className="fixed top-1/4 -right-20 opacity-[0.04] pointer-events-none hidden xl:block">
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 bg-[#a0412d] rounded-full" />
          ))}
        </div>
      </div>

      {/* Navigation and layout are handled differently below */}

      {/* ── Main swipeable area ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mystereIndex}
          onPanEnd={handleDragEnd}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-2xl flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
        >
          {/* ── Theme + Title ──────────────────────────────────────────── */}
          <div className="text-center mb-4 md:mb-8 flex flex-col items-center">
            <h2 className="text-[#B8860B] text-sm md:text-base tracking-[0.3em] font-bold uppercase mb-6" style={{ fontFamily: "serif" }}>
              TRÉSORS DU BÉNIN
            </h2>
            
            {currentTheme && (
              <div className="inline-flex items-center justify-center gap-4 px-6 py-2 md:py-3 mb-4 rounded-full border border-black/5 shadow-sm bg-white">
                <CategoryPattern id={currentTheme.nom} />
                <span
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em]"
                  style={{ color: "#111827", fontFamily: "'Inter', sans-serif" }}
                >
                  {currentTheme.nom}
                </span>
                <CategoryPattern id={currentTheme.nom} className="rotate-180" />
              </div>
            )}
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#a0412d" }}
            >
              {currentMystere.titre}
            </h1>
            <div className="max-h-24 md:max-h-none overflow-y-auto px-2">
              <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                {currentMystere.description}
              </p>
            </div>
          </div>

          {/* ── Dashboard & Jar ──────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-4 md:gap-12 w-full mb-6 md:mb-10 px-2">
            {/* Left side: LifeBar & Points */}
            <div className="flex flex-col items-center justify-center gap-3 w-1/3">
              <LifeBar lives={lives} shake={shakeLives} />
              <motion.div
                key={points}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-md whitespace-nowrap"
                style={{ background: "#5c3c35", color: "#fdb813", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                ⭐ {points} pts
              </motion.div>
            </div>

            {/* Right side: Jar */}
            <div className="relative scale-[0.70] md:scale-100 origin-center h-[180px] md:h-[280px] w-40 md:w-52">
              <SacredJar filledHoles={filledHoles} />
            </div>
          </div>

          {/* ── Locked ───────────────────────────────────────────────────── */}
          {isLocked ? (
            <LockedScreen onPowerWord={handlePowerWord} />
          ) : showTreasure ? (
            /* ── Treasure Card ────────────────────────────────────────── */
            <TreasureCard
              mystere={currentMystere}
              points={points}
              onLiberate={handleLiberate}
              isLiberated={isLiberated}
            />
          ) : (
            /* ── Question + Choices ──────────────────────────────────── */
            <AnimatePresence mode="wait">
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                {/* Question text */}
                {currentQuestion && (
                  <div className="mb-6 text-center px-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#5d605f" }}>
                      Épreuve {questionIndex + 1} / 4
                    </p>
                    <h2
                      className="text-lg md:text-xl font-bold leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#303333" }}
                    >
                      {currentQuestion.question_text}
                    </h2>
                  </div>
                )}

                {/* Explanation card (after correct answer) */}
                {showExplanation && currentQuestion ? (
                  <ExplanationCard
                    text={currentQuestion.explication}
                    questionNum={questionIndex + 1}
                    onContinue={goNextQuestion}
                  />
                ) : (
                  /* Choices grid */
                  currentQuestion && (
                    <div className="flex flex-col items-center w-full">
                      <div className="grid grid-cols-2 gap-2 md:gap-3 w-full">
                        {choices.map(({ letter, text }) => {
                          if (!text) return null;
                          const state = choiceState[letter] || "idle";
                          return (
                            <ChoiceButton
                              key={letter}
                              letter={letter}
                              text={text}
                              state={state}
                              onClick={() => handleAnswer(letter)}
                              disabled={questionAnswered}
                            />
                          );
                        })}
                      </div>

                      {/* Explication de la question précédente */}
                      <AnimatePresence>
                        {previousExplanation && !questionAnswered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 w-full max-w-[300px] text-center border-t border-[#a0412d]/10 pt-4"
                          >
                            <p className="text-[10px] font-bold text-[#a0412d] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                              <span>📖</span> Révélation (Épreuve {previousExplanation.questionNum})
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {previousExplanation.text}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom nav hint ────────────────────────────────────────────── */}
      {!showTreasure && !isLocked && (
        <div className="mt-8 mb-4 px-6 py-2 rounded-full border border-[#B8860B]/30 bg-[#B8860B]/5 backdrop-blur-sm mx-auto flex items-center justify-center gap-3">
          <span className="text-[#B8860B] opacity-70">←</span>
          <p className="text-[10px] md:text-xs text-[#B8860B] font-bold tracking-widest uppercase mb-0">
            Swipe pour changer de mystère
          </p>
          <span className="text-[#B8860B] opacity-70">→</span>
        </div>
      )}
    </div>
  );
}
