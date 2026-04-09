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
      setSwipeDir(dir === 1 ? "left" : "right");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + dir + pairs.length) % pairs.length);
        setSwipeDir(null);
      }, 250);
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
      // Reset slider for next duel if not validated
      setTimeout(() => {
        setSliderValue(50);
      }, 260);
    }, 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !isValidated) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 60) {
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
      className="min-h-screen bg-white flex flex-col items-center text-[#1a1c1c] select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Category pill */}
      <div className="mt-8 mb-6 md:mb-10">
        <span className="bg-[#1a1c1c] text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-display text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
          {pair.category}
        </span>
      </div>

      {/* Swipeable duel area */}
      <div
        className={`flex items-center w-full max-w-4xl px-4 mb-6 md:mb-10 transition-all duration-250 ease-out ${swipeClass}`}
      >
        <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6">
          <CandidateCard talent={pair.talent1} percent={leftPercent} dotColor="#006b3f" />
          <CandidateCard talent={pair.talent2} percent={rightPercent} dotColor="#ffd31a" />
        </div>
      </div>

      {/* Voting track */}
      <div className="w-full max-w-lg md:max-w-2xl px-6 mb-6">
        <div className="relative w-full h-6 md:h-8 rounded-full overflow-visible">
          <div className="absolute inset-0 flex rounded-full overflow-hidden">
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
      <div className="flex flex-col items-center gap-4 mb-10">
        <button
          onClick={handleValidate}
          disabled={isValidated}
          className="bg-[#1a1c1c] text-white px-10 py-3 md:px-16 md:py-4 rounded-full font-display text-sm md:text-base font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors active:scale-95 duration-200 disabled:opacity-50"
        >
          {isValidated ? "DÉJÀ ÉVALUÉ ✓" : "JE VALIDE"}
        </button>
      </div>

      {/* Duel counter + swipe hint removed per request */}

      {/* Tap zones for desktop navigation */}
      <div
        className={`fixed left-0 top-0 h-full w-16 z-20 ${isValidated ? 'cursor-pointer' : 'cursor-not-allowed hidden'}`}
        onClick={() => isValidated && goTo(-1)}
      />
      <div
        className={`fixed right-0 top-0 h-full w-16 z-20 ${isValidated ? 'cursor-pointer' : 'cursor-not-allowed hidden'}`}
        onClick={() => isValidated && goTo(1)}
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
  <div className="flex flex-col w-full bg-[#1a1c1c] rounded-2xl overflow-hidden text-left shadow-lg">
    <div className="relative group cursor-pointer w-full aspect-[4/5] md:aspect-[5/6]">
      <img
        alt={talent.name}
        className="w-full h-full object-cover transition-all duration-700 opacity-90 group-hover:opacity-100"
        src={talent.image}
      />
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center justify-center">
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
          <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
        </div>
      </div>
    </div>
    
    <div className="p-4 md:p-6 flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-lg md:text-xl tracking-wider text-[#ffd31a] truncate pr-2">
          {talent.name}
        </h2>
        <div 
          className="font-display text-lg md:text-xl font-extrabold"
          style={{ color: dotColor }}
        >
          {Math.round(percent)}%
        </div>
      </div>
      
      <p className="text-gray-300 text-xs md:text-sm line-clamp-3 leading-relaxed mb-3">
        {talent.bio}
      </p>
      
      <p className="font-sans text-xs italic text-[#ffd31a]/80 mt-auto">
        « {talent.quote} »
      </p>
    </div>
  </div>
);

export default Duel;
