
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Info, Shield, Target, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { SIGNS, type FongbeSign } from '@/data/fongbe';
import { SignIdeogram } from '@/components/FaMatrix';

interface SignData {
  id: string;
  signe_nom: string;
  introduction: string;
  devise: string;
  avantages: string;
  defis: string;
  recommandation: string;
}

const cleanString = (s: string) => {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[\s-]/g, ""); // Remove spaces and dashes
};

const CoursePage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [data, setData] = useState<SignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [leftSign, setLeftSign] = useState<FongbeSign | null>(null);
  const [rightSign, setRightSign] = useState<FongbeSign | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all signs to find the one matching the slug
        // Using index idx_signes_fa_nom implicitly via the select
        const { data: allSigns, error } = await supabase
          .from('signes_fa')
          .select('*');

        if (error) throw error;

        // Robust matching: lowercase, no accents/spaces, meji == medji
        const foundSign = allSigns?.find(s => {
          const dbSlug = cleanString(s.signe_nom).toLowerCase().replace('medji', 'meji');
          const urlSlug = (slug as string).toLowerCase().replace('medji', 'meji');
          return dbSlug === urlSlug;
        });
        
        if (foundSign) {
          setData(foundSign);
          findMotherSigns(foundSign.signe_nom);
        }
      } catch (err) {
        console.error("Error fetching sign data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const findMotherSigns = (signName: string) => {
    const normalizedName = signName.toLowerCase().replace('medji', 'meji');
    
    // If it's a "Meji" sign
    if (normalizedName.includes('meji')) {
      const baseName = signName.split(' ')[0];
      const sign = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(baseName).toLowerCase());
      if (sign) {
        setLeftSign(sign);
        setRightSign(sign);
      }
    } else {
      // It's a combination
      // Split by space or dash
      const parts = signName.split(/[\s-]/);
      if (parts.length >= 2) {
        const left = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(parts[0]).toLowerCase());
        const right = SIGNS.find(s => cleanString(s.name).toLowerCase() === cleanString(parts[1]).toLowerCase());
        if (left) setLeftSign(left);
        if (right) setRightSign(right);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-neutral-100 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-display mb-4">Signe non trouvé</h1>
        <button onClick={() => router.back()} className="text-sm underline uppercase tracking-widest font-bold">Retour</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-display uppercase tracking-widest font-bold">{data.signe_nom}</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {/* Video Section with Fallback */}
        <div className="aspect-video w-full bg-neutral-900 rounded-2xl overflow-hidden relative mb-12 shadow-2xl">
          {/* Mock Video Placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm group cursor-pointer hover:bg-white/10 transition-all">
              <Play size={32} className="ml-1 fill-white" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Video Lesson: {data.signe_nom}</span>
          </div>
          {/* Text to "furnish" if no video (per prompt) */}
          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/80 text-sm font-light italic max-w-lg line-clamp-2">
              "{data.introduction}"
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column: Ideogram & Devise */}
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <div className="mb-8 p-8 border border-neutral-100 rounded-3xl bg-neutral-50 shadow-sm">
              {leftSign && rightSign && (
                <SignIdeogram leftSign={leftSign} rightSign={rightSign} size={100} />
              )}
            </div>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">Devise du signe</span>
              <p className="font-headline italic text-lg leading-relaxed text-neutral-600">
                "{data.devise}"
              </p>
            </div>
          </div>

          {/* Right Column: Content Sections */}
          <div className="md:col-span-2 space-y-12">
            <Section icon={<Info size={18} />} title="Introduction" content={data.introduction} />
            <div className="grid sm:grid-cols-2 gap-8">
              <Section icon={<Shield size={18} />} title="Avantages" content={data.avantages} color="text-emerald-600" />
              <Section icon={<Target size={18} />} title="Défis" content={data.defis} color="text-amber-600" />
            </div>
            <Section icon={<Lightbulb size={18} />} title="Recommandation" content={data.recommandation} isHighlight />
          </div>
        </div>
      </main>
    </div>
  );
};

const Section = ({ icon, title, content, color = "text-neutral-800", isHighlight = false }: any) => (
  <div className={`space-y-4 ${isHighlight ? 'p-8 bg-neutral-50 rounded-2xl border border-neutral-100' : ''}`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white shadow-sm ${color}`}>{icon}</div>
      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">{title}</h3>
    </div>
    <p className={`text-sm leading-relaxed font-light ${color}`}>
      {content || "Information non disponible pour le moment."}
    </p>
  </div>
);

export default CoursePage;
