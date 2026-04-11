"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { confetti } from "tsparticles-confetti";
import { toast } from "sonner";
import { HourglassTimer } from "@/components/mysteres/HourglassTimer";

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

// ─── CSV Parser ────────────────────────────────────────────────────────────

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));
  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQuotes = !inQuotes;
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

// ─── Shared Components ───────────────────────────────────────────────────────

function SacredJar({ filledHoles }: { filledHoles: number }) {
  const holePositions = [
    { top: "42%", left: "28%" },
    { top: "35%", left: "55%" },
    { top: "65%", left: "38%" },
    { top: "58%", left: "68%" },
  ];
  return (
    <div className="relative w-52 h-[272px] flex-shrink-0 z-10">
      <div className="absolute -z-10 inset-0 scale-[1.4] bg-[#a0412d]/10 rounded-full blur-3xl" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-[50%] z-0" style={{ background: "#3d1810", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)", border: "3px solid rgba(160,65,45,0.3)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)", borderRadius: "42% 38% 34% 36% / 45% 45% 32% 32%", boxShadow: "inset -8px -8px 20px rgba(0,0,0,0.22), inset 8px 8px 20px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.15)" }}>
        {holePositions.map((pos, i) => (
          <motion.div key={i} animate={i < filledHoles ? { backgroundColor: "#7a2a1b" } : { backgroundColor: "#2a100a" }} className="absolute rounded-full border border-black/10" style={{ top: pos.top, left: pos.left, width: i === 2 ? "44px" : "40px", height: i === 2 ? "44px" : "40px" }} />
        ))}
      </div>
    </div>
  );
}

function LifeBar({ lives, shake }: { lives: number; shake: boolean }) {
  const renderHole = (i: number) => (
    <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: "#2a100a", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.8)" }}>
      <motion.div animate={i < lives ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} className="rounded-full w-2 h-2.5 md:w-2.5 md:h-3" style={{ backgroundColor: "#fdb813", boxShadow: "0 0 8px rgba(253,184,19,0.9)" }} />
    </div>
  );
  return (
    <motion.div animate={shake ? { x: [-6, 6, -5, 5, 0] } : { x: 0 }} className="p-3 rounded-[20px] flex gap-2" style={{ background: "#5c3c35", border: "1px solid #3e241e" }}>
      <div className="flex flex-col gap-2">{[0,1,2,3].map(renderHole)}</div>
      <div className="flex flex-col gap-2">{[4,5,6,7].map(renderHole)}</div>
    </motion.div>
  );
}

function ChoiceButton({ letter, text, state, onClick, disabled }: any) {
  const colors: any = { idle: { bg: "rgba(160, 65, 45, 0.06)", border: "rgba(160, 65, 45, 0.2)", label: "#a0412d" }, correct: { bg: "#d4edda", border: "#198754", label: "#198754" }, wrong: { bg: "#f8d7da", border: "#ac3149", label: "#ac3149" } };
  const c = colors[state];
  return (
    <motion.button disabled={disabled} whileHover={!disabled ? { scale: 1.02 } : {}} whileTap={!disabled ? { scale: 0.98 } : {}} onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl w-full border-2" style={{ backgroundColor: c.bg, borderColor: c.border }}>
      <span className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-white" style={{ backgroundColor: c.label }}>{letter}</span>
      <span className="text-sm font-medium">{text}</span>
    </motion.button>
  );
}

function TreasureCard({ mystere, points, onLiberate, isLiberated }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full max-w-lg text-center pb-12">
      <div className="w-16 h-1 bg-[#a0412d]/ 20 rounded-full" />
      <div>
        {!isLiberated && <p className="text-xs font-bold text-[#a0412d] uppercase tracking-widest mb-2">Fiche Trésor</p>}
        <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{mystere.titre}</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">{mystere.fiche_tresor}</p>
      </div>

      {!isLiberated && (
        <div className="px-6 py-4 rounded-2xl bg-[#fdf6f3] border border-[#a0412d]/10 w-full text-left italic text-gray-600 text-sm">
          « Visualisez que le <strong>{mystere.titre}</strong> revient sur sa terre d'origine. »
        </div>
      )}

      <motion.button 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        onClick={onLiberate} 
        className="px-10 py-5 rounded-full font-bold text-white shadow-2xl" 
        style={{ background: "linear-gradient(135deg, #a0412d, #7a2a1b)", boxShadow: "0 12px 36px rgba(160,65,45,0.4)" }}
      >
        {isLiberated ? "✨ Partager cette Fiche" : "🏺 Libérer le Trésor"}
      </motion.button>
    </motion.div>
  );
}

