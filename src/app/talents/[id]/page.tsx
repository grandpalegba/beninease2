"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Heart, Image as ImageIcon, MapPin, Play } from "lucide-react";

type TalentProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
  votes_count: number | null;
};

type VideoRow = {
  candidate_id: string;
  video_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

type VideosByType = Record<string, VideoRow>;

export default function TalentSanctuaryPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const params = useParams();
  const resolvedParams = React.use(params as unknown as Promise<{ id: string }>);
  const id = resolvedParams?.id;

  const [activeTab, setActiveTab] = useState("Qui je suis");
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [videos, setVideos] = useState<VideosByType>({});
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["Qui je suis", "Mon histoire", "Mon service", "Pourquoi moi"];
  const dimensionsMapping: Record<string, string> = {
    "Qui je suis": "QUI JE SUIS",
    "Mon histoire": "MON HISTOIRE",
    "Mon service": "MON SERVICE",
    "Pourquoi moi": "POURQUOI MOI",
  };

  const activeDimension = dimensionsMapping[activeTab];
  const activeVideo = videos[activeDimension];
  const activeVideoUrl = activeVideo?.video_url ?? undefined;

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, city, description, votes_count")
        .eq("id", id)
        .maybeSingle();

      if (profileError || !profileData) {
        setError(profileError?.message || "Profil introuvable.");
        setProfile(null);
        setVideos({});
        setLoading(false);
        return;
      }

      setProfile(profileData as TalentProfile);

      const { data: vids } = await supabase
        .from("videos")
        .select("*")
        .eq("candidate_id", id);

      const typedVids = (vids ?? []) as unknown as VideoRow[];
      const vidsObj = typedVids.reduce<VideosByType>((acc, v) => {
        acc[v.video_type] = v;
        return acc;
      }, {});
      setVideos(vidsObj);

      setLoading(false);
    };

    load();
  }, [id, supabase]);

  const handleVote = async () => {
    if (!profile) return;
    try {
      setVoting(true);
      const { data, error: voteError } = await supabase.rpc("increment_votes", {
        profile_id: profile.id,
      });
      if (voteError) throw voteError;
      const nextVotes = typeof data === "number" ? data : (profile.votes_count ?? 0) + 1;
      setProfile((prev) => (prev ? { ...prev, votes_count: nextVotes } : prev));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erreur inconnue";
      setError(message);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 text-center text-[#8E8E8E]">
          Chargement du sanctuaire…
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10">
          <p className="text-sm text-red-700">{error ?? "Profil introuvable."}</p>
          <button
            type="button"
            onClick={() => router.push("/talents")}
            className="mt-6 rounded-full border border-[#E9E2D6] px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors"
          >
            Retour aux talents
          </button>
        </div>
      </div>
    );
  }

  const name = profile.full_name?.trim() || "Talent";
  const subtitle = profile.description?.trim() || "Découvrir les vidéos";
  const votes = profile.votes_count ?? 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-36 h-36 bg-[#F8F5F0] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-[#C5A267]/45" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[34px] font-display font-bold text-[#1A1A1A] leading-tight">
                {name}
              </h1>
              <p className="text-[#C5A267] font-medium text-sm mt-2 uppercase tracking-wider">
                {subtitle}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-[#8E8E8E] text-[11px] font-medium uppercase tracking-widest">
                {profile.city ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {profile.city}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#C5A267]" /> {votes} votes
                </span>
              </div>

              <button
                type="button"
                onClick={handleVote}
                disabled={voting}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] transition-colors hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Heart className="w-4 h-4" /> {voting ? "…" : "Voter"}
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 md:px-12 border-b border-[#F2EDE4]">
          <div className="flex justify-between md:justify-start md:gap-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-semibold transition-all relative ${
                  activeTab === tab ? "text-[#C5A267]" : "text-[#8E8E8E] hover:text-[#555]"
                }`}
              >
                {tab}
                {activeTab === tab ? (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A267]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12 pb-4">
          <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-[0.2em] mb-4">
            Aperçu des vidéos
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const dimension = dimensionsMapping[tab];
              const v = videos[dimension];
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative aspect-video rounded-[15px] overflow-hidden group transition-all duration-500 ${
                    activeTab === tab
                      ? "ring-2 ring-[#C5A267] ring-offset-4 scale-[1.02] shadow-lg"
                      : "opacity-70 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  {v?.thumbnail_url ? (
                    <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-[#C5A267]/45" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[9px] font-bold text-white uppercase tracking-widest text-center">
                      {dimension}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-8 md:px-12 pb-12">
          <div className="relative aspect-video bg-[#1A1A1A] rounded-[30px] overflow-hidden shadow-2xl group border-[8px] border-white ring-1 ring-[#F2EDE4]">
            {activeVideoUrl ? (
              <video key={activeVideoUrl} src={activeVideoUrl} controls className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#222]">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Play className="w-5 h-5 text-[#C5A267]" />
                  </div>
                  <span className="text-white text-xs font-semibold tracking-normal">
                    Aucune vidéo pour « {activeDimension} »
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

