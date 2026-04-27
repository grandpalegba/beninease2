"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Tresor {
  id: string;
  nom: string;
  sous_titre: string;
  image_url: string;
  created_at: string;
}

export default function TresorsPage() {
  const [tresors, setTresors] = useState<Tresor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTresors() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("tresors_benin")
          .select("*")
          .order("nom", { ascending: true });

        if (supabaseError) throw supabaseError;
        setTresors(data || []);
      } catch (err: any) {
        console.error("Error fetching tresors:", err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchTresors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs font-sans">Chargement des Trésors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F7F2] font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-[#008751] font-bold hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-16 px-6 md:px-12 lg:px-24">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-[64px] text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase font-sans mb-4">
          Galerie des Trésors
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold">
          Patrimoine & Splendeur du Bénin
        </p>
      </div>

      {/* GRID SECTION */}
      <div className="max-w-7xl mx-auto">
        {tresors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tresors.map((tresor) => (
              <div 
                key={tresor.id}
                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image 
                    src={tresor.image_url} 
                    alt={tresor.nom}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* TEXT CONTENT */}
                <div className="p-8">
                  <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                    {tresor.nom}
                  </h2>
                  <p className="text-[16px] text-gray-500 font-medium font-sans leading-relaxed">
                    {tresor.sous_titre}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-sans italic">Aucun trésor n&apos;a été trouvé dans la collection pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
