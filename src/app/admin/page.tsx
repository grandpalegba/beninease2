"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client"; 
import { ImageIcon, Trash2, Video, RefreshCw } from "lucide-react";

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
      .from("talents")
      .select("id, prenom, nom, avatar_url, city, description, categorie, type, votes")
      .order("id", { ascending: false })
      .limit(500);

    if (e1) {
      setError(e1.message);
      setLoading(false);
      return;
    }

    setTalents((data ?? []) as AdminProfile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeleteProfile = async (p: AdminProfile) => {
    if (!window.confirm("Supprimer définitivement ?")) return;
    try {
      setBusyId(p.id);
      if (p.avatar_url) await removeFromBucketByPublicUrl("profile-avatars", p.avatar_url);
      const { error: e } = await supabase.from("talents").delete().eq("id", p.id);
      if (e) throw e;
      setTalents((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestion des profils</h1>
      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Profil</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {talents.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 relative overflow-hidden">
                      {p.avatar_url && <Image src={p.avatar_url} alt="" fill className="object-cover" />}
                    </div>
                    <span className="font-medium text-black">{p.prenom} {p.nom}</span>
                  </div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDeleteProfile(p)}
                    disabled={busyId === p.id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}