"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Save, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

type Profile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
};

export default function ParametresPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // On cherche dans la table 'profiles' (id, prenom, nom, avatar_url)
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error loading profile:", error);
        }

        if (profileData) {
          setProfile(profileData);
          setPrenom(profileData.prenom || "");
          setNom(profileData.nom || "");
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase, router]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // Chemin dans le bucket 'avatars'

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Mise à jour immédiate du state local pour l'affichage
      if (profile) setProfile({ ...profile, avatar_url: publicUrl });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          prenom: prenom.trim() || null,
          nom: nom.trim() || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert("Profil citoyen mis à jour !");
      router.refresh(); // Pour forcer le dashboard à voir les changements
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-12 h-12 text-[#008751] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-20">
      <div className="bg-white border-b border-[#F2EDE4] pt-12 pb-8 px-6">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/dashboard/votant"
            className="inline-flex items-center gap-2 text-[#008751] font-medium text-sm mb-6 hover:underline"
          >
            <ArrowLeft size={16} />
            Retour au dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold text-black mb-2">Paramètres du profil</h1>
          <p className="text-gray-600 text-sm">Prénom, Nom et Photo de profil</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#F2EDE4] shadow-sm"
        >
          {/* AVATAR SECTION */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profil" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <User size={48} className="text-[#008751]" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {uploading && <p className="text-[10px] text-[#008751] font-bold mt-2 animate-pulse uppercase">Téléchargement...</p>}
          </div>

          {/* FORM SECTION */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-4 py-3 border border-[#F2EDE4] rounded-xl focus:ring-2 focus:ring-[#008751]/20 outline-none transition-all"
                placeholder="Ex: Koffi"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-4 py-3 border border-[#F2EDE4] rounded-xl focus:ring-2 focus:ring-[#008751]/20 outline-none transition-all"
                placeholder="Ex: Ahouansou"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full mt-10 bg-[#008751] text-white font-bold py-4 rounded-xl hover:bg-[#006B3F] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
            {saving ? "SAUVEGARDE EN COURS..." : "SAUVEGARDER MON PROFIL"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}