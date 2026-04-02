"use client";

import { useState } from "react";
import { Video, Loader2 } from "lucide-react";
import { supabase } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { universes } from "@/lib/data/universes";

const CandidatureForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    univers: "",
    categorie: "",
    location: "",
    whatsapp: "",
    date_naissance: "",
    socials: "",
  });
  const [videos, setVideos] = useState<string[]>([]);
  const [acceptVideos, setAcceptVideos] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptVideos) {
      setError("Veuillez accepter l'engagement relatif aux vidéos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a slug from prenom and nom
      const slug = `${form.prenom}-${form.nom}`.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const { error: submitError } = await supabase
        .from("talents")
        .insert([
          {
            prenom: form.prenom,
            nom: form.nom,
            univers: form.univers,
            categorie: form.categorie,
            whatsapp_number: form.whatsapp,
            date_naissance: form.date_naissance,
            city: form.location,
            slug: slug,
            votes: 0,
            role: 'candidat'
          }
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setForm({
        prenom: "",
        nom: "",
        categorie: "",  // Corrigé: category → categorie
        univers: "",     // Ajouté pour cohérence
        location: "",
        whatsapp: "",
        date_naissance: "",
        socials: "",
      });
      setAcceptVideos(false);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      setError("Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="postuler" className="py-24 md:py-32 bg-card">
        <div className="container px-4 max-w-xl text-center">
          <div className="bg-white p-10 rounded-[30px] shadow-sm border border-[#008751]/20">
            <h2 className="font-display text-3xl font-bold text-[#008751] mb-4">Candidature Envoyée !</h2>
            <p className="text-muted-foreground mb-8">
              Merci de votre intérêt. Votre profil est en cours d&apos;examen par notre équipe.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 rounded-full bg-[#008751] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#008751]/90 transition-all"
            >
              Retour au formulaire
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="postuler" className="py-24 md:py-32 bg-card">
      <div className="container px-4 max-w-xl">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-10 text-center text-balance" style={{ lineHeight: "1.15" }}>
          Devenez un Visage du Bénin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Prénom (ex: Koffi)"
              required
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Nom (ex: Adjakpa)"
              required
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="relative">
            <select
              name="univers"
              value={form.univers}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground font-body text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Choisir votre Univers</option>
              {universes.map((u) => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative">
            <select
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              required
              disabled={!form.univers}
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground font-body text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="" disabled>Choisir votre Catégorie</option>
              {form.univers && universes.find(u => u.name === form.univers)?.subs.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp (ex: +229 00000000)"
            required
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-2">Date de naissance</label>
            <input
              name="date_naissance"
              type="date"
              value={form.date_naissance}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ville (ex: Cotonou)"
            required
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            name="socials"
            value={form.socials}
            onChange={handleChange}
            placeholder="Réseaux sociaux (optionnel)"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Video requirements */}
          <div className="rounded-xl bg-background p-5">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground text-sm font-body">4 vidéos requises</span>
            </div>
            <div className="space-y-3">
              {videos.map((v: string, i: number) => (
                <div key={v} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-primary/15 text-primary text-xs font-bold flex items-center justify-center font-body">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground font-body">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkbox engagement */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptVideos}
              onChange={(e) => setAcceptVideos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
            />
            <span className="text-sm text-muted-foreground font-body leading-relaxed">
              Je confirme que si je suis retenu(e), je m&apos;engage à partager les 4 vidéos requises qui seront dévoilées sur le site du projet.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold font-body text-base hover:bg-primary/90 transition-colors active:scale-[0.97] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma candidature"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CandidatureForm;
