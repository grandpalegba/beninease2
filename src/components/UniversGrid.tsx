"use client";

import { useState } from "react";
import { MapPin, Music, PartyPopper, Home, UtensilsCrossed, Heart, Scissors, ShoppingBag, Car, Wrench, Stethoscope, Package, Handshake, Camera, Building2, Briefcase } from "lucide-react";

const universes = [
  { icon: MapPin, name: "Tourisme & Découvertes", subs: ["Guides touristiques", "Historiens & transmetteurs", "Créateurs d’expériences", "Ambassadeurs territoriaux"] },
  { icon: Music, name: "Coutumes & Traditions", subs: ["Enseignants du Fa", "Tradipraticiens", "Musiciens traditionnels", "Danseurs"] },
  { icon: PartyPopper, name: "Événementiel & Vie Nocturne", subs: ["Espaces événementiels", "Organisateurs d’événements", "DJ & performeurs", "Bars & clubs"] },
  { icon: Home, name: "Hébergement & Séjour", subs: ["Hôtes d’exception", "Ecolodges", "Appartements", "Gestionnaires de séjour"] },
  { icon: UtensilsCrossed, name: "Gastronomie", subs: ["Restaurants", "Maquis", "Chefs à domicile", "Mixologues & barmen"] },
  { icon: Heart, name: "Bien-être & Fitness", subs: ["Coachs sportifs", "Santé mentale", "Massages & soins", "Nutrition"] },
  { icon: Scissors, name: "Mode & Beauté", subs: ["Beauté féminine", "Stylistes & tailleurs", "Beauté masculine", "Marques émergentes"] },
  { icon: ShoppingBag, name: "Marchés & Produits Locaux", subs: ["Producteurs locaux", "Artisans", "Créateurs de produits", "Marques locales"] },
  { icon: Car, name: "Transport & Mobilité", subs: ["Chauffeurs privés", "Moto Taxi Premium", "Agences de location", "Navettes & transferts"] },
  { icon: Wrench, name: "Experts Métier", subs: ["Plombiers", "Électriciens", "Garagistes", "Techniciens polyvalents"] },
  { icon: Stethoscope, name: "Santé & Médecine", subs: ["Médecins généralistes", "Médecins spécialistes", "Praticiens traditionnels", "Accompagnants bien-être"] },
  { icon: Package, name: "Médias & Digital", subs: ["Photographes", "Vidéastes", "Storytellers", "Créateurs de contenu"] },
  { icon: Handshake, name: "Facilitateurs & Conciergerie", subs: ["Accueil diaspora", "Conciergerie privée", "Recherche de partenaires", "Assistance administrative"] },
  { icon: Camera, name: "Création & Culture", subs: ["Artistes visuels", "Performeurs", "Designers", "Créateurs culturels"] },
  { icon: Building2, name: "Immobilier & Construction", subs: ["Architecture", "Suivi chantier", "Gestion locative", "Vente/Achat"] },
  { icon: Briefcase, name: "Business & Entreprises", subs: ["Entrepreneurs", "Innovateurs", "Experts juridiques", "Dirigeants"] },
];

type UniversGridProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const UniversGrid = ({ ctaHref = "/login?signup=true", ctaLabel = "S'inscrire maintenant" }: UniversGridProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <section id="univers" className="py-24 md:py-32" style={{ backgroundColor: "#452a1f" }}>
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Les 16 Univers
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto font-body">
            Chaque univers regroupe les talents dans 4 catégories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
          {universes.map((u, i) => {
            const Icon = u.icon;
            const isActive = activeIdx === i;
            return (
              <button
                key={u.name}
                onClick={() => setActiveIdx(isActive ? null : i)}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`relative group rounded-xl p-5 md:p-6 text-left transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "shadow-xl scale-[1.03] border-transparent text-white"
                    : "bg-background border-border hover:shadow-md hover:border-primary/20"
                }`}
                style={isActive ? { backgroundColor: "#b25c39" } : undefined}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                  isActive ? "bg-white/20" : "bg-primary/10 text-primary"
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                </div>
                <h3 className={`font-display text-sm md:text-base font-semibold leading-tight mb-1 ${
                  isActive ? "text-white" : "text-foreground"
                }`}>
                  {u.name}
                </h3>

                {isActive && (
                  <div className="mt-3 flex flex-wrap gap-1.5 animate-fade-in">
                    {u.subs.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/90 font-body"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] h-11 px-8 text-sm font-medium ring-offset-background transition-colors"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
};

export default UniversGrid;
