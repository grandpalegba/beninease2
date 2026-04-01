"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Camera, ArrowLeft, Loader2, Save, Key, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

type Profile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  email: string | null;
};

const ParametresPage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    whatsapp: "",
  });

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const getUserAndProfile = useCallback(async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          router.push("/login");
          return;
        }

        setUser(authUser);

        // Récupérer le profil depuis la table profiles avec maybeSingle() pour éviter les blocages
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        // Pas de blocage si le profil n'existe pas
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erreur profil:", profileError);
        }

        if (profileData) {
          setProfile(profileData);
          setFormData({
            prenom: profileData.prenom || "",
            nom: profileData.nom || "",
            whatsapp: profileData.whatsapp || "",
          });
        }
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    }, [supabase, router]);

  useEffect(() => {
    getUserAndProfile();
  }, [getUserAndProfile]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const updateData = {
        prenom: formData.prenom || null,
        nom: formData.nom || null,
        whatsapp: formData.whatsapp || null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        console.error("Erreur mise à jour:", error);
        toast.error("Erreur lors de la sauvegarde");
        return;
      }

      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      toast.success("✅ Profil mis à jour avec succès !");
      
      // Solution Next.js standard : purger le cache et rediriger
      router.refresh();
      router.push('/dashboard/votant');
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast.error("Email non disponible");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) {
        console.error("Erreur reset:", error);
        toast.error("Erreur lors de l'envoi de l'email");
        return;
      }

      toast.success("Email de réinitialisation envoyé!");
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Une erreur est survenue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008751]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-black">Paramètres</h1>
          <button
            onClick={() => router.push("/dashboard/votant")}
            className="flex items-center gap-2 text-[#008751] hover:text-[#006B3F] transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
        </div>

        {/* Photo Section */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#008751]/20 mb-4">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#008751]/10">
                  <User size={48} className="text-[#008751]" />
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#008751] text-white rounded-full font-medium hover:bg-[#006B3F] transition-colors">
              <Camera size={18} />
              Changer la photo
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
                placeholder="Votre prénom"
              />
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
                placeholder="Votre nom"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-green-500" />
                  WhatsApp
                </div>
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent"
                placeholder="+229 XX XX XX XX"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-[#008751] text-white rounded-full font-bold hover:bg-[#006B3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Sauvegarder
                </>
              )}
            </button>

            <button
              onClick={handlePasswordReset}
              className="w-full py-3 text-gray-500 hover:text-[#008751] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Key size={16} />
              Réinitialiser mon mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;
