"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Camera, Save, ArrowLeft } from "lucide-react";
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
      const filePath = `avatars/${fileName}`;

      // Upload image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
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
        });

      if (error) {
        throw error;
      }

      // Update local state
      setProfile({
        id: user.id,
        prenom: prenom.trim() || null,
        nom: nom.trim() || null,
        avatar_url: avatarUrl,
      });

      alert("Profil mis à jour avec succès!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Erreur lors de la sauvegarde du profil");
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
      {/* Header */}
      <div className="bg-white border-b border-[#F2EDE4] pt-12 pb-8 px-6">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/dashboard/votant"
            className="inline-flex items-center gap-2 text-[#008751] font-medium text-sm mb-6 hover:text-[#006B3F] transition-colors"
          >
            <ArrowLeft size={16} />
            Retour au dashboard
          </Link>
          
          <h1 className="text-3xl font-display font-bold text-black mb-2">Paramètres du profil</h1>
          <p className="text-gray-600">Personnalisez vos informations pour votre parcours citoyen</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#F2EDE4] shadow-xl shadow-black/5"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                {avatarUrl ? (
                  <Image 
                    src={avatarUrl} 
                    alt="Avatar" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            
            <p className="text-sm text-gray-500 mt-3 text-center">
              Cliquez sur votre avatar pour changer l'image
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom"
                className="w-full px-4 py-3 border border-[#F2EDE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008751]/20 focus:border-[#008751] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-3 border border-[#F2EDE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008751]/20 focus:border-[#008751] transition-colors"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#008751] text-white font-medium py-3 px-6 rounded-xl hover:bg-[#006B3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Sauvegarder les modifications
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
