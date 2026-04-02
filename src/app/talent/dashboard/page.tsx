"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LogOut, Users, Trophy, ExternalLink, Share2, 
  TrendingUp, Mail, Image as ImageIcon, Video, 
  Plus, X, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- INTERFACES ---
interface Talent {
  id: string;
  prenom: string;
  nom: string;
  avatar_url: string | null;
  bio: string | null;
  categorie: string | null;
  univers: string | null;
  slug: string;
  email?: string;
  cover_images: string[]; // Tableau de 4 max
  video_urls: string[];   // Tableau de 4 max
}

export default function MaPageTalent() {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [stats, setStats] = useState({ totalVotes: 0, ranking: 0, totalTalents: 0 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ type: 'image' | 'video', index: number } | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/talent/login'); return; }

      // 1. Récupérer le talent via auth_user_id
      const { data: talentData, error: tError } = await supabase
        .from('talents')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (tError || !talentData) throw new Error("Talent non trouvé");

      // 2. Calcul des stats (Total historique via voter_id)
      const { count: totalVotes } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('talent_id', talentData.id);

      // 3. Calcul du Ranking simplifié
      const { data: allRankings } = await supabase.rpc('get_talents_ranking'); 
      // Note: get_talents_ranking est une fonction SQL recommandée pour la performance
      
      const currentRank = allRankings?.find((r: any) => r.id === talentData.id)?.rank || 0;
      const totalT = allRankings?.length || 0;

      setTalent({
        ...talentData,
        email: session.user.email,
        cover_images: talentData.cover_images || [],
        video_urls: talentData.video_urls || []
      });
      setStats({ totalVotes: totalVotes || 0, ranking: currentRank, totalTalents: totalT });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- GESTION DES MÉDIAS ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video', index: number) => {
    const file = e.target.files?.[0];
    if (!file || !talent) return;

    // Validation Vidéo (2 minutes max)
    if (type === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 120) {
          alert("La vidéo ne doit pas dépasser 2 minutes.");
          return;
        }
      };
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert("Fichier trop lourd (Max 50Mo)");
        return;
      }
    }

    setUploading({ type, index });
    try {
      const bucket = type === 'image' ? 'covers' : 'videos';
      const fileExt = file.name.split('.').pop();
      const fileName = `${talent.id}-${type}-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);

      // Mise à jour de l'array dans la DB
      const newUrls = type === 'image' ? [...talent.cover_images] : [...talent.video_urls];
      newUrls[index] = publicUrl;

      const updateField = type === 'image' ? { cover_images: newUrls } : { video_urls: newUrls };
      await supabase.from('talents').update(updateField).eq('id', talent.id);
      
      setTalent({ ...talent, ...updateField });
    } catch (err) {
      console.error(uploading);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]"><Loader2 className="animate-spin text-[#008751]" /></div>;

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-20">
      {/* Header Statut */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
            {talent?.avatar_url && <Image src={talent.avatar_url} alt="" fill className="object-cover" />}
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-none">Ma Page</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{talent?.prenom} {talent?.nom}</p>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Users className="text-[#008751]" />} label="Votes Cumulés" value={stats.totalVotes} />
          <StatCard icon={<Trophy className="text-yellow-500" />} label="Classement" value={`#${stats.ranking}`} sub={`sur ${stats.totalTalents}`} />
          <div className="bg-[#008751] rounded-3xl p-6 text-white flex flex-col justify-between">
            <p className="text-xs font-bold uppercase opacity-80">Visibilité</p>
            <button onClick={() => window.open(`/talents/${talent?.slug}`, '_blank')} className="flex items-center justify-between group">
              <span className="text-lg font-bold italic">Voir ma fiche</span>
              <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* MÉDIAS : PHOTOS DE COUVERTURE (4) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><ImageIcon size={20} /> Mes photos de couverture <span className="text-xs text-gray-400 font-normal">(4 max)</span></h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 relative overflow-hidden group bg-white">
                {talent?.cover_images[i] ? (
                  <>
                    <Image src={talent.cover_images[i]} alt="" fill className="object-cover" />
                    <button className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploading?.type === 'image' && uploading.index === i ? <Loader2 className="animate-spin text-[#008751]" /> : <Plus className="text-gray-300" />}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image', i)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MÉDIAS : VIDÉOS (4) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Video size={20} /> Mes vidéos de présentation <span className="text-xs text-gray-400 font-normal">(2 min max)</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-video rounded-3xl border-2 border-dashed border-gray-200 relative overflow-hidden bg-white">
                {talent?.video_urls[i] ? (
                  <video src={talent.video_urls[i]} controls className="w-full h-full object-cover" />
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploading?.type === 'video' && uploading.index === i ? <Loader2 className="animate-spin text-[#008751]" /> : (
                      <>
                        <Video size={32} className="text-gray-200 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ajouter Vidéo {i + 1}</span>
                      </>
                    )}
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video', i)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MESSAGE AUX ÉLECTEURS */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Mon message aux électeurs</h3>
          <textarea 
            className="w-full h-32 p-4 rounded-2xl bg-[#F9F9F7] border-none focus:ring-2 focus:ring-[#008751] text-gray-700 resize-none"
            placeholder="Convainquez les citoyens de voter pour vous..."
            defaultValue={talent?.bio || ""}
            onBlur={async (e) => {
              await supabase.from('talents').update({ bio: e.target.value }).eq('id', talent?.id);
            }}
          />
          <p className="text-[10px] text-gray-400 mt-4 italic flex items-center gap-1">
            <CheckCircle2 size={12} className="text-[#008751]" /> Votre message est automatiquement mis à jour sur votre fiche publique.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: any, label: string, value: string | number, sub?: string }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">{icon}</div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {sub && <span className="text-xs text-gray-400">{sub}</span>}
      </div>
    </div>
  );
}