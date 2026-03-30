/**
 * PAGE PROTÉGÉE - MODÉRATION ADMIN
 * Role: Gestion détaillée des profils, vidéos et photos de couverture.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Trash2, Video, RefreshCw } from "lucide-react";

type AdminProfile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
  categorie: string | null;
  type: "candidate" | "jury" | string;
  votes: number | null;
};

type VideoRow = {
  talent_id: string;
  video_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

type MediaMap = Record<string, Record<string, VideoRow>>;

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

export default function AdminManagePage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [talents, setTalents] = useState<AdminProfile[]>([]);
  const [media, setMedia] = useState<MediaMap>({});

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
      .from("Talents")
      .select("id, prenom, nom, avatar_url, city, description, categorie, type, votes, updated_at")
      .order("updated_at", { ascending: false })
      .limit(500);

    if (e1) {
      setError(e1.message);
      setTalents([]);
      setMedia({});
      setLoading(false);
      return;
    }

    const list = (data ?? []) as AdminProfile[];
    setTalents(list);

    const ids = list.map((p) => p.id);
    if (ids.length === 0) {
      setMedia({});
      setLoading(false);
      return;
    }

    const { data: vids, error: e2 } = await supabase
      .from("Videos")
      .select("talent_id, video_type, video_url, thumbnail_url")
      .in("talent_id", ids)
      .limit(2000);

    if (e2) {
      setMedia({});
      setLoading(false);
      return;
    }

    const map: MediaMap = {};
    (vids ?? []).forEach((v) => {
      const row = v as unknown as VideoRow;
      map[row.talent_id] = map[row.talent_id] ?? {};
      map[row.talent_id][row.video_type] = row;
    });
    setMedia(map);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmOrReturn = (text: string) => {
    return window.confirm(text);
  };

  const handleDeleteProfile = async (p: AdminProfile) => {
    if (!confirmOrReturn("Êtes-vous sûr ? Cette suppression est définitive.")) return;
    try {
      setBusyId(p.id);
      setError(null);

      const rows = media[p.id] ? Object.values(media[p.id]) : [];
      for (const r of rows) {
        if (r.video_url) await removeFromBucketByPublicUrl("candidate-videos", r.video_url);
        if (r.thumbnail_url) await removeFromBucketByPublicUrl("video-thumbnails", r.thumbnail_url);
      }

      if (p.avatar_url) await removeFromBucketByPublicUrl("profile-avatars", p.avatar_url);

      const { error: e } = await supabase.rpc("admin_delete_profile", { p_profile_id: p.id });
      if (e) throw e;

      setTalents((prev) => prev.filter((x) => x.id !== p.id));
      setMedia((prev) => {
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

  const handleResetAvatar = async (p: AdminProfile) => {
    if (!p.avatar_url) return;
    if (!confirmOrReturn("Êtes-vous sûr ? Supprimer la photo de profil ?")) return;
    try {
      setBusyId(p.id);
      setError(null);
      await removeFromBucketByPublicUrl("profile-avatars", p.avatar_url);
      const { error: e } = await supabase.rpc("admin_reset_avatar", { p_profile_id: p.id });
      if (e) throw e;
      setTalents((prev) => prev.map((x) => (x.id === p.id ? { ...x, avatar_url: null } : x)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleResetMedia = async (
    talentId: string,
    videoType: string,
    mode: "video" | "thumbnail",
  ) => {
    const row = media[talentId]?.[videoType];
    if (!row) return;
    const label = mode === "video" ? "la vidéo" : "la photo de couverture";
    if (!confirmOrReturn(`Êtes-vous sûr ? Supprimer ${label} (${videoType}) ?`)) return;

    try {
      setBusyId(talentId);
      setError(null);

      if (mode === "video" && row.video_url) {
        await removeFromBucketByPublicUrl("candidate-videos", row.video_url);
      }
      if (mode === "thumbnail" && row.thumbnail_url) {
        await removeFromBucketByPublicUrl("video-thumbnails", row.thumbnail_url);
      }

      const { error: e } = await supabase.rpc("admin_reset_candidate_media", {
        p_candidate_id: talentId,
        p_video_type: videoType,
        p_reset_video: mode === "video",
        p_reset_thumbnail: mode === "thumbnail",
      });
      if (e) throw e;

      setMedia((prev) => {
        const next = { ...prev };
        const current = next[talentId] ? { ...next[talentId] } : {};
        const updated = { ...(current[videoType] ?? row) };
        if (mode === "video") updated.video_url = null;
        if (mode === "thumbnail") updated.thumbnail_url = null;
        if (!updated.video_url && !updated.thumbnail_url) {
          delete current[videoType];
        } else {
          current[videoType] = updated;
        }
        next[talentId] = current;
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
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#1A1A1A]">Modération</h1>
            <p className="mt-2 text-sm text-[#8E8E8E]">
              Gestion des profils, vidéos et photos de couverture (admin).
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
            <table className="w-full min-w-[980px]">
              <thead className="bg-[#F9F9F7] border-b border-[#F2EDE4]">
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
                ) : talents.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-sm text-[#8E8E8E]" colSpan={6}>
                      Aucun talent.
                    </td>
                  </tr>
                ) : (
                  talents.map((p) => {
                    const fullName = `${p.prenom || ""} ${p.nom || ""}`.trim() || "Profil";
                    const isBusy = busyId === p.id;
                    const mediaByType = media[p.id] ?? {};
                    return (
                      <tr key={p.id} className="border-b border-[#F2EDE4] last:border-b-0">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-[#F9F9F7] ring-2 ring-[#C5A267]/20 relative">
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
                              <p className="truncate text-sm font-semibold text-[#1A1A1A]">{fullName}</p>
                              <p className="truncate text-[11px] text-[#8E8E8E]">
                                {p.city ?? ""} {p.description ? `• ${p.description}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full border border-[#E9E2D6] bg-[#F9F9F7] px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-[#C5A267]">
                            {p.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#1A1A1A]">
                          <span className="text-[11px] text-[#8E8E8E]">{p.categorie ?? "—"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-[#1A1A1A]">{p.votes ?? 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          {p.type === "candidate" ? (
                            <div className="grid grid-cols-2 gap-2">
                              {dimensions.map((d) => {
                                const r = mediaByType[d];
                                const hasVideo = !!r?.video_url;
                                const hasThumb = !!r?.thumbnail_url;
                                return (
                                  <div key={d} className="rounded-xl border border-[#F2EDE4] bg-[#F9F9F7] px-3 py-2">
                                    <p className="text-[9px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                                      {d}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                      <button
                                        type="button"
                                        disabled={!hasVideo || isBusy}
                                        onClick={() => handleResetMedia(p.id, d, "video")}
                                        className="inline-flex items-center justify-center gap-1 rounded-full border border-[#E9E2D6] bg-white px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Supprimer la vidéo"
                                      >
                                        <Video className="h-3 w-3" /> Vidéo
                                      </button>
                                      <button
                                        type="button"
                                        disabled={!hasThumb || isBusy}
                                        onClick={() => handleResetMedia(p.id, d, "thumbnail")}
                                        className="inline-flex items-center justify-center gap-1 rounded-full border border-[#E9E2D6] bg-white px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        title="Supprimer la photo de couverture"
                                      >
                                        <ImageIcon className="h-3 w-3" /> Photo
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#8E8E8E]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              disabled={isBusy || !p.avatar_url}
                              onClick={() => handleResetAvatar(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E9E2D6] bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-[#8E8E8E] hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <ImageIcon className="h-4 w-4" /> Reset avatar
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleDeleteProfile(p)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Trash2 className="h-4 w-4" /> Supprimer profil
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
