"use client";
import { useState, useMemo, useCallback } from "react";
import { talents } from "@/data/talents";
import { Play } from "lucide-react";

const categories = [...new Set(talents.map((t) => t.category))];

const getDuelPairs = () => {
  const pairs: { category: string; talent1: typeof talents[0]; talent2: typeof talents[0] }[] = [];
  categories.forEach((cat) => {
    const catTalents = talents.filter((t) => t.category === cat);
    if (catTalents.length >= 2) {
      pairs.push({ category: cat, talent1: catTalents[0], talent2: catTalents[1] });
    }
  });
  return pairs;
};

const Duel = () => {
  const pairs = useMemo(getDuelPairs, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [validatedSet, setValidatedSet] = useState<Set<number>>(new Set());
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      // Phase 1: animate current content out
      setSwipeDir(dir === 1 ? "left" : "right");
      // Phase 2: while still invisible, swap content + reset slider
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + dir + pairs.length) % pairs.length);
        setSliderValue(50);
      }, 220);
      // Phase 3: fade new content in
      setTimeout(() => {
        setSwipeDir(null);
      }, 280);
    },
    [pairs.length],
  );

  const pair = pairs[currentIndex];
  if (!pair) return null;

  const isValidated = validatedSet.has(currentIndex);
  const leftPercent = sliderValue;
  const rightPercent = 100 - sliderValue;

  const handleValidate = () => {
    if (isValidated) return;
    setValidatedSet((prev) => new Set(prev).add(currentIndex));
    setTotalPoints((p) => p + Math.abs(sliderValue - 50) * 10);
    setTimeout(() => {
      goTo(1);
    }, 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      goTo(diff < 0 ? 1 : -1);
    }
    setTouchStartX(null);
  };

  const swipeClass =
    swipeDir === "left"
      ? "translate-x-[-100%] opacity-0"
      : swipeDir === "right"
        ? "translate-x-[100%] opacity-0"
        : "translate-x-0 opacity-100";

  return (
    <div
      className="h-[calc(100dvh-80px)] md:h-[calc(100dvh-95px)] w-full bg-white flex flex-col items-center gap-3 md:gap-5 py-3 md:py-6 text-[#1a1c1c] select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Category pill - Fixed height anchor */}
      <div className="shrink-0 h-[40px] md:h-[60px] flex items-center justify-center w-full">
        <span className="bg-[#1a1c1c] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-display text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase shadow-sm">
          {pair.category}
        </span>
      </div>

      {/* Swipeable duel area - Fluid centered space */}
      <div
        className={`flex items-start justify-center w-full max-w-[90vw] md:max-w-3xl lg:max-w-4xl px-2 md:px-4 transition-all duration-250 ease-out flex-1 min-h-0 ${swipeClass}`}
      >
        <div className="w-full grid grid-cols-2 gap-3 md:gap-8">
          <CandidateCard talent={pair.talent1} percent={leftPercent} dotColor="#006b3f" />
          <CandidateCard talent={pair.talent2} percent={rightPercent} dotColor="#ffd31a" />
        </div>
      </div>

      {/* Controls Container: Track + CTA - Fixed height bottom anchor */}
      <div className="w-full shrink-0 flex flex-col items-center justify-end gap-5 md:gap-8 h-[90px] md:h-[120px] z-20">
        {/* Voting track */}
        <div className="w-full max-w-sm md:max-w-2xl px-6 relative flex flex-col items-center shrink-0">
          <div className="relative w-full h-5 md:h-8 rounded-full overflow-visible">
            <div className="absolute inset-0 flex rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full transition-all duration-200"
                style={{ width: `${leftPercent}%`, backgroundColor: "#006b3f" }}
              />
              <div
                className="h-full transition-all duration-200"
                style={{ width: `${rightPercent}%`, backgroundColor: "#ffd31a" }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderValue}
              onChange={(e) => !isValidated && setSliderValue(Number(e.target.value))}
              disabled={isValidated}
              className="duel-slider absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 disabled:cursor-default"
            />
          </div>
        </div>

        {/* CTA Validation */}
        <div className="shrink-0 flex flex-col items-center">
          <button
            onClick={handleValidate}
            disabled={isValidated}
            className="bg-[#1a1c1c] text-white px-8 py-2.5 md:px-10 md:py-4 rounded-full font-display text-xs md:text-base font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors active:scale-95 duration-200 disabled:opacity-50 shadow-lg"
          >
            {isValidated ? "DÉJÀ ÉVALUÉ ✓" : "JE VALIDE"}
          </button>
        </div>
      </div>

      {/* Duel counter + swipe hint removed per request */}

      {/* Tap zones for desktop navigation */}
      <div
        className="fixed left-0 top-0 h-full w-12 md:w-16 z-20 cursor-pointer hidden md:block"
        onClick={() => goTo(-1)}
      />
      <div
        className="fixed right-0 top-0 h-full w-12 md:w-16 z-20 cursor-pointer hidden md:block"
        onClick={() => goTo(1)}
      />

      {/* Custom slider styles */}
      <style>{`
        .duel-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #bd0020;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .duel-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #bd0020;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          cursor: pointer;
        }
        .duel-slider::-webkit-slider-runnable-track { background: transparent; }
        .duel-slider::-moz-range-track { background: transparent; }
        @media (min-width: 768px) {
          .duel-slider::-webkit-slider-thumb { width: 36px; height: 36px; }
          .duel-slider::-moz-range-thumb { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
};

const CandidateCard = ({
  talent,
  percent,
  dotColor,
}: {
  talent: typeof talents[0];
  percent: number;
  dotColor: string;
}) => (
  <div className="flex flex-col w-full h-full bg-[#1a1c1c] rounded-xl md:rounded-2xl overflow-hidden text-left shadow-lg">
    <div className="relative group cursor-pointer w-full aspect-square shrink-0 bg-[#0a0a0a]">
      <img
        alt={talent.name.split(" ")[0]}
        className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100 pointer-events-none"
        src={talent.image}
        draggable={false}
      />
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
          <Play className="w-3 h-3 md:w-5 md:h-5 text-white fill-white" />
        </div>
      </div>
    </div>
    
    <div className="p-3 md:p-6 flex flex-col flex-1 bg-[#1a1c1c] z-10 w-full overflow-hidden">
      {/* Ligne d'entête: Point, Nom, et Pourcentage */}
      <div className="flex items-center justify-between mb-1 md:mb-2 max-w-full">
        <div className="flex items-center gap-2 overflow-hidden">
          <div 
            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-sm shrink-0" 
            style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }} 
          />
          <h2 className="font-display font-bold text-sm md:text-xl tracking-[0.1em] md:tracking-[0.2em] text-white truncate whitespace-nowrap">
            {talent.name.split(" ")[0]}
          </h2>
        </div>
        <div 
          className="font-display text-sm md:text-xl font-extrabold shrink-0 pl-1"
          style={{ color: dotColor }}
        >
          {Math.round(percent)}%
        </div>
      </div>
      
      <p className="text-gray-300 text-[11px] md:text-sm leading-relaxed md:leading-[1.8] w-full mt-1.5 md:mt-2 text-justify">
        {talent.bio}
      </p>
      
      <p className="font-sans text-[10px] md:text-xs italic text-orange-200 mt-3 md:mt-4 leading-relaxed pb-1 text-justify">
        « {talent.quote} »
      </p>
    </div>
  </div>
);

export default Duel;
