"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Video, Mail, Lock, User, Phone, MapPin, Share2, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { universes } from "@/lib/data/universes";

const videoRequirements = [
  "Personnalité / Présentation",
  "Votre histoire",
  "Votre service / offre",
  "Pourquoi vous",
];

export default function PostulerPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [socials, setSocials] = useState("");
  const [acceptVideos, setAcceptVideos] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Derived states
  const selectedUniverse = universes.find(u => u.name === category);
  const availableSubCategories = selectedUniverse ? selectedUniverse.subs : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptVideos) {
      setError("Veuillez accepter l'engagement sur les vidéos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("Cet email est déjà utilisé.");
        }
        if (authError.message.includes("Password should be")) {
          throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
        }
        throw authError;
      }

      if (authData.user) {
        // 2. Insert into applications table
        const { error: appError } = await supabase
          .from("applications")
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            category,
            sub_category: subCategory,
            city,
            phone,
            socials,
            accept_videos: acceptVideos,
          });

        if (appError) throw appError;

        // 3. Success state
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const inputBg = "bg-[#F5F5F5]"; // Light gray/beige as requested
  const inputClasses = `w-full px-5 py-4 rounded-xl ${inputBg} border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A267]/30 transition-all`;

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center animate-fade-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Bienvenue parmi les Visages du Bénin ! 🎉
          </h2>
          <p className="text-muted-foreground font-body leading-relaxed mb-8">
            Votre compte est créé et votre candidature est en cours d&apos;examen. 
            Vous recevrez un email très prochainement pour la suite de l&apos;aventure.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-xl bg-[#C5A267] text-white font-bold hover:bg-[#B38E55] transition-all shadow-lg"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-4 flex flex-col items-center">
      {/* Header Info */}
      <div className="max-w-2xl w-full text-center mb-12 animate-fade-in">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Devenez un Visage du Bénin
        </h1>
        <p className="text-muted-foreground font-body text-lg">
          Rejoignez la vitrine de l&apos;excellence béninoise et faites rayonner votre talent.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-6 md:p-10 animate-fade-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email & Password */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className={`${inputClasses} pl-12`}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (min. 6 caractères)"
                required
                className={`${inputClasses} pl-12`}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2" />

          {/* Personal Info */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                required
                className={`${inputClasses} pl-12`}
              />
            </div>

            {/* Category Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory("");
                  }}
                  required
                  className={`${inputClasses} appearance-none`}
                >
                  <option value="" disabled>Univers</option>
                  {universes.map((u) => (
                    <option key={u.name} value={u.name}>{u.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Sub-category Select */}
              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                  disabled={!category}
                  className={`${inputClasses} appearance-none disabled:opacity-50`}
                >
                  <option value="" disabled>Catégorie</option>
                  {availableSubCategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cotonou, Bénin"
                required
                className={`${inputClasses} pl-12`}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Téléphone / WhatsApp"
                required
                className={`${inputClasses} pl-12`}
              />
            </div>

            <div className="relative">
              <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={socials}
                onChange={(e) => setSocials(e.target.value)}
                placeholder="Réseaux sociaux (Instagram, Facebook...)"
                className={`${inputClasses} pl-12`}
              />
            </div>
          </div>

          {/* Video Block */}
          <div className="rounded-2xl border-2 border-dashed border-[#E9E2D6] bg-[#FDFBF7] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A267]/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-[#C5A267]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">4 vidéos requises</h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Engagement obligatoire</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoRequirements.map((v, i) => (
                <div key={v} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E9E2D6]/50 shadow-sm">
                  <span className="text-[10px] font-bold text-[#C5A267] bg-[#C5A267]/10 w-5 h-5 rounded flex items-center justify-center shrink-0">
                    0{i + 1}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground leading-none">{v}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2 group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={acceptVideos}
                  onChange={(e) => setAcceptVideos(e.target.checked)}
                  className="w-5 h-5 rounded-md border-[#E9E2D6] text-[#C5A267] focus:ring-[#C5A267]/30 accent-[#C5A267] cursor-pointer"
                />
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                Je confirme que si je suis retenu(e), je m&apos;engage à partager les 4 vidéos requises qui seront dévoilées sur le site.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#C5A267] text-white font-bold text-base hover:bg-[#B38E55] transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement...
              </>
            ) : (
              "Créer mon compte et postuler"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
