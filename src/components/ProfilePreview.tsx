"use client";

import { Play, MapPin, Globe, Clock, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import profileImg from "@/assets/profile-aicha.jpg";
import thumbPersonality from "@/assets/video-thumb-personality.jpg";
import thumbHistory from "@/assets/video-thumb-history.jpg";
import thumbCuisine from "@/assets/video-thumb-cuisine.jpg";
import thumbTourism from "@/assets/video-thumb-tourism.jpg";
import { cn } from "@/lib/utils";

type TabItem = {
  label: string;
  thumb: StaticImageData;
  desc: string;
  /** Texte alternatif descriptif pour l’accessibilité */
  alt: string;
  /** Ajuste le cadrage selon le sujet (portrait, plat, paysage…) */
  objectClass: string;
};

const tabs: TabItem[] = [
  {
    label: "Qui je suis",
    thumb: thumbPersonality,
    alt: "Aïcha en cuisine, cheffe à domicile à Cotonou, ambiance chaleureuse",
    objectClass: "object-cover object-[center_35%]",
    desc: "Je m'appelle Aïcha, j'ai 28 ans et je suis passionnée par la cuisine béninoise. Chaque plat que je prépare raconte une histoire — celle de ma grand-mère, de mon quartier, de mon pays.",
  },
  {
    label: "Mon histoire",
    thumb: thumbHistory,
    alt: "Moments de transmission culinaire et souvenirs d’enfance à Abomey",
    objectClass: "object-cover object-center",
    desc: "J'ai appris à cuisiner dès l'âge de 10 ans aux côtés de ma grand-mère à Abomey. Après des années à perfectionner mes recettes, j'ai décidé de partager cette richesse culinaire avec le monde.",
  },
  {
    label: "Mon service",
    thumb: thumbCuisine,
    alt: "Plats traditionnels béninois préparés avec soin",
    objectClass: "object-cover object-[center_65%]",
    desc: "Je propose des repas traditionnels béninois préparés à domicile : amiwo, sauce d'arachide, pâte avec gboman… Des menus personnalisés pour familles, touristes et événements.",
  },
  {
    label: "Pourquoi moi",
    thumb: thumbTourism,
    alt: "Ambiance et partage autour de la cuisine béninoise",
    objectClass: "object-cover object-[center_40%]",
    desc: "Parce que je cuisine avec le cœur. Mes clients reviennent toujours. Je veux représenter la cuisine béninoise et montrer qu'elle est parmi les meilleures d'Afrique.",
  },
];

const ProfilePreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <section id="profil" className="py-24 md:py-32">
      <div className="container px-4 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 font-body">
            L&apos;expérience future
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance" style={{ lineHeight: "1.15" }}>
            Profil candidat
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Chaque candidat dispose d&apos;un espace de visibilité pendant la compétition.
          </p>
        </div>

        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Profile header */}
          <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden ring-2 ring-primary/15 shadow-lg ring-offset-2 ring-offset-background">
                <Image
                  src={profileImg}
                  alt="Aïcha Hounkpatin"
                  className="h-full w-full object-cover object-[center_15%]"
                  priority
                />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="font-display text-2xl font-bold text-foreground">
                Aïcha Hounkpatin
              </h3>
              <p className="text-primary font-semibold text-sm font-body mb-1">
                Cuisine traditionnelle à domicile à Cotonou
              </p>
              <p className="text-muted-foreground text-sm font-body mb-3">
                Alimentation & Cuisine
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-muted-foreground font-body">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> Cotonou, Bénin
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 shrink-0" /> Français, Fon, Anglais
                </span>
              </div>
            </div>
          </div>

          {/* Tabs + vignettes */}
          <div className="border-t border-border bg-muted/20">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "flex-1 min-w-[7.5rem] py-3.5 px-2 text-sm font-medium font-body transition-colors border-b-2 whitespace-nowrap",
                    activeTab === i
                      ? "border-primary text-primary bg-background/80"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="px-3 sm:px-4 py-3 border-b border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body mb-2 px-1 hidden sm:block">
                Aperçu des vidéos
              </p>
              <div className="flex gap-2 sm:gap-3">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "group relative flex-1 min-w-0 aspect-video rounded-lg overflow-hidden transition-all duration-300",
                      "ring-2 ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-primary",
                      activeTab === i
                        ? "ring-primary shadow-md scale-[1.02] z-[1]"
                        : "ring-transparent opacity-80 hover:opacity-100 hover:ring-border",
                    )}
                    aria-label={`Voir la vidéo : ${tab.label}`}
                    aria-current={activeTab === i ? "true" : undefined}
                  >
                    <Image
                      src={tab.thumb}
                      alt=""
                      className={cn("h-full w-full transition-transform duration-500 group-hover:scale-105", tab.objectClass)}
                      priority={i === 0}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-1.5 px-1.5">
                      <span className="block truncate text-center text-[10px] sm:text-xs font-medium text-white font-body">
                        {tab.label}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Zone vidéo principale */}
          <div className="p-6 md:p-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-2xl ring-1 ring-black/[0.06]">
              <Image
                src={current.thumb}
                alt={current.alt}
                className={cn(
                  "h-full w-full transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.035]",
                  current.objectClass,
                )}
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 transition-colors group-hover:from-black/25">
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-white/25 transition-all duration-300 mb-3 shadow-lg ring-1 ring-white/30">
                  <Play className="w-7 h-7 text-white ml-1 drop-shadow-md" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-semibold text-white font-body drop-shadow-md text-center">{current.label}</p>
                <p className="text-xs text-white/90 font-body mt-1.5 inline-flex items-center gap-1.5 drop-shadow">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> Durée max : 2 minutes
                </p>
              </div>
            </div>

            <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed md:text-base md:leading-relaxed">
              {current.desc}
            </p>
          </div>

          {/* Action buttons */}
          <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold font-body text-sm hover:bg-primary/90 transition-colors active:scale-[0.97]"
            >
              <Heart className="w-4 h-4" /> Voter pour moi
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-border text-foreground font-semibold font-body text-sm hover:bg-secondary transition-colors active:scale-[0.97]"
            >
              <Share2 className="w-4 h-4" /> Partager sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePreview;
