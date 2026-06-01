"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Code, Globe, Camera, Briefcase, Music2, PlayCircle } from "lucide-react";
import { getCountries } from "@/lib/countries";
import { toast } from "sonner";

const STATUSES = [
  { value: "yony-star", label: "Yony Star — Femme leader" },
  { value: "yony-light", label: "Yony Light — Combattant culturel" },
  { value: "yony-place", label: "Yony Place — Lieu / Ambassade" },
  { value: "yony-brand", label: "Yony Brand — Marque éthique" },
  { value: "yony-designer", label: "Yony Designer — Créateur / Artisan" },
  { value: "yony-guard", label: "Yony Guard — Arbitre des duels" },
] as const;

const SOCIALS = [
  { key: "instagram", label: "Instagram", placeholder: "@pseudo ou URL", icon: Camera },
  { key: "tiktok", label: "TikTok", placeholder: "@pseudo ou URL", icon: Music2 },
  { key: "youtube", label: "YouTube", placeholder: "Chaîne ou URL", icon: PlayCircle },
  { key: "linkedin", label: "LinkedIn", placeholder: "Profil ou URL", icon: Briefcase },
  { key: "x", label: "X (Twitter)", placeholder: "@pseudo ou URL", icon: Code },
  { key: "website", label: "Site web", placeholder: "https://…", icon: Globe },
] as const;

const schema = z.object({
  country: z.string().min(1, "Choisis un pays"),
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  status: z.string().min(1, "Choisis un statut"),
  bio: z.string().trim().min(20, "Au moins 20 caractères").max(280),
  languages: z.string().trim().min(2, "Indique au moins une langue").max(160),
});

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition";

const labelClass = "block text-sm font-semibold text-[color:var(--yony-deep)] mb-1.5";

export function JoinDelegationForm() {
  const countries = useMemo(() => getCountries("fr"), []);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    country: "",
    firstName: "",
    lastName: "",
    status: "",
    bio: "",
    languages: "",
  });
  const [socials, setSocials] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/delegation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, socials }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Une erreur est survenue");
        return;
      }

      const countryName = countries.find((c) => c.code === form.country)?.name ?? "";
      toast.success("Candidature envoyée !", {
        description: `Bienvenue dans la délégation ${countryName}. Nous reviendrons vers toi prochainement.`,
      });

      // Reset form
      setForm({ country: "", firstName: "", lastName: "", status: "", bio: "", languages: "" });
      setSocials({});
    } catch {
      toast.error("Erreur de connexion. Réessaie dans quelques instants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
      <div className="mb-8">
        <p className="text-[color:var(--yony-orange)] uppercase tracking-[0.25em] font-bold text-[0.78rem] mb-2">
          Rejoindre une délégation
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--yony-deep)]">
          Porte les couleurs de ta nation
        </h2>
        <p className="mt-3 text-gray-500">
          Renseigne ton profil pour rejoindre l'aventure des Jeux mondiaux des Traditions & Cultures.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Pays */}
        <div>
          <label htmlFor="country" className={labelClass}>Pays</label>
          <select
            id="country"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className={inputClass}
            disabled={loading}
          >
            <option value="">Choisis un pays…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Prénom / Nom */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className={labelClass}>Prénom</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              maxLength={80}
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Nom</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              maxLength={80}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className={labelClass}>Statut dans la délégation</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className={inputClass}
            disabled={loading}
          >
            <option value="">Choisis ton rôle…</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className={labelClass}>Bio courte</label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            maxLength={280}
            rows={4}
            placeholder="Qui es-tu, ce que tu portes pour ta nation…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/280</p>
        </div>

        {/* Langues */}
        <div>
          <label htmlFor="languages" className={labelClass}>Langues parlées</label>
          <input
            id="languages"
            type="text"
            value={form.languages}
            onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
            placeholder="Français, Anglais, Fon, Quechua…"
            maxLength={160}
            className={inputClass}
            disabled={loading}
          />
        </div>

        {/* Réseaux sociaux */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label className={labelClass + " mb-0"}>Réseaux sociaux</label>
            <span className="text-xs text-gray-400">Optionnels</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIALS.map(({ key, label, placeholder, icon: Icon }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  aria-label={label}
                  placeholder={`${label} — ${placeholder}`}
                  value={socials[key] ?? ""}
                  onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
                  maxLength={200}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition"
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-yony rounded-full h-14 px-10 text-lg font-bold text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi en cours…
              </>
            ) : (
              "Envoyer ma candidature"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
