"use client";

import AuthButtons from "@/components/auth/AuthButtons";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-6 md:p-12">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#008751] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008751]/10 text-[#008751] text-xs font-bold uppercase tracking-widest animate-fade-down">
            <Heart className="w-3.5 h-3.5 fill-[#008751]" />
            Soutenez un talent
          </div>
          <h1 className="text-4xl font-display font-bold text-black animate-fade-up">
            Connectez-vous pour soutenir votre <span className="text-[#008751]">talent préféré</span>
          </h1>
          <p className="text-gray-500 font-sans text-sm max-w-xs mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Votre voix compte pour faire rayonner l'excellence béninoise.
          </p>
        </div>

        {/* Auth Buttons Card */}
        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-black/5 border border-[#F2EDE4] animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <AuthButtons intent="voter" />
        </div>

        {/* Footer info */}
        <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Devenir Ambassadeur
          </p>
          <Link 
            href="/postuler" 
            className="inline-block text-xs font-bold uppercase tracking-widest text-[#E8112D] hover:underline"
          >
            Postuler maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
