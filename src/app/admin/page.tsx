/**
 * PAGE PROTÉGÉE - ADMINISTRATION AVANCÉE
 * Role: Dashboard principal d'administration pour la gestion des catégories, 
 * médias (vidéos/avatars) et suppression de profils.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Trash2, Video, RefreshCw, Save } from "lucide-react";

type AdminProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
  category: string | null;
  type: "candidate" | "jury" | string;
  votes_count: number | null;
};

type VideoRow = {
  candidate_id: string;
  video_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

type VideosByCandidate = Record<string, Record<string, VideoRow>>;

const categories = [
  "Tourisme & Découvertes",
  "Coutumes & Traditions",
  "Événementiel & Vie Nocturne",
  "Hébergement & Séjour",
  "Alimentation & Cuisine",
  "Bien-être & Fitness",
  "Mode & Beauté",
  "Marchés & Produits Locaux",
  "Transport & Mobilité",
  "Assistance & Travaux",
  "Santé & Médecine",
  "Service & Assistance",
  "Facilitateurs & Conciergerie",
  "Création & Médias",
  "Immobilier & Construction",
  "Business & Entreprises",
];

const dimensions = ["QUI JE SUIS", "MON HISTOIRE", "MON SERVICE", "POURQUOI MOI"];

const getStoragePathFromPublicUrl = (publicUrl: string, bucket: string): string | null => {
  try {
    const url = new URL(publicUrl);
    const marker = `/${bucket}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.pathname.slice(idx + marker.length));
  } catch {
    return null;
  }
};

export default function AdminAdvancedDashboardPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [videos, setVideos] = useState<VideosByCandidate>({});
  const [selectedDimension, setSelectedDimension] = useState<Record<string, string>>({});

  const removeFromBucketByPublicUrl = async (bucket: string, publicUrl: string) => {
    const path = getStoragePathFromPublicUrl(publicUrl, bucket);
    if (!path) return;
    const { error: e } = await supabase.storage.from(bucket).remove([path]);
    if (e) throw e;
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: e1 } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, city, description, category, type, votes_count, updated_at")
      .order("updated_at", { ascending: false })
      .limit(800);

    if (e1) {
      setError(e1.message);
      setProfiles([]);
      setVideos({});
      setLoading(false);
      return;
    }

    const list = (data ?? []) as AdminProfile[];
    setProfiles(list);

    const candidateIds = list.filter((p) => p.type === "candidate").map((p) => p.id);
    if (candidateIds.length === 0) {
      setVideos({});
      setLoading(false);
      return;
    }

    const { data: vids } = await supabase
      .from("videos")
      .select("candidate_id, video_type, video_url, thumbnail_url")
      .in("candidate_id", candidateIds)
      .limit(4000);

    const map: VideosByCandidate = {};
    (vids ?? []).forEach((v) => {
      const row = v as unknown as VideoRow;
      map[row.candidate_id] = map[row.candidate_id] ?? {};
      map[row.candidate_id][row.video_type] = row;
    });
    setVideos(map);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmOrReturn = (text: string) => window.confirm(text);

  const handleSetCategory = async (profileId: string, category: string) => {
    if (!confirmOrReturn("Modifier la catégorie de ce profil ?")) return;
    try {
      setBusyId(profileId);
      setError(null);
      const { error: e } = await supabase.rpc("admin_set_profile_category", {
        p_profile_id: profileId,
        p_category: category,
      });
      if (e) throw e;
      setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, category } : p)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteAvatar = async (p: AdminProfile) => {
    if (!p.avatar_url) return;
    if (!confirmOrReturn("Êtes-vous sûr ? Supprimer la photo de profil ?")) return;
    try {
      setBusyId(p.id);
      setError(null);
      await removeFromBucketByPublicUrl("profile-avatars", p.avatar_url);
      const { error: e } = await supabase.rpc("admin_reset_avatar", { p_profile_id: p.id });
      if (e) throw e;
      setProfiles((prev) => prev.map((x) => (x.id === p.id ? { ...x, avatar_url: null } : x)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteVideo = async (candidateId: string) => {
    const dim = selectedDimension[candidateId] ?? dimensions[0];
    if (!confirmOrReturn(`Êtes-vous sûr ? Supprimer la vidéo (${dim}) ?`)) return;
    const row = videos[candidateId]?.[dim];
    if (!row?.video_url) return;

    try {
      setBusyId(candidateId);
      setError(null);
      await removeFromBucketByPublicUrl("candidate-videos", row.video_url);
      const { error: e } = await supabase.rpc("admin_reset_candidate_media", {
        p_candidate_id: candidateId,
        p_video_type: dim,
        p_reset_video: true,
        p_reset_thumbnail: false,
      });
      if (e) throw e;

      setVideos((prev) => {
        const next = { ...prev };
        const byType = { ...(next[candidateId] ?? {}) };
        const updated = { ...(byType[dim] ?? row), video_url: null };
        if (!updated.video_url && !updated.thumbnail_url) delete byType[dim];
        else byType[dim] = updated;
        next[candidateId] = byType;
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteProfile = async (p: AdminProfile) => {
    if (!confirmOrReturn("Êtes-vous sûr ? Cette suppression est définitive.")) return;
    try {
      setBusyId(p.id);
      setError(null);

      if (p.type === "candidate") {
        const rows = videos[p.id] ? Object.values(videos[p.id]) : [];
        for (const r of rows) {
          if (r.video_url) await removeFromBucketByPublicUrl("candidate-videos", r.video_url);
          if (r.thumbnail_url) await removeFromBucketByPublicUrl("video-thumbnails", r.thumbnail_url);
        }
      }
      if (p.avatar_url) await removeFromBucketByPublicUrl("profile-avatars", p.avatar_url);

      const { error: e } = await supabase.rpc("admin_delete_profile", { p_profile_id: p.id });
      if (e) throw e;

      setProfiles((prev) => prev.filter((x) => x.id !== p.id));
      setVideos((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#1A1A1A]">Admin</h1>
            <p className="mt-2 text-sm text-[#8E8E8E]">
              Catégories, médias et suppression (tableau de bord).
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] bg-white px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4" /> Actualiser
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#F2EDE4] bg-white px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-[24px] border border-[#F2EDE4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-[#FFFDF9] border-b border-[#F2EDE4]">
                <tr className="text-left">
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Profil
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Type
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Catégorie
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Votes
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Médias
                  </th>
                  <th className="px-5 py-4 text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-5 py-8 text-sm text-[#8E8E8E]" colSpan={6}>
                      Chargement…
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-sm text-[#8E8E8E]" colSpan={6}>
                      Aucun profil.
                    </td>
                  </tr>
                ) : (
                  profiles.map((p) => {
                    const isBusy = busyId === p.id;
                    const name = p.full_name?.trim() || "Profil";
                    const cat = p.category ?? "";
                    const dim = selectedDimension[p.id] ?? dimensions[0];
                    const hasVideo = p.type === "candidate" ? !!videos[p.id]?.[dim]?.video_url : false;

                    return (
                      <tr key={p.id} className="border-b border-[#F2EDE4] last:border-b-0">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-[#F8F5F0] ring-2 ring-[#C5A267]/20 relative">
                              {p.avatar_url ? (
                                <Image
                                  src={p.avatar_url}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-[#C5A267]/45" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#1A1A1A]">{name}</p>
                              <p className="truncate text-[11px] text-[#8E8E8E]">
                                {p.city ?? ""} {p.description ? `• ${p.description}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full border border-[#E9E2D6] bg-[#FFFDF9] px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-[#C5A267]">
                            {p.type}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={cat}
                              onChange={(e) =>
                                setProfiles((prev) =>
                                  prev.map((x) => (x.id === p.id ? { ...x, category: e.target.value } : x)),
                                )
                              }
                              className="w-72 rounded-full border border-[#E9E2D6] bg-[#FFFDF9] px-4 py-2 text-xs text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#C5A267]/30"
                              disabled={isBusy}
                            >
                              <option value="">—</option>
                              {categories.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSetCategory(p.id, (p.category ?? "").trim())}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Enregistrer la catégorie"
                            >
                              <Save className="h-4 w-4" /> Enregistrer
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-[#1A1A1A]">{p.votes_count ?? 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          {p.type === "candidate" ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={dim}
                                onChange={(e) =>
                                  setSelectedDimension((prev) => ({ ...prev, [p.id]: e.target.value }))
                                }
                                className="rounded-full border border-[#E9E2D6] bg-[#FFFDF9] px-4 py-2 text-xs text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#C5A267]/30"
                                disabled={isBusy}
                              >
                                {dimensions.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={isBusy || !hasVideo}
                                onClick={() => handleDeleteVideo(p.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Supprimer la vidéo"
                              >
                                <Video className="h-4 w-4" /> Supprimer la vidéo
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#8E8E8E]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy || !p.avatar_url}
                              onClick={() => handleDeleteAvatar(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Supprimer la photo de profil"
                            >
                              <ImageIcon className="h-4 w-4" /> Supprimer la photo
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleDeleteProfile(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="h-4 w-4" /> Supprimer le profil
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

