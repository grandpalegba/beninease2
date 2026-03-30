"use client";

import AuthButtons from "@/components/auth/AuthButtons";
import { CheckCircle2, Video, Heart, Star } from "lucide-react";

export default function PostulerPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-xl space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8112D]/10 text-[#E8112D] text-xs font-bold uppercase tracking-widest animate-fade-down">
            <Star className="w-3.5 h-3.5" />
            Rejoignez l&apos;élite
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-black leading-tight animate-fade-up">
            Devenez l&apos;un des <span className="text-[#E8112D]">256 Ambassadeurs</span> du Bénin
          </h1>
          <p className="text-gray-500 font-sans text-lg md:text-xl max-w-md mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Faites rayonner votre talent et contribuez au rayonnement de notre nation.
          </p>
        </div>

        {/* Auth Buttons Card */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-[#F2EDE4] animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="mb-8 text-center">
            <h2 className="text-xl font-display font-bold text-black">Commencez l&apos;aventure</h2>
            <p className="text-sm text-gray-400 mt-1">Choisissez votre mode de connexion</p>
          </div>
          <AuthButtons intent="talent" />
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="bg-white/50 p-6 rounded-3xl border border-[#008751]/10 flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#008751]" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black">1. Connexion</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Identifiez-vous pour sécuriser votre candidature.</p>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-[#008751]/10 flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-[#008751]" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black">2. Vidéo &quot;Qui je suis&quot;</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Présentez-vous en 60 secondes chrono.</p>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-[#008751]/10 flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#008751]/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#008751]" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-black">3. Vote du public</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Mobilisez votre communauté pour gagner.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
