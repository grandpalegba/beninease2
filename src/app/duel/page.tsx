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
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [mouseStartY, setMouseStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      setSwipeDir(dir === 1 ? "left" : "right");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + dir + pairs.length) % pairs.length);
        setSliderValue(50);
      }, 220);
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
    setTimeout(() => { goTo(1); }, 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      goTo(diffX < 0 ? 1 : -1);
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

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

  const swipeClass =
    swipeDir === "left"
      ? "translate-x-[-100%] opacity-0"
      : swipeDir === "right"
        ? "translate-x-[100%] opacity-0"
        : "translate-x-0 opacity-100";

  return (
    <div
      className="w-full bg-white grid text-[#1a1c1c] select-none overflow-hidden"
      style={{
        height: "calc(100svh - 80px)",
        gridTemplateRows: "44px minmax(0, 1fr) 120px",
        gap: "10px",
        padding: "10px 0",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* ROW 1 — Category pill (fixed 48px) */}
      <div className="flex items-center justify-center w-full">
        <span className="bg-[#1a1c1c] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-display text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase shadow-sm">
          {pair.category}
        </span>
      </div>

      {/* ROW 2 — Cards (1fr = all remaining space) */}
      <div className="relative w-full overflow-hidden min-h-0">
        <div
          className={`absolute inset-0 transition-all duration-250 ease-out ${swipeClass} flex items-stretch px-2 md:px-8 max-w-4xl mx-auto`}
        >
          <div className="w-full grid grid-cols-2 gap-3 md:gap-8 h-full">
            <CandidateCard talent={pair.talent1} percent={leftPercent} dotColor="#006b3f" />
            <CandidateCard talent={pair.talent2} percent={rightPercent} dotColor="#ffd31a" />
          </div>
        </div>
      </div>

      {/* ROW 3 — Controls (fixed 110px) */}
      <div
        className="w-full flex flex-col items-center justify-around px-4 z-20"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Voting track */}
        <div className="w-full max-w-sm md:max-w-2xl px-2 relative">
          <div className="relative w-full h-5 md:h-7 rounded-full overflow-visible">
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
        <button
          onClick={handleValidate}
          disabled={isValidated}
          className="bg-[#1a1c1c] text-white px-8 py-2.5 md:px-10 md:py-3 rounded-full font-display text-xs md:text-base font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors active:scale-95 duration-200 disabled:opacity-50 shadow-lg"
        >
          {isValidated ? "DÉJÀ ÉVALUÉ ✓" : "JE VALIDE"}
        </button>
      </div>

      {/* Tap zones for desktop navigation */}
      <div
        className="fixed left-0 top-0 h-full w-12 md:w-16 z-10 cursor-pointer hidden md:block"
        onClick={() => goTo(-1)}
      />
      <div
        className="fixed right-0 top-0 h-full w-12 md:w-16 z-10 cursor-pointer hidden md:block"
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
  <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-[#0a0a0a]">
    {/* Full-bleed image */}
    <img
      alt={talent.name.split(" ")[0]}
      className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
      src={talent.image}
      draggable={false}
    />

    {/* Play button */}
    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
      <div className="bg-black/50 backdrop-blur-md rounded-full p-1.5 md:p-2 group-hover:scale-110 transition-transform duration-300">
        <Play className="w-2.5 h-2.5 md:w-4 md:h-4 text-white fill-white" />
      </div>
    </div>

    {/* Gradient overlay — bottom 60% of card */}
    <div
      className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
      style={{
        height: "65%",
        background: "linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.4) 70%, transparent 100%)",
      }}
    />

    {/* Text overlay — anchored to bottom of card */}
    <div className="absolute inset-x-0 bottom-0 z-20 p-3 md:p-5 flex flex-col overflow-y-auto max-h-[62%]">
      {/* Name + percent row */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div
            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
          />
          <h2 className="font-display font-bold text-sm md:text-xl tracking-[0.1em] md:tracking-[0.15em] text-white truncate whitespace-nowrap drop-shadow-md">
            {talent.name.split(" ")[0]}
          </h2>
        </div>
        <div
          className="font-display text-sm md:text-xl font-extrabold shrink-0 pl-1 drop-shadow-md"
          style={{ color: dotColor }}
        >
          {Math.round(percent)}%
        </div>
      </div>

      <p className="text-gray-200 text-[10px] md:text-sm leading-relaxed md:leading-[1.7] text-justify drop-shadow-sm">
        {talent.bio}
      </p>

      <p className="font-sans text-[9px] md:text-xs italic text-orange-300 mt-2 leading-relaxed text-justify drop-shadow-sm">
        « {talent.quote} »
      </p>
    </div>
  </div>
);

export default Duel;
