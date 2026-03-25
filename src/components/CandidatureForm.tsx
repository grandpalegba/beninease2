"use client";

import { useState } from "react";
import { Video } from "lucide-react";

const categories = [
  "Tourisme & Découvertes",
  "Coutumes & Traditions",
  "Événementiel & Vie Nocturne",
  "Hébergement & Séjour",
  "Alimentation & Cuisine",
  "Bien-être & Fitness",
  "Mode & Beauté",
  "Marchés & Produits Locaux",
  "Transport & Mobilité",
  "Assistance & Travaux",
  "Santé & Médecine",
  "Service & Assistance",
  "Facilitateurs & Conciergerie",
  "Création & Médias",
  "Immobilier & Construction",
  "Business & Entreprises",
];

const videos = [
  "Personnalité / Présentation",
  "Votre histoire",
  "Votre service / offre",
  "Pourquoi vous",
];

const CandidatureForm = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    location: "",
    phone: "",
    socials: "",
  });
  const [acceptVideos, setAcceptVideos] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section id="postuler" className="py-24 md:py-32 bg-card">
      <div className="container px-4 max-w-xl">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-10 text-center text-balance" style={{ lineHeight: "1.15" }}>
          Devenez un Visage du Bénin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nom complet"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground font-body text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="" disabled>Catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <input
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            placeholder="Sous-catégorie"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Cotonou, Bénin"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Téléphone / WhatsApp"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            name="socials"
            value={form.socials}
            onChange={handleChange}
            placeholder="Mes réseaux sociaux"
            className="w-full px-5 py-4 rounded-xl bg-background border-0 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Video requirements */}
          <div className="rounded-xl bg-background p-5">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground text-sm font-body">4 vidéos requises</span>
            </div>
            <div className="space-y-3">
              {videos.map((v, i) => (
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
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold font-body text-base hover:bg-primary/90 transition-colors active:scale-[0.97]"
          >
            Envoyer ma candidature
          </button>
        </form>
      </div>
    </section>
  );
};

export default CandidatureForm;
