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

  // État pour la modale vidéo
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // État pour la navigation (swipe)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [mouseStartY, setMouseStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Handlers pour le swipe (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    // Détection horizontale (au moins 50px de swipe, et plus horizontal que vertical)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      goTo(diffX < 0 ? 1 : -1);
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Handlers pour le swipe (Mouse/Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setMouseStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || mouseStartX === null || mouseStartY === null) return;
    const diffX = e.clientX - mouseStartX;
    const diffY = e.clientY - mouseStartY;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      goTo(diffX < 0 ? 1 : -1);
    }
    setMouseStartX(null);
    setMouseStartY(null);
    setIsDragging(false);
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /></div>
  );

  const pair = pairs[currentIndex];
  if (!pair) return null;

  return (
    <div
      className="w-full bg-white grid text-[#1a1c1c] overflow-hidden relative select-none"
      style={{
        height: "calc(100svh - 80px)",
        gridTemplateRows: "48px minmax(0, 1fr) 140px",
        gap: "12px",
        padding: "12px 0",
        cursor: isDragging ? "grabbing" : "grab"
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >

      {/* Catégorie */}
      <div className="flex items-center justify-center">
        <span className="bg-[#1a1c1c] text-white px-6 py-2 rounded-full font-display text-[10px] font-bold tracking-[0.2em] uppercase">
          {pair.category}
        </span>
      </div>

      {/* Duel Cards */}
      <div className="relative w-full overflow-hidden px-2 md:px-8 max-w-5xl mx-auto">
        <div className={`grid grid-cols-2 gap-3 md:gap-8 h-full transition-all duration-300 ${swipeDir === "left" ? "-translate-x-full opacity-0" : swipeDir === "right" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}>
          <CandidateCard talent={pair.talent1} percent={100 - sliderValue} dotColor="#22C55E" onPlay={(url) => setActiveVideo(url)} />
          <CandidateCard talent={pair.talent2} percent={sliderValue} dotColor="#ffd31a" onPlay={(url) => setActiveVideo(url)} />
        </div>
      </div>

      {/* Controls */}
      <div
        className="flex flex-col items-center justify-center gap-6 px-4"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-2xl relative h-6 rounded-full bg-gray-100 flex shadow-inner">
          <div className="absolute inset-0 flex rounded-full overflow-hidden">
            <div className="h-full transition-all duration-300" style={{ width: `${100 - sliderValue}%`, backgroundColor: "#008751" }} />
            <div className="h-full transition-all duration-300" style={{ width: `${sliderValue}%`, backgroundColor: "#ffd31a" }} />
          </div>
          <input
            type="range"
            value={sliderValue}
            onChange={(e) => !validatedSet.has(currentIndex) && setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 outline-none"
          />
        </div>
        <button
          onClick={handleValidate}
          disabled={validatedSet.has(currentIndex)}
          className="w-full max-w-[240px] bg-[#1a1c1c] text-white py-3 md:py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
        >
          {validatedSet.has(currentIndex) ? (
            <>VOTÉ <span className="text-green-500">✓</span></>
          ) : (
            "JE VALIDE"
          )}
        </button>
      </div>

      {/* MODALE VIDÉO */}
      {activeVideo && <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 44px;
          height: 44px;
          background: #bd0020;
          border: 4px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(189, 0, 32, 0.4);
          transition: transform 0.2s;
        }
        input[type=range]::-moz-range-thumb {
          width: 44px;
          height: 44px;
          background: #bd0020;
          border: 4px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(189, 0, 32, 0.4);
        }
        input[type=range]:active::-webkit-slider-thumb {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

// Composant pour la carte individuelle
const CandidateCard = ({ talent, percent, dotColor, onPlay }: { talent: Talent, percent: number, dotColor: string, onPlay: (url: string) => void }) => {
  const imageUrl = talent.profile_image.startsWith('http')
    ? talent.profile_image
    : supabase.storage.from("talents-images").getPublicUrl(talent.profile_image).data.publicUrl;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl">
      <img src={imageUrl} alt={talent.prenom_talent} className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <button onClick={() => onPlay(talent.video_url)} className="absolute top-3 right-3 z-30 bg-black/40 p-2 rounded-full backdrop-blur-sm hover:scale-110 transition-transform">
        <Play className="w-4 h-4 text-white fill-white" />
      </button>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}` }} />
            <h2 className="text-white font-bold text-lg md:text-xl tracking-[0.15em]">{talent.prenom_talent}</h2>
          </div>
          <span className="text-xl font-black" style={{ color: dotColor }}>{Math.round(percent)}%</span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{talent.bio}</p>
        <p className="text-orange-300 text-[10px] italic mt-2 leading-relaxed opacity-80 drop-shadow-sm">« {talent.quote} »</p>
      </div>
    </div>
  );
};

// Composant de la Modale Vidéo
const VideoModal = ({ url, onClose }: { url: string, onClose: () => void }) => {
  // Transformation de l'URL YouTube standard en URL embed
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        <iframe src={getEmbedUrl(url)} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
      </div>
    </div>
  );
};

export default TalentsPage;