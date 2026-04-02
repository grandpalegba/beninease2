/**
 * PAGE PUBLIQUE - DÉTAIL JURY
 * Role: Affiche le profil complet d'un membre du jury via son slug.
 */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Image as ImageIcon, MapPin } from "lucide-react";

type JuryProfile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
};

type VideoRow = {
  talent_id: string;
  video_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

type VideosByType = Record<string, VideoRow>;

export default function JuryProfilePage({ params }: { params: { slug: string } }) {
  const id = params?.slug;
  const router = useRouter();

  const [profile, setProfile] = useState<JuryProfile | null>(null);
  const [videos, setVideos] = useState<VideosByType>({});
  const [activeTab, setActiveTab] = useState("Qui je suis");
  const [loading, setLoading] = useState(true);
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
      const { data: p, error: e1 } = await supabase
        .from('talents')
        .select("id, prenom, nom, avatar_url, city, description, type")
        .eq("id", id)
        .maybeSingle();
      if (e1 || !p) {
        setError(e1?.message || "Profil introuvable.");
        setLoading(false);
        return;
      }
      setProfile({
        id: p.id,
        prenom: p.prenom,
        nom: p.nom,
        avatar_url: p.avatar_url,
        city: p.city,
        description: p.description,
      });
      const { data: vids } = await supabase
        .from("Videos")
        .select("*")
        .eq("talent_id", id);
      const typed = (vids ?? []) as unknown as VideoRow[];
      const map: VideosByType = typed.reduce((acc, v) => {
        acc[v.video_type] = v;
        return acc;
      }, {} as VideosByType);
      setVideos(map);
      setLoading(false);
    };
    load();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 text-center text-[#8E8E8E] font-sans">
          Chargement du sanctuaire…
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#F2EDE4] bg-white p-10 font-sans text-center">
          <p className="text-sm text-red-700">{error ?? "Profil introuvable."}</p>
          <button
            type="button"
            onClick={() => router.push("/jury")}
            className="mt-6 rounded-full border border-[#E9E2D6] px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] hover:bg-[#004d3d] hover:text-white hover:border-[#004d3d] transition-colors"
          >
            Retour au jury
          </button>
        </div>
      </div>
    );
  }

  const name = `${profile.prenom || ""} ${profile.nom || ""}`.trim() || "Membre du jury";
  const subtitle = profile.description?.trim() || "Profil du jury";

  return (
    <div className="min-h-screen bg-[#F9F9F7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-36 h-36 bg-[#F9F9F7] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex items-center justify-center relative">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-[#004d3d]/45" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[34px] font-display font-bold text-[#1A1A1A] leading-tight">
                {name}
              </h1>
              <div className="mt-2 inline-flex items-center rounded-full border border-[#E9E2D6] bg-[#F9F9F7] px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-[#004d3d]">
                Membre du jury
              </div>
              <p className="text-[#8E8E8E] text-sm mt-3">{subtitle}</p>
              {profile.city ? (
                <p className="mt-2 text-[11px] uppercase tracking-widest text-[#8E8E8E] inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-black" /> {profile.city}
                </p>
              ) : null}
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
                  activeTab === tab ? "text-[#004d3d]" : "text-[#8E8E8E] hover:text-[#004d3d]/70"
                }`}
              >
                {tab}
                {activeTab === tab ? (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#004d3d]" />
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
                      ? "ring-2 ring-[#004d3d] ring-offset-4 scale-[1.02] shadow-lg"
                      : "opacity-70 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  {v?.thumbnail_url ? (
                    <Image
                      src={v.thumbnail_url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2A2A2A] flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-[#004d3d]/45" />
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
