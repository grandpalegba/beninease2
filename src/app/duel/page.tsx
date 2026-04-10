"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Loader2 } from "lucide-react";

interface Talent {
  id: string;
  prenom_talent: string;
  nom_talent: string;
  profile_image: string;
  video_url: string;
  bio: string;
  quote: string;
  talent_categorie_id: string;
  total_votes: number;
}

interface DuelPair {
  category: string;
  talent1: Talent;
  talent2: Talent;
}

const DuelPage = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [validatedSet, setValidatedSet] = useState<Set<number>>(new Set());
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  // 1. Fetching des données depuis Supabase
  useEffect(() => {
    const fetchTalents = async () => {
      const { data, error } = await supabase
        .from("talents")
        .select("*");

      if (data) setTalents(data as Talent[]);
      setLoading(false);
    };
    fetchTalents();
  }, []);

  // 2. Création dynamique des paires par catégorie
  const pairs = useMemo(() => {
    if (talents.length === 0) return [];

    const grouped = talents.reduce((acc, t) => {
      if (!acc[t.talent_categorie_id]) acc[t.talent_categorie_id] = [];
      acc[t.talent_categorie_id].push(t);
      return acc;
    }, {} as Record<string, Talent[]>);

    const generatedPairs: DuelPair[] = [];
    Object.keys(grouped).forEach((catId) => {
      const catTalents = grouped[catId];
      // On crée des paires (Talent 0 vs 1, 2 vs 3, etc.)
      for (let i = 0; i < catTalents.length - 1; i += 2) {
        generatedPairs.push({
          category: catId.replace("-", " ").toUpperCase(),
          talent1: catTalents[i],
          talent2: catTalents[i + 1]
        });
      }
    });
    return generatedPairs;
  }, [talents]);

  const goTo = useCallback((dir: -1 | 1) => {
    setSwipeDir(dir === 1 ? "left" : "right");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + dir + pairs.length) % pairs.length);
      setSliderValue(50);
      setSwipeDir(null);
    }, 250);
  }, [pairs.length]);

  const handleValidate = async () => {
    const pair = pairs[currentIndex];
    if (!pair || validatedSet.has(currentIndex)) return;

    // Déterminer le gagnant selon la logique inversée du slider
    const winner = sliderValue <= 50 ? pair.talent1 : pair.talent2;

    // Mise à jour de Supabase
    const { error } = await supabase
      .from("talents")
      .update({ total_votes: (winner.total_votes || 0) + 1 })
      .eq("id", winner.id);

    if (!error) {
      setValidatedSet((prev) => new Set(prev).add(currentIndex));
      setTimeout(() => goTo(1), 600);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white text-zinc-900">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (pairs.length === 0) return null;

  const pair = pairs[currentIndex];
  const leftPercent = 100 - sliderValue;
  const rightPercent = sliderValue;
  const isValidated = validatedSet.has(currentIndex);

  return (
    <div className="w-full bg-white grid text-[#1a1c1c] overflow-hidden" style={{ height: "calc(100svh - 80px)", gridTemplateRows: "48px minmax(0, 1fr) 140px", gap: "12px", padding: "12px 0" }}>

      {/* Categorie */}
      <div className="flex items-center justify-center">
        <span className="bg-[#1a1c1c] text-white px-6 py-2 rounded-full font-display text-[10px] font-bold tracking-[0.2em] uppercase">
          {pair.category}
        </span>
      </div>

      {/* Duel Cards */}
      <div className="relative w-full overflow-hidden px-2 md:px-8 max-w-5xl mx-auto">
        <div className={`grid grid-cols-2 gap-3 md:gap-8 h-full transition-all duration-300 ${swipeDir === "left" ? "-translate-x-full opacity-0" : swipeDir === "right" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}>
          <CandidateCard talent={pair.talent1} percent={leftPercent} dotColor="#22C55E" />
          <CandidateCard talent={pair.talent2} percent={rightPercent} dotColor="#ffd31a" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-full max-w-2xl relative h-6 rounded-full bg-gray-100 overflow-hidden shadow-inner flex">
          <div className="h-full transition-all duration-300" style={{ width: `${leftPercent}%`, backgroundColor: "#22C55E" }} />
          <div className="h-full transition-all duration-300" style={{ width: `${rightPercent}%`, backgroundColor: "#ffd31a" }} />
          <input
            type="range" value={sliderValue}
            onChange={(e) => !isValidated && setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={isValidated}
          className="w-full max-w-[280px] bg-[#1a1c1c] text-white py-4 rounded-2xl font-black tracking-widest uppercase disabled:opacity-50"
        >
          {isValidated ? "VOTÉ ✓" : "JE VALIDE"}
        </button>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 40px; height: 40px; background: #bd0020; border: 4px solid white; border-radius: 50%; cursor: pointer; }
      `}</style>
    </div>
  );
};

const CandidateCard = ({ talent, percent, dotColor }: { talent: Talent, percent: number, dotColor: string }) => {
  // Génération de l'URL publique du Storage Supabase
  const imageUrl = supabase.storage.from("talents-images").getPublicUrl(talent.profile_image).data.publicUrl;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl group">
      <img src={imageUrl} alt={talent.prenom_talent} className="absolute inset-0 w-full h-full object-cover opacity-80" />

      {/* Video Play Button */}
      <a href={talent.video_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 z-30 bg-black/40 p-2 rounded-full backdrop-blur-sm">
        <Play className="w-4 h-4 text-white fill-white" />
      </a>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}` }} />
            <h2 className="text-white font-bold text-lg md:text-2xl uppercase tracking-tighter">{talent.prenom_talent}</h2>
          </div>
          <span className="text-xl font-black" style={{ color: dotColor }}>{Math.round(percent)}%</span>
        </div>
        <p className="text-gray-300 text-xs md:text-sm line-clamp-3 md:line-clamp-none">{talent.bio}</p>
        <p className="text-orange-300 text-[10px] italic mt-2 opacity-80">« {talent.quote} »</p>
      </div>
    </div>
  );
};

export default DuelPage;