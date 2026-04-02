"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";
import { User, Camera, ArrowLeft, Loader2, Save, Key, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const ParametresPage = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ prenom: "", nom: "", whatsapp: "" });

  const router = useRouter();

  const getUserAndProfile = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      setUser(authUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setFormData({
          prenom: profileData.prenom || "",
          nom: profileData.nom || "",
          whatsapp: profileData.whatsapp || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    getUserAndProfile();
  }, [getUserAndProfile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        prenom: formData.prenom,
        nom: formData.nom,
        whatsapp: formData.whatsapp,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Profil mis à jour !");
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F9F9F7] py-8 px-4 text-black">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded-xl"
            placeholder="Prénom" 
            value={formData.prenom} 
            onChange={e => setFormData({...formData, prenom: e.target.value})} 
          />
          <input 
            className="w-full p-3 border rounded-xl"
            placeholder="Nom" 
            value={formData.nom} 
            onChange={e => setFormData({...formData, nom: e.target.value})} 
          />
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#008751] text-white p-4 rounded-full font-bold flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;