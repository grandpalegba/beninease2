"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { Play, Loader2, X } from "lucide-react";

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

const TalentsPage = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [validatedSet, setValidatedSet] = useState<Set<number>>(new Set());
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchTalents = async () => {
      const { data } = await supabase.from("talents").select("*");
      if (data) setTalents(data as Talent[]);
      setLoading(false);
    };
    fetchTalents();
  }, []);

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
    const winner = sliderValue <= 50 ? pair.talent1 : pair.talent2;

    const { error } = await supabase
      .from("talents")
      .update({ total_votes: (winner.total_votes || 0) + 1 })
      .eq("id", winner.id);

    if (!error) {
      setValidatedSet((prev) => new Set(prev).add(currentIndex));
      setTimeout(() => goTo(1), 600);
    }
  };

  // Logique de navigation simplifiée
  const onDragStart = (x: number, y: number) => { setDragStart({ x, y }); setIsDragging(true); };
  const onDragEnd = (x: number, y: number) => {
    if (!isDragging) return;
    const diffX = x - dragStart.x;
    const diffY = y - dragStart.y;
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) goTo(diffX < 0 ? 1 : -1);
    setIsDragging(false);
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  const pair = pairs[currentIndex];
  if (!pair) return null;

  return (
    <div
      className="w-full bg-white grid text-[#1a1c1c] overflow-hidden relative select-none"
      style={{ height: "calc(100svh - 80px)", gridTemplateRows: "48px minmax(0, 1fr) 140px", gap: "12px", padding: "12px 0" }}
      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      onMouseUp={(e) => onDragEnd(e.clientX, e.clientY)}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
    >
      <div className="flex items-center justify-center">
        <span className="bg-[#1a1c1c] text-white px-6 py-2 rounded-full font-bold tracking-[0.2em] uppercase text-[10px]">
          {pair.category}
        </span>
      </div>

      <div className="relative w-full overflow-hidden px-2 md:px-8 max-w-5xl mx-auto">
        <div className={`grid grid-cols-2 gap-3 md:gap-8 h-full transition-all duration-300 ${swipeDir === "left" ? "-translate-x-full opacity-0" : swipeDir === "right" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}>
          <Card talent={pair.talent1} percent={100 - sliderValue} dotColor="#008751" onPlay={setActiveVideo} />
          <Card talent={pair.talent2} percent={sliderValue} dotColor="#ffd31a" onPlay={setActiveVideo} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 px-4" onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}>
        <div className="w-full max-w-2xl relative h-6 rounded-full bg-gray-100 shadow-inner overflow-hidden flex">
          <div className="h-full transition-all duration-300" style={{ width: `${100 - sliderValue}%`, backgroundColor: "#008751" }} />
          <div className="h-full transition-all duration-300" style={{ width: `${sliderValue}%`, backgroundColor: "#ffd31a" }} />
          <input type="range" value={sliderValue} onChange={(e) => !validatedSet.has(currentIndex) && setSliderValue(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        </div>
        <button onClick={handleValidate} disabled={validatedSet.has(currentIndex)} className="w-full max-w-[240px] bg-[#1a1c1c] text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase shadow-lg disabled:opacity-50">
          {validatedSet.has(currentIndex) ? "VOTÉ ✓" : "JE VALIDE"}
        </button>
      </div>

      {activeVideo && <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />}
      <style>{`input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 44px; height: 44px; background: #bd0020; border: 4px solid white; border-radius: 50%; cursor: pointer; }`}</style>
    </div>
  );
};

const Card = ({ talent, percent, dotColor, onPlay }: any) => {
  const imageUrl = talent.profile_image.startsWith('http') ? talent.profile_image : supabase.storage.from("talents-images").getPublicUrl(talent.profile_image).data.publicUrl;
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <button onClick={() => onPlay(talent.video_url)} className="absolute top-3 right-3 z-30 bg-black/40 p-2 rounded-full backdrop-blur-sm"><Play className="w-4 h-4 text-white fill-white" /></button>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
            <h2 className="text-white font-bold text-sm uppercase tracking-widest">{talent.prenom_talent}</h2>
          </div>
          <span className="font-black text-lg" style={{ color: dotColor }}>{Math.round(percent)}%</span>
        </div>
        <p className="text-gray-300 text-[10px] line-clamp-3 leading-tight">{talent.bio}</p>
      </div>
    </div>
  );
};

const VideoModal = ({ url, onClose }: any) => {
  const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4">
      <button onClick={onClose} className="absolute top-6 right-6 text-white"><X className="w-8 h-8" /></button>
      <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1`} className="w-full max-w-4xl aspect-video" allowFullScreen />
    </div>
  );
};

export default TalentsPage;