"use client";
console.log("🔥 TALENTS PAGE RENDER");
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";
import CandidateSwiper from "@/components/CandidateSwiper";
import { Loader2, AlertCircle, Search, MousePointer2, Info, Filter, X, Star } from "lucide-react";
import Image from "next/image";

// --- HEADER PRESTIGIEUX ---
function PrestigiousHeader() {
  return (
    <div className="bg-white border-b border-[#F2EDE4] py-16 px-4 text-center">
      <Star 
        className="w-12 h-12 mx-auto mb-6 text-[#D4AF37] fill-[#D4AF37]" 
        strokeWidth={1.5}
      />
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4 tracking-wide">
        Découvrez les Ambassadeurs
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
        Parcourez la galerie des meilleurs talents du Bénin et votez pour ceux qui porteront nos couleurs.
      </p>
    </div>
  );
}

// --- SOUS-COMPOSANT CARTE (Isolation) ---
function TalentCard({ talent, onClick }: { talent: Talent; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-[#F2EDE4] overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={talent.avatar_url || "/placeholder-avatar.png"}
          alt={`${talent.prenom}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-[#008751] text-white px-3 py-1 rounded-full text-xs font-bold">
          {talent.votes || 0} votes
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-black">{talent.prenom} {talent.nom}</h3>
        <p className="text-sm text-[#008751] font-medium">{talent.categorie}</p>
        <p className="text-xs text-gray-500 mt-1">{talent.univers}</p>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [selectedUnivers, setSelectedUnivers] = useState<string>("");
  const [selectedCategorie, setSelectedCategorie] = useState<string>("");

  useEffect(() => {
    async function loadTalents() {
      try {
        console.log('🔍 Chargement talents...');
        
        // Vérifier la session avant de lancer la requête
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔐 Session check:', session ? '✅ Connecté' : '❌ Anonyme');
        
        if (sessionError) {
          console.error('❌ Erreur session:', sessionError);
        }
        
        let data, error;
        try {
          // La requête fonctionne pour les utilisateurs connectés et anonymes
          const result = await supabase
            .from("talents")
            .select("*")
            .order("votes", { ascending: false });
          data = result.data;
          error = result.error;
        } catch (supabaseError) {
          console.error('💥 SUPABASE_ERROR:', supabaseError);
          setError(true);
          return;
        }

        if (error) {
          console.error('💥 SUPABASE_ERROR:', error);
          setError(true);
          return;
        }

        console.log('✅ Talents chargés:', data?.length || 0);
        setTalents(data || []);
      } catch (err) {
        console.error('💥 GENERAL_ERROR:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadTalents();
  }, []);

  // Extraire les univers et catégories uniques
  const universOptions = Array.from(new Set(talents.map(t => t.univers).filter(Boolean)));
  
  // Catégories dépendantes de l'univers sélectionné
  const categorieOptions = selectedUnivers 
    ? Array.from(new Set(
        talents
          .filter(t => t.univers === selectedUnivers)
          .map(t => t.categorie)
          .filter(Boolean)
      ))
    : []; // Vide si pas d'univers sélectionné

  // Effet pour réinitialiser la catégorie quand l'univers change
  useEffect(() => {
    setSelectedCategorie("");
  }, [selectedUnivers]);

  const filteredTalents = talents.filter(t => {
    const matchesUnivers = !selectedUnivers || t.univers === selectedUnivers;
    const matchesCategorie = !selectedCategorie || t.categorie === selectedCategorie;
    return matchesUnivers && matchesCategorie;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7]">
      <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
      <p className="text-gray-600 animate-pulse">Chargement des Ambassadeurs...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <button onClick={() => window.location.reload()} className="text-[#008751] font-bold">Réessayer</button>
      </div>
    </div>
  );

  // Bascule vers le mode Swipe
  if (viewMode === 'swipe') {
    return <CandidateSwiper talents={filteredTalents} onBack={() => setViewMode('grid')} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Header Prestigieux */}
      <PrestigiousHeader />
      
      {/* Barre de Filtres & Switch */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] p-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Ligne supérieure : Swipe */}
          <div className="flex justify-end">
            <button 
              onClick={() => setViewMode('swipe')}
              className="flex items-center gap-2 bg-[#008751] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#006B3F] transition-all shadow-md active:scale-95"
            >
              <MousePointer2 className="w-4 h-4" />
              Lancer le mode Swipe
            </button>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtre Univers */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Univers:</label>
              <select
                value={selectedUnivers}
                onChange={(e) => setSelectedUnivers(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#008751] outline-none bg-white"
              >
                <option value="">Tous</option>
                {universOptions.map(univers => (
                  <option key={univers} value={univers}>{univers}</option>
                ))}
              </select>
            </div>
            
            {/* Filtre Catégorie */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Catégorie:</label>
              <select
                value={selectedCategorie}
                onChange={(e) => setSelectedCategorie(e.target.value)}
                disabled={!selectedUnivers}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#E9B113] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedUnivers ? "Sélectionnez une catégorie" : "Sélectionnez d'abord un univers"}
                </option>
                {categorieOptions.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
            </div>
            
            {/* Bouton de réinitialisation */}
            {(selectedUnivers || selectedCategorie) && (
              <button
                onClick={() => {
                  setSelectedUnivers("");
                  setSelectedCategorie("");
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
              >
                <X className="w-3 h-3" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto p-6">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-20">
            <Info className="mx-auto text-gray-400 mb-4" />
            <p>Aucun talent ne correspond aux filtres sélectionnés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTalents.map(talent => (
              <TalentCard 
                key={talent.id} 
                talent={talent} 
                onClick={() => setViewMode('swipe')} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}