"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import CandidateDashboard from "@/components/CandidateDashboard";
import { Loader2 } from "lucide-react";
import type { Talent } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching talent profile:", error);
        // If profile doesn't exist, we might want to redirect to postuler or show an error
        setLoading(false);
        return;
      }

      setProfile(data as Talent);
      setLoading(false);
    }

    getProfile();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin mb-4" />
        <p className="text-gray-500 font-sans font-medium">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F9F7] p-6 text-center">
        <h1 className="text-2xl font-display font-bold text-black mb-4">Profil introuvable</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Nous n&apos;avons pas pu charger vos informations. Assurez-vous d&apos;avoir complété votre inscription.
        </p>
        <button 
          onClick={() => router.push("/postuler")}
          className="px-8 py-3 bg-[#008751] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#008751]/90 transition-all"
        >
          Devenir Ambassadeur
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-10">
      <CandidateDashboard profile={profile} />
    </div>
  );
}
