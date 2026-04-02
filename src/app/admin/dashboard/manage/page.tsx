/**
 * PAGE PROTÉGÉE - ADMINISTRATION AVANCÉE
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client"; // Import Singleton corrigé
import { ImageIcon, Trash2, Video, RefreshCw, Save } from "lucide-react"; // Import icône corrigé

type AdminProfile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
  categorie: string | null;
  univers: string | null;
  type: "candidate" | "jury" | string;
  votes: number | null;
};

// ... (garder types VideoRow, VideosByCandidate et constantes categories/dimensions)

export default function AdminAdvancedDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [talents, setTalents] = useState<AdminProfile[]>([]);
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
      .from("talents") // Table en minuscules pour correspondre à Supabase
      .select("id, prenom, nom, avatar_url, city, description, categorie, univers, type, votes")
      .order("votes", { ascending: false });

    if (e1) {
      setError(e1.message);
      setLoading(false);
      return;
    }

    setTalents((data ?? []) as AdminProfile[]);
    setLoading(false);
  }, []); // Dépendance vide car supabase est un singleton externe

  useEffect(() => {
    load();
  }, [load]);

  // ... (Reste du code identique mais utilisant 'supabase' directement)
}