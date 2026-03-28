"use client";

import { useState } from 'react'; 
import { Lock, Trash2, Upload } from 'lucide-react'; 
import { VIDEO_STEPS } from '@/lib/constants/video-steps'; 
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

interface CandidateDashboardProps {
  profile: Profile;
}

export default function CandidateDashboard({ profile }: CandidateDashboardProps) { 
  const [loading, setLoading] = useState(false); 
  const supabase = createSupabaseBrowserClient();
  
  // Logique d'activation : Seul l'onglet 1 est ouvert pour les 'candidat' 
  const isAmbassadeur = profile.role === 'ambassadeur' || profile.role === 'admin'; 

  const handleUpdateVideo = async (key: string, videoId: string | null) => { 
    setLoading(true); 
    const { error } = await supabase 
      .from('profiles') 
      .update({ [key]: videoId }) 
      .eq('id', profile.id); 
    
    if (!error) { 
      // Refresh local ou state 
      window.location.reload(); 
    } else {
      console.error("Erreur lors de la mise à jour de la vidéo:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
    setLoading(false); 
  }; 

  const handleUploadClick = async (key: string) => {
    const videoId = window.prompt("Entrez l'ID de la vidéo YouTube (ex: dQw4w9WgXcQ) :");
    if (videoId) {
      await handleUpdateVideo(key, videoId);
    }
  };

  return ( 
    <div className="max-w-4xl mx-auto p-4 space-y-8"> 
      <header className="text-center"> 
        <h1 className="font-display text-3xl text-[#E8112D]">Mon Espace Ambassadeur</h1> 
        <p className="text-gray-500 font-sans mt-2">Statut actuel : 
          <span className={`ml-2 font-bold ${isAmbassadeur ? 'text-[#008751]' : 'text-orange-500'}`}> 
            {profile.role.toUpperCase()} 
          </span> 
        </p> 
        <p className="text-sm font-bold text-black mt-2">
          {`${profile.prenom || ''} ${profile.nom || ''}`.trim() || "Profil sans nom"}
        </p>
      </header> 

      {/* Grille des 4 Vidéos */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        {VIDEO_STEPS.map((step) => { 
          const videoId = profile[step.key as keyof Profile] as string | null; 
          const isLocked = step.id > 1 && !isAmbassadeur; 

          return ( 
            <div key={step.id} className={`relative p-6 rounded-2xl border-2 transition-all ${ 
              isLocked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-[#008751]/20 shadow-sm' 
            }`}> 
              {isLocked && ( 
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 rounded-2xl z-10"> 
                  <Lock className="w-8 h-8 text-gray-400 mb-2" /> 
                  <p className="text-xs font-medium text-gray-500 px-4 text-center"> 
                    Débloqué après validation du jury de présélection 
                  </p> 
                </div> 
              )} 

              <div className="flex justify-between items-start mb-4"> 
                <div> 
                  <h3 className="font-bold text-lg">{step.label}</h3> 
                  <p className="text-xs text-gray-400">{step.desc}</p> 
                </div> 
                {videoId && ( 
                   <span className="bg-[#008751]/10 text-[#008751] text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest"> 
                     EN LIGNE 
                   </span> 
                )} 
              </div> 

              {/* Zone d'action Video */} 
              <div className="mt-4"> 
                {videoId ? ( 
                  <div className="space-y-3"> 
                    <div className="aspect-video bg-black rounded-lg overflow-hidden"> 
                      {/* Preview simple */} 
                      <iframe 
                        className="w-full h-full" 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title={step.label} 
                        allowFullScreen
                      /> 
                    </div> 
                    <button 
                      onClick={() => handleUpdateVideo(step.key, null)} 
                      disabled={loading}
                      className="flex items-center text-[#E8112D] text-sm hover:font-bold transition-all" 
                    > 
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer et remplacer 
                    </button> 
                  </div> 
                ) : ( 
                  <button 
                    onClick={() => handleUploadClick(step.key)}
                    disabled={isLocked || loading} 
                    className="w-full py-8 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center hover:border-[#E8112D] hover:bg-red-50 transition-all group" 
                  > 
                    <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#E8112D] mb-2" /> 
                    <span className="text-sm text-gray-400 group-hover:text-[#E8112D]">Ajouter ma vidéo</span> 
                  </button> 
                )} 
              </div> 
            </div> 
          ); 
        })} 
      </div> 

      {/* --- Zone Historique des Votes --- */} 
      <section className="bg-[#F9F9F7] p-8 rounded-2xl border border-[#008751]/10"> 
        <h2 className="font-display text-xl mb-4">Mes derniers votes</h2> 
        <div className="text-sm text-gray-500"> 
           Vous n'avez pas encore voté pour d'autres talents. 
           <a href="/talents" className="text-[#E8112D] ml-2 underline font-bold">Découvrir les talents</a> 
        </div> 
      </section> 

      {/* --- Zone Publicitaire --- */} 
      <footer className="mt-12 pt-8 border-t border-gray-100"> 
        <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-between text-white"> 
          <div> 
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Partenaire Officiel</p> 
            <p className="font-bold text-lg">Découvrez les saveurs du Bénin</p> 
          </div> 
          <div className="w-24 h-12 bg-gray-800 rounded-lg flex items-center justify-center italic text-xs font-bold text-gray-400"> 
            Pub_Logo 
          </div> 
        </div> 
      </footer> 
    </div> 
  ); 
}
