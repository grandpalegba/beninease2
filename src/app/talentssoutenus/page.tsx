"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { supabase } from "@/utils/supabase/client"; // Uniformisation du chemin

export default function SupportedTalentsPage() {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportedTalents = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from('votes')
        .select(`*, talents(*)`)
        .eq('voter_id', session.user.id);

      if (!error && data) {
        setTalents(data.map(v => v.talents));
      }
      setLoading(false);
    };
    fetchSupportedTalents();
  }, [router]);

  // ... (Rendu visuel identique)
}