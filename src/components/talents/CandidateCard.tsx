"use client";

export default function CandidateCard({ talent, score, color }: any) {
  if (!talent) return null;

  return (
    <div className="flex flex-col w-full group">
      {/* Image Monumentale rounded-32px */}
      <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-[#eeeeee] mb-10 shadow-sm border border-black/5">
        <img
          src={talent.profile_image}
          alt={talent.prenom_talent}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 ease-out"
        />
        {/* Play Icon (Optional from your HTML) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-20 h-20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      {/* Info Line */}
      <div className="flex items-center gap-4 mb-4">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="font-black text-5xl tracking-[0.15em] text-[#1a1c1c] uppercase italic">
          {talent.prenom_talent}
        </h2>
      </div>

      {/* Massive Score */}
      <div className="font-black text-8xl tracking-tighter text-[#1a1c1c] tabular-nums">
        {score}%
      </div>
    </div>
  );
}