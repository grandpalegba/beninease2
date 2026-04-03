"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function VoterDashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Utilisateur");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login"; // ✅ pas de router.push
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("prenom, nom")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setName(`${data.prenom || ""} ${data.nom || ""}`);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Bienvenue {name}</h1>
    </div>
  );
}