function LockedScreen({ onPowerWord }: any) {
  const [pass, setPass] = useState("");
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <span className="text-6xl">🔒</span>
      <h2 className="text-2xl font-bold text-[#a0412d]">Jarre Verrouillée</h2>
      <p className="text-sm text-gray-500 max-w-xs">Vos graines sacrées sont épuisées. Revenez dans 24h ou entrez le mot de pouvoir.</p>
      <input type="text" placeholder="Mot de pouvoir" value={pass} onChange={(e)=>setPass(e.target.value)} className="w-full max-w-xs px-4 py-3 rounded-full border-2 border-[#a0412d]/20 outline-none focus:border-[#a0412d]" />
      <button onClick={()=>onPowerWord(pass)} className="px-8 py-3 rounded-full bg-[#a0412d] text-white font-bold shadow-lg">Déverrouiller</button>
    </div>
  );
}

function ExplanationCard({ text, questionNum, onContinue }: any) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="p-6 rounded-2xl bg-[#fdf6f3] border border-[#a0412d]/10 mb-4">
        <p className="text-xs font-bold text-[#a0412d] uppercase tracking-widest mb-2 items-center flex gap-2"><span>📖</span> Révélation {questionNum}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
      <button onClick={onContinue} className="w-full py-4 rounded-full bg-[#a0412d] text-white font-bold shadow-md">
        {questionNum < 4 ? "Question suivante →" : "Voir le Trésor →"}
      </button>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function MystereDetailPage() {
  const [mysteres, setMysteres] = useState<Mystere[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mystereIndex, setMystereIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showTreasure, setShowTreasure] = useState(false);
  const [lives, setLives] = useState(8);
  const [isLocked, setIsLocked] = useState(false);
  const [filledHoles, setFilledHoles] = useState(0);
  const [choiceState, setChoiceState] = useState<any>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [points, setPoints] = useState(0);
  const [shakeLives, setShakeLives] = useState(false);
  const [isLiberated, setIsLiberated] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFlipping, setIsFlipping] = useState(false);
  const [answeredExplanations, setAnsweredExplanations] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([fetchCSV("/data/mysteres_rows.csv"), fetchCSV("/data/questions_rows.csv"), fetchCSV("/data/themes_rows.csv")])
      .then(([m, q, t]) => {
        setMysteres(m as any); setQuestions(q as any); setThemes(t as any);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const lockTime = localStorage.getItem("mystere_lock_time");
    if (lockTime && Date.now() < parseInt(lockTime) + 24*60*60*1000) setIsLocked(true);
    setLives(parseInt(localStorage.getItem("mystere_lives") || "8"));
    setPoints(parseInt(localStorage.getItem("mystere_points") || "0"));
  }, []);

  const currentMystere = mysteres[mystereIndex];
  const currentQuestions = questions.filter(q => q.mystere_id === currentMystere?.id).sort((a,b)=>Number(a.numero)-Number(b.numero));
  const currentQuestion = currentQuestions[questionIndex];

  useEffect(() => {
    if (!currentMystere) return;
    const key = `mystere_liberated_${currentMystere.id}`;
    const liberated = localStorage.getItem(key) === "true";
    setIsLiberated(liberated);
    if (liberated) {
      setAnsweredExplanations(currentQuestions.map(q => q.explication));
    } else {
      setAnsweredExplanations([]);
      setQuestionIndex(0);
      setShowTreasure(false);
      setFilledHoles(0);
      setChoiceState({});
    }
  }, [mystereIndex, currentMystere, currentQuestions]);

  useEffect(() => {
    if (isLocked || loading || questionAnswered || showExplanation || showTreasure || isLiberated) return;
    const id = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { handleTimeOut(); return 30; }
      return p - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [isLocked, loading, questionAnswered, showExplanation, showTreasure, isLiberated]);

  const handleTimeOut = useCallback(() => {
    setLives(p => {
      const n = Math.max(0, p - 1);
      localStorage.setItem("mystere_lives", String(n));
      if (n <= 0) { setIsLocked(true); localStorage.setItem("mystere_lock_time", String(Date.now())); }
      return n;
    });
    setShakeLives(true); setTimeout(() => setShakeLives(false), 500);
    setIsFlipping(true); setTimeout(() => setIsFlipping(false), 800);
    toast.error("⏳ Temps écoulé !");
  }, []);

  const handleAnswer = (choice: string) => {
    if (questionAnswered || isLocked) return;
    if (choice === currentQuestion.correct_answer) {
      setChoiceState({ [choice]: "correct" });
      setFilledHoles(h => Math.min(h+1, 4));
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.4 }, colors: ["#fdb813", "#ffffff"] });
      setPoints(p => { const n = p + 10; localStorage.setItem("mystere_points", String(n)); return n; });
      setAnsweredExplanations(prev => [...prev, currentQuestion.explication]);
      setQuestionAnswered(true);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 300);
      if (questionIndex < currentQuestions.length - 1) {
        setTimeout(() => { setQuestionIndex(i => i + 1); setChoiceState({}); setQuestionAnswered(false); setTimeLeft(30); }, 2000);
      } else {
        setTimeout(() => setShowExplanation(true), 1000);
      }
    } else {
      setChoiceState({ [choice]: "wrong" });
      setLives(p => { const n = p - 1; localStorage.setItem("mystere_lives", String(n)); return n; });
      setShakeLives(true); setTimeout(() => setShakeLives(false), 500);
    }
  };

  const handleLiberate = () => {
    localStorage.setItem(`mystere_liberated_${currentMystere.id}`, "true");
    setIsLiberated(true);
    setPoints(p => { const n = p + 50; localStorage.setItem("mystere_points", String(n)); return n; });
    toast.success("✨ Trésor libéré !");
  };

  const handleShare = () => {
    const text = `🏺 J'ai libéré le trésor "${currentMystere.titre}" sur BeninEase !\n\n📜 Révélations :\n${answeredExplanations.map((ex,i)=>`${i+1}. ${ex}`).join("\n")}`;
    if (navigator.share) navigator.share({ title: currentMystere.titre, text }).catch(console.error);
    else { navigator.clipboard.writeText(text); toast.success("📋 Copié !"); }
  };

  if (loading || !currentMystere) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 md:pt-12 px-4 pb-20" style={{ background: "#faf9f8", fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        <motion.div key={mystereIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl flex flex-col items-center">
          
          {isLiberated ? (
            /* ── Purified Editorial View ── */
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-[40vh] md:h-[50vh] relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
                {currentMystere.image_url ? <img src={currentMystere.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#5c3c35]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                  <h1 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{currentMystere.titre}</h1>
                </div>
              </div>
              <TreasureCard mystere={currentMystere} points={points} onLiberate={handleShare} isLiberated={true} />
              <div id="Revelations" className="w-full max-w-xl mx-auto mt-12">
                <h3 className="text-xs font-black uppercase text-center text-[#a0412d] mb-8 tracking-[0.4em]">Révélations</h3>
                <div className="flex flex-col gap-6">
                  {answeredExplanations.map((text, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-white shadow-sm border border-black/5">
                      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Secret {i+1}</p>
                      <p className="text-sm text-gray-600 leading-relaxed italic">« {text} »</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ── Interactive Game View ── */
            <div className="w-full flex flex-col items-center">
              <h1 className="text-2xl font-black mb-8 text-[#a0412d]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{currentMystere.titre}</h1>
              <div className="w-full mb-12 grid grid-cols-3 items-center gap-4">
                <div className="flex flex-col items-center">
                  <HourglassTimer timeLeft={timeLeft} isFlipping={isFlipping} />
                  <p className="text-[11px] font-bold text-gray-400 mt-4 uppercase">Temps</p>
                </div>
                <div className="flex justify-center scale-[0.85] md:scale-100"><SacredJar filledHoles={filledHoles} /></div>
                <div className="flex flex-col items-center gap-4">
                  <LifeBar lives={lives} shake={shakeLives} />
                  <div className="px-4 py-2 rounded-xl bg-[#5c3c35] text-[#fdb813] font-black text-[12px] shadow-lg">⭐ {points}</div>
                </div>
              </div>

              {isLocked ? <LockedScreen onPowerWord={(w: any)=>{ if(w.toLowerCase()==="benin"){ setIsLocked(false); setLives(8); } }} /> : showTreasure ? (
                <TreasureCard mystere={currentMystere} points={points} onLiberate={handleLiberate} isLiberated={false} />
              ) : (
                <div className="w-full flex flex-col gap-8">
                  {currentQuestion && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={questionIndex} className="w-full text-center">
                      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{currentQuestion.question_text}</h2>
                      {showExplanation ? (
                        <ExplanationCard text={currentQuestion.explication} questionNum={questionIndex+1} onContinue={()=>setShowTreasure(true)} />
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {["A", "B", "C", "D"].map(l => (currentQuestion as any)[`choice_${l.toLowerCase()}`] && (
                            <ChoiceButton key={l} letter={l} text={(currentQuestion as any)[`choice_${l.toLowerCase()}`]} state={choiceState[l] || "idle"} onClick={()=>handleAnswer(l)} disabled={questionAnswered} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                  {answeredExplanations.length > 0 && (
                    <div id="Revelations" className="mt-8 pt-8 border-t border-[#a0412d]/10 w-full">
                      <h3 className="text-xs font-black uppercase text-center text-[#a0412d] mb-6">Révélations Débloquées</h3>
                      <div className="flex flex-col gap-4">
                        {answeredExplanations.map((ex, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-white/50 border border-black/5 text-xs italic text-gray-500">{ex}</motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button onClick={goPrevMystere} className="p-4 rounded-full bg-white shadow-xl">←</button>
        <button onClick={goNextMystere} className="p-4 rounded-full bg-white shadow-xl">→</button>
      </div>
    </div>
  );
}
