"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          // Si pas connecté → rediriger vers login
          window.location.href = "/login";
          return;
        }

        // Si connecté → rediriger vers dashboard votant
        window.location.href = "/dashboard/votant";
      } catch (err) {
        console.error("Erreur callback auth:", err);
        // En cas d'erreur → rediriger vers login
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#008751]" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
      <div className="text-center">
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}
