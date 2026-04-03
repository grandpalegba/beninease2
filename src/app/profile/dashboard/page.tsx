"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { supabase } from "@/utils/supabase/client";
import { VideoTabs } from "@/components/VideoTabs";
import { VoteHistory } from "@/components/VoteHistory";
import { AdBanner } from "@/components/AdBanner";
import { Loader2, User, Award, Shield, LogOut } from "lucide-react";
import type { Talent, UserRole, VideoSchema } from "@/types";
import { updateVideoId } from "@/lib/supabase/queries";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching talent profile:", error);
        return;
      }

      setProfile(data as Talent);
      setLoading(false);
    }

    getProfile();
  }, [supabase, router]);

  const handleUpload = async (index: number) => {
    // Simulation d'upload (YouTube API integration later)
    const videoId = window.prompt("Entrez l'ID de la vidéo YouTube (ex: dQw4w9WgXcQ) :");
    if (videoId && profile) {
      try {
        await updateVideoId(profile.id, (index + 1) as 1 | 2 | 3 | 4, videoId);
        setProfile({
          ...profile,
          [`video_${index + 1}_id`]: videoId
        } as Talent);
      } catch {
        alert("Erreur lors de la mise à jour de la vidéo.");
      }
    }
  };

  const handleDelete = async (index: number) => {
    if (window.confirm("Supprimer cette vidéo ?") && profile) {
      try {
        await updateVideoId(profile.id, (index + 1) as 1 | 2 | 3 | 4, null);
        setProfile({
          ...profile,
          [`video_${index + 1}_id`]: null
        } as Talent);
      } catch {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const videoIds: VideoSchema = {
    video_1_id: profile.video_1_id,
    video_2_id: profile.video_2_id,
    video_3_id: profile.video_3_id,
    video_4_id: profile.video_4_id,
  };

  const roleLabels: Record<UserRole, { label: string; icon: ComponentType<{ className?: string }>; color: string }> = {
    votant: { label: "Votant", icon: Heart, color: "text-red-500 bg-red-50" },
    candidat: { label: "Candidat", icon: User, color: "text-[#008751] bg-[#008751]/10" },
    ambassadeur: { label: "Ambassadeur", icon: Award, color: "text-amber-600 bg-amber-50" },
    jury: { label: "Jury", icon: Shield, color: "text-[#004d3d] bg-[#004d3d]/10" },
    admin: { label: "Admin", icon: Shield, color: "text-purple-600 bg-purple-50" },
  };

  const currentRole = roleLabels[profile.role as UserRole] || roleLabels.votant;
  const fullName = `${profile.prenom || ''} ${profile.nom || ''}`.trim() || "Utilisateur";

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-10 md:pt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentRole.color} text-xs font-bold uppercase tracking-widest`}>
              <currentRole.icon className="w-3.5 h-3.5" />
              {currentRole.label}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-black">
              Bienvenue, {fullName}
            </h1>
            <p className="text-gray-500 font-sans">
              Gérez votre profil et suivez votre impact sur Beninease.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100 transition-all font-bold text-xs uppercase tracking-widest bg-white shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Video Manager */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#008751] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#008751]/30" />
                Gestionnaire de vidéos
              </h3>
              <VideoTabs
                role={profile.role as UserRole}
                videoIds={videoIds}
                activeTabIndex={activeTab}
                onTabChange={setActiveTab}
                onUpload={handleUpload}
                onDelete={handleDelete}
                isEditable={true}
              />
            </section>
          </div>

          {/* Sidebar - Stats & History */}
          <div className="space-y-12">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#008751] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#008751]/30" />
                Historique des soutiens
              </h3>
              <VoteHistory voterWhatsapp={profile.id} />
            </section>
          </div>
        </div>

        {/* Bottom Banner */}
        <AdBanner />
      </div>
    </div>
  );
}
