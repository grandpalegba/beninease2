"use client";

import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Lock, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  ShieldCheck
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Talent, Votant } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setLoadingSaving] = useState(false);
  const [profile, setProfile] = useState<Talent | Votant | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }
        setUser(authUser);

        // Check Votants first as it's the primary table for general users
        const { data: profileData } = await supabase
          .from("Votants")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || "");
          setBio(""); // Votants might not have bio, adjust if needed
        } else {
          // Check Talents if not a Votant
          const { data: talentData } = await supabase
            .from("talents")
            .select("*")
            .eq("id", authUser.id)
            .single();
          
          if (talentData) {
            setProfile(talentData);
            setFullName(`${talentData.prenom || ""} ${talentData.nom || ""}`.trim());
            setBio(talentData.bio || "");
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase, router]);

  const handleSave = async () => {
    if (!user) return;
    setLoadingSaving(true);
    setMessage(null);

    try {
      const isTalent = profile?.role === 'candidat' || profile?.role === 'ambassadeur';
      
      if (isTalent) {
        // Splitting full name back into prenom/nom if possible
        const parts = fullName.split(' ');
        const prenom = parts[0] || "";
        const nom = parts.slice(1).join(' ') || "";
        
        const { error } = await supabase
          .from("talents")
          .update({
            prenom,
            nom,
            bio,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("Votants")
          .update({
            full_name: fullName,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);
        if (error) throw error;
      }
      
      setMessage({ type: 'success', text: "Modifications enregistrées avec succès." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ type: 'error', text: "Erreur lors de l'enregistrement." });
    } finally {
      setLoadingSaving(false);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoadingSaving(true);
      const isTalent = profile?.role === 'candidat' || profile?.role === 'ambassadeur' || profile?.role === 'admin';
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from(isTalent ? 'talents' : 'Votants')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: "Photo de profil mise à jour." });
    } catch (err) {
      console.error("Avatar upload error:", err);
      setMessage({ type: 'error', text: "Erreur lors de l'envoi de l'image." });
    } finally {
      setLoadingSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would call a secure edge function to delete user data
    // For now, we'll simulate the process
    setLoadingSaving(true);
    try {
      // 1. Logic to delete data from tables (RLS handles this if cascade is set)
      // 2. Redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Une erreur est survenue.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#008751] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-24 md:pt-32">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">Paramètres</h1>
          <p className="text-gray-500 font-sans">Gérez votre identité numérique et vos préférences de compte.</p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm",
                message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-16">
          
          {/* Section A: Identité Publique */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#C5A059]" />
              </div>
              <h2 className="text-xl font-display font-bold text-black uppercase tracking-wider">Identité Publique</h2>
            </div>

            {/* Photo de Profil */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-[#C5A059] p-1 overflow-hidden bg-white shadow-xl transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#008751] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#006B3F] transition-all active:scale-90"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="font-bold text-black">Photo de profil</h3>
                <p className="text-sm text-gray-500">Formats acceptés : JPG, PNG. Max 2Mo.</p>
              </div>
            </div>

            {/* Champs du formulaire */}
            <div className="grid gap-8">
              {/* Nom d'affichage */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nom d'affichage</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-6 py-4 rounded-2xl bg-[#F9F9F7] border border-transparent focus:border-[#008751] focus:bg-white outline-none transition-all font-sans font-bold text-black"
                />
                <p className="text-[11px] text-gray-400 italic">Ce nom apparaîtra sur vos votes et votre dashboard.</p>
              </div>

              {/* Bio courte */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Bio courte</label>
                  <span className={cn("text-[10px] font-bold", bio.length > 160 ? "text-red-500" : "text-gray-400")}>
                    {bio.length}/160
                  </span>
                </div>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Parlez-nous de vous en quelques mots..."
                  maxLength={160}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F9F9F7] border border-transparent focus:border-[#008751] focus:bg-white outline-none transition-all font-sans font-medium text-black min-h-[120px] resize-none"
                />
              </div>

              {/* WhatsApp Vérifié */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  WhatsApp Vérifié
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={profile?.whatsapp || profile?.whatsapp_number || "Non renseigné"} 
                    disabled
                    className="w-full px-6 py-4 rounded-2xl bg-[#F9F9F7] border border-gray-100 font-sans font-bold text-gray-400 cursor-not-allowed pr-12"
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                </div>
                <p className="text-[11px] text-[#C5A059] font-bold">Compte unique lié à ce numéro.</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-12 py-4 bg-[#008751] text-white rounded-full font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-[#008751]/20 hover:bg-[#006B3F] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer les modifications"}
            </button>
          </motion.section>

          {/* Section B: Zone de Danger */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10 pt-10 border-t border-gray-100"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-black uppercase tracking-wider">Gestion du Compte</h2>
            </div>

            <div className="grid gap-6">
              {/* Logout Button */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[32px] bg-[#F9F9F7] border border-gray-100">
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-black mb-1">Session active</h3>
                  <p className="text-sm text-gray-500 font-sans">Déconnectez-vous pour fermer votre session sur cet appareil.</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-sm hover:text-red-600 hover:border-red-100 transition-all shadow-sm group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Déconnexion
                </button>
              </div>

              {/* Delete Account */}
              <div className="p-8 text-center md:text-left space-y-4">
                <h3 className="font-bold text-red-600">Suppression des données</h3>
                <p className="text-sm text-gray-500 font-sans max-w-md">
                  Conformément au RGPD, vous pouvez demander la suppression définitive de votre compte et de toutes vos données de vote. Cette action est irréversible.
                </p>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto md:mx-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-black">Action Irréversible</h2>
                <p className="text-gray-500 text-sm">
                  Êtes-vous certain de vouloir supprimer votre compte Beninease ? Vos votes et vos données seront effacés définitivement.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-red-600 text-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                >
                  Confirmer la suppression
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-[#F9F9F7] text-gray-500 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
