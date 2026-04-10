"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { supabase } from "@/utils/supabase/client";
import { Play, Loader2, X, Share2, Check } from "lucide-react";
import { CategoryPattern } from "@/components/talents/CategoryPattern";
import { useSearchParams } from "next/navigation";

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
  categoryId: string;
  talent1: Talent;
  talent2: Talent;
}

// Algorithme de mélange Fisher-Yates
const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatCategoryName = (catId: string) => {
  const overrides: Record<string, string> = {
    "voix-lieux": "VOIX DES LIEUX",
    "voix-des-lieux": "VOIX DES LIEUX",
    "saveurs-benin": "GASTRONOMIE",
    "saveurs": "GASTRONOMIE",
    "gastronomie": "GASTRONOMIE"
  };
  return overrides[catId.toLowerCase()] || catId.replace("-", " ").toUpperCase();
};

const TalentsContent = () => {
  const searchParams = useSearchParams();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [validatedSet, setValidatedSet] = useState<Set<number>>(new Set());
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

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

    // ÉTAPE 1 : Groupage strict par catégorie
    const grouped = talents.reduce((acc, t) => {
      const catId = t.talent_categorie_id || "divers";
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(t);
      return acc;
    }, {} as Record<string, Talent[]>);

    const allPairs: DuelPair[] = [];

    // ÉTAPE 2 : Création de paires intra-catégorie
    Object.keys(grouped).forEach((catId) => {
      const catTalents = shuffle(grouped[catId]); 
      
      for (let i = 0; i < catTalents.length - 1; i += 2) {
        allPairs.push({
          category: formatCategoryName(catId),
          categoryId: catId,
          talent1: catTalents[i],
          talent2: catTalents[i + 1]
        });
      }
    });

    // ÉTAPE 3 : Mélange final de la liste des duels
    const finalPairs = shuffle(allPairs);

    // ÉTAPE 4 : Insérer le duel partagé au tout début s'il existe
    const t1 = searchParams.get("t1");
    const t2 = searchParams.get("t2");
    if (t1 && t2) {
      const talent1 = talents.find(t => t.id === t1);
      const talent2 = talents.find(t => t.id === t2);
      if (talent1 && talent2) {
        // Supprimer le duel des paires existantes s'il s'y trouve déjà (pour éviter les doublons)
        const filteredPairs = finalPairs.filter(p => 
          !((p.talent1.id === t1 && p.talent2.id === t2) || (p.talent1.id === t2 && p.talent2.id === t1))
        );
        
        return [
          {
            category: formatCategoryName(talent1.talent_categorie_id),
            categoryId: talent1.talent_categorie_id,
            talent1,
            talent2
          },
          ...filteredPairs
        ];
      }
    }

    return finalPairs;
  }, [talents, searchParams]);

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

  const handleShare = async () => {
    const pair = pairs[currentIndex];
    if (!pair) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?t1=${pair.talent1.id}&t2=${pair.talent2.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "BeninEase - L'Espace béninois",
          text: "Découvrez les Trésors, les Ambassadeurs et les Talents du patrimoine du Bénin.",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Erreur de partage:", err);
      }
    } else {
      // Fallback : Copie dans le presse-papier
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        console.error("Erreur copie:", err);
      }
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
      className="w-full bg-white flex flex-col justify-between items-center text-[#1a1c1c] overflow-hidden relative select-none pt-2 pb-6"
      style={{
        height: "calc(100svh - 72px)",
        cursor: isDragging ? "grabbing" : "grab"
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >

      {/* Catégorie */}
      <div className="flex flex-col items-center justify-center gap-3 shrink-0">
        <span className="text-[#B8860B] font-display text-[11px] font-bold tracking-[0.3em] uppercase">
          TALENTS DU BÉNIN
        </span>
        <div className="flex items-center gap-4 bg-white text-[#1a1c1c] border border-zinc-100 px-6 py-2 rounded-full shadow-sm">
          <CategoryPattern id={pair.categoryId} />
          <span className="font-display text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
            {pair.category}
          </span>
          <CategoryPattern id={pair.categoryId} className="scale-x-[-1]" />
        </div>
      </div>

      {/* Duel Cards */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden px-2 md:px-8 max-w-5xl mx-auto">
        <div className={`grid grid-cols-2 gap-3 md:gap-8 h-full transition-all duration-300 ${swipeDir === "left" ? "-translate-x-full opacity-0" : swipeDir === "right" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}>
          <CandidateCard talent={pair.talent1} percent={100 - sliderValue} dotColor="#22C55E" onPlay={(url) => setActiveVideo(url)} />
          <CandidateCard talent={pair.talent2} percent={sliderValue} dotColor="#ffd31a" onPlay={(url) => setActiveVideo(url)} />
        </div>
      </div>

      {/* Track Container */}
      <div className="w-full flex flex-col items-center gap-8 shrink-0">
        <div
          className="w-full max-w-2xl px-4"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
        <div className="w-full max-w-2xl mx-auto relative h-3 rounded-full bg-gray-100 flex shadow-inner">
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
      </div>

        {/* Button Group */}
        <div className="flex flex-col items-center justify-center gap-4 pb-4">
          <button
            onClick={handleShare}
            className="p-3.5 rounded-full bg-white border border-zinc-100 text-zinc-400 hover:text-amber-600 hover:border-amber-200 transition-all active:scale-95 shadow-md flex items-center justify-center group"
            title="Partager ce duel"
          >
            {shareSuccess ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>

          <button
            onClick={handleValidate}
            disabled={validatedSet.has(currentIndex)}
            className="w-[180px] bg-[#1a1c1c] text-white py-2.5 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {validatedSet.has(currentIndex) ? (
              <>A VOTÉ <span className="text-green-500">✓</span></>
            ) : (
              "VALIDER"
            )}
          </button>
        </div>
      </div>

      {/* MODALE VIDÉO */}
      {activeVideo && <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: #bd0020;
          border: 2.5px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(189, 0, 32, 0.4);
          transition: transform 0.2s;
        }
        input[type=range]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: #bd0020;
          border: 2.5px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(189, 0, 32, 0.4);
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
      <button 
        onClick={() => onPlay(talent.video_url)} 
        className="absolute top-3 right-3 z-30 p-2 rounded-full backdrop-blur-md hover:scale-110 transition-transform shadow-lg"
        style={{ backgroundColor: `${dotColor}4D` }}
      >
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
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1` : url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
        <iframe 
          src={getEmbedUrl(url)} 
          className="w-full h-full" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
        />
      </div>
    </div>
  );
};

const TalentsPage = () => {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /></div>}>
      <TalentsContent />
    </Suspense>
  );
};

export default TalentsPage;