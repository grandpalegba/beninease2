"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { JoinDelegationForm } from "@/components/JoinDelegationForm";
import "./yony-games.css";

const STATS = [
  { value: "256", label: "Jours de jeux" },
  { value: "16", label: "Nations hôtes" },
  { value: "512", label: "Trésors Sacrés" },
];

const STEPS = [
  {
    n: "01",
    title: "Choisis ta nation",
    text: "Toutes les nations du monde participent. 16 d'entre elles deviennent hôtes et inspirent les défis.",
  },
  {
    n: "02",
    title: "Prends un statut",
    text: "Star, Light, Place, Brand, Designer ou Guard. Chaque rôle a sa mission.",
  },
  {
    n: "03",
    title: "Gagne des jetons",
    text: "Duels, explorations et soutiens font avancer la jauge de ta nation.",
  },
  {
    n: "04",
    title: "Libère les Trésors",
    text: "256 Trésors du Bénin et 256 Wakas du Pérou à réactiver ensemble.",
  },
];

const CYCLES = [
  ["01", "🇧🇯", "Bénin", "10 jan"],
  ["02", "🇸🇹", "Sao Tomé & Pr.", "26 jan"],
  ["03", "🇿🇦", "Afr. du Sud", "11 fév"],
  ["04", "🇪🇬", "Égypte", "27 fév"],
  ["05", "🇹🇷", "Turquie", "15 mar"],
  ["06", "🇸🇪", "Suède", "31 mar"],
  ["07", "🇮🇳", "Inde", "16 avr"],
  ["08", "🇮🇩", "Indonésie", "02 mai"],
  ["09", "🇯🇵", "Japon", "18 mai"],
  ["10", "🇵🇬", "Papouasie N.G.", "03 juin"],
  ["11", "🇨🇱", "Île de Pâques", "19 juin"],
  ["12", "🇲🇽", "Mexique", "05 juil"],
  ["13", "🇨🇺", "Cuba", "21 juil"],
  ["14", "🇨🇴", "Colombie", "06 août"],
  ["15", "🇧🇷", "Brésil", "22 août"],
  ["16", "🇵🇪", "Pérou", "07 sept"],
];

const ARENAS = [
  { eyebrow: "Sagesses", title: "Jeton Conscience", text: "Résoudre un cas de vie complexe." },
  { eyebrow: "Savoirs", title: "Jeton Connaissance", text: "Enseigner une méthode ancestrale." },
  { eyebrow: "Créations", title: "Jeton Compétence", text: "Proposer une œuvre d'art." },
  { eyebrow: "Légendes", title: "Jeton Confidence", text: "Raconter une histoire impactante." },
];

const SPACES = [
  { eyebrow: "Publicités", title: "Jeton Concordance", text: "Regarder, voter, soutenir une marque." },
  { eyebrow: "Ambassades", title: "Jeton Convergence", text: "Scanner, découvrir, témoigner d'un lieu." },
  { eyebrow: "Boutiques", title: "Jeton Convenance", text: "Explorer, acheter, collectionner." },
  { eyebrow: "Évènements", title: "Jeton Confiance", text: "Participer aux cérémonies et défis collectifs dans chaque pays." },
];

const DELEGATIONS = [
  {
    eyebrow: "Femmes leaders",
    title: "Yony Stars",
    per: "16 par nation",
    text: "Porter un projet à fort impact social, culturel ou environnemental pour valoriser leur pays.",
  },
  {
    eyebrow: "Combattants culturels",
    title: "Yony Lights",
    per: "240 par nation",
    text: "60 combattantes et combattants par arène : Sagesses, Savoirs, Créations, Légendes. Excellence et engagement au service de leur nation.",
  },
  {
    eyebrow: "Lieux & Ambassades",
    title: "Yony Places",
    per: "50 par nation",
    text: "Devenir une ambassade physique de la culture nationale et partager son patrimoine vivant.",
  },
  {
    eyebrow: "Marques éthiques",
    title: "Yony Brands",
    per: "22 par nation",
    text: "Valoriser un savoir-faire national à l'international avec exigence et responsabilité.",
  },
  {
    eyebrow: "Créateurs & Artisans",
    title: "Yony Designers",
    per: "32 par nation",
    text: "Diffuser graphisme, artisanat et design national portés par le talent et la créativité du pays.",
  },
  {
    eyebrow: "Arbitres des duels",
    title: "Yony Guards",
    per: "240 par nation",
    text: "Arbitrer les duels de chaque nation avec rigueur, équité et engagement collectif.",
  },
];

export default function YonyGamesPage() {
  return (
    <div className="yony-games min-h-screen bg-background">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <nav className="flex items-center justify-between rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
            <a href="#top" className="flex items-center gap-3 pl-2">
              <img src="/yony-games-logo.png" alt="Yony Games Logo" className="h-8 w-auto object-contain" />
              <span className="font-extrabold tracking-widest text-[#043a82] text-xl uppercase mt-1">YONY GAMES</span>
            </a>
            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#043a82]/80">
              <a href="#deesse" className="hover:text-[#043a82] transition-colors">La Déesse</a>
              <a href="#parcours" className="hover:text-[#043a82] transition-colors">Parcours</a>
              <a href="#jetons" className="hover:text-[#043a82] transition-colors">Jetons</a>
              <a href="#delegations" className="hover:text-[#043a82] transition-colors">Délégations</a>
            </div>
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-10 px-5 text-sm font-semibold text-white">
                Rejoindre une délégation
              </Button>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative isolate overflow-hidden bg-yony-night text-white">
        <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-32 text-center">
          <p className="text-eyebrow">10 jan au 22 sept 2027</p>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-[1.05]">
            Les premiers Jeux mondiaux
            <br />
            des{" "}
            <span className="text-[color:var(--yony-orange)]">Traditions & Cultures</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Une aventure mondiale pour restaurer l'Harmonie sur Terre.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-14 px-8 text-base font-semibold text-white">
                Rejoindre une délégation
              </Button>
            </a>
            <a href="#comment">
              <Button className="btn-ghost-night rounded-full h-14 px-8 text-base font-semibold">
                Comment ça marche
              </Button>
            </a>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="card-glow rounded-2xl p-7 text-left">
                <div className="text-5xl font-extrabold text-[color:var(--yony-orange)]">{s.value}</div>
                <div className="mt-3 text-xs tracking-[0.3em] uppercase text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEESSE */}
      <section id="deesse" className="py-28 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/yony-desse.png"
              alt="Yony, Déesse de l'Harmonie — mascotte des Yony Games"
              className="w-full max-w-sm mx-auto drop-shadow-[0_30px_60px_rgba(4,58,130,0.20)]"
            />
          </div>
          <div>
            <p className="text-eyebrow">La Déesse</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              Yony<br />
              <span className="text-3xl md:text-4xl text-[color:var(--yony-blue)] font-bold">Déesse de l'Harmonie</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              L'Œuf de Yony est le symbole de l'équilibre du monde. Il se recharge à partir de deux centres : le Bénin et le Pérou, racines matérielles et spirituelles de sagesses primordiales.
            </p>
            <div className="mt-8 rounded-2xl bg-[color:var(--yony-deep)] p-6 shadow-xl shadow-[color:var(--yony-deep)]/20">
              <p className="text-[color:var(--yony-orange)] uppercase tracking-[0.3em] font-bold text-[0.78rem]">Mission des jeux</p>
              <p className="mt-2 text-lg font-medium text-white leading-relaxed">
                Libérer les 256 Trésors Mémoriels du Bénin et les 256 Lieux Sacrés du Pérou.
              </p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="card-light rounded-2xl p-5">
                <p className="text-eyebrow">Pillage</p>
                <h3 className="mt-2 text-xl text-[color:var(--yony-deep)]">256 Trésors du Bénin</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Symboles royaux dispersés à travers le monde. Chaque trésor libéré recompose un fragment de la sagesse universelle.
                </p>
              </div>
              <div className="card-light rounded-2xl p-5">
                <p className="text-eyebrow">Rupture</p>
                <h3 className="mt-2 text-xl text-[color:var(--yony-deep)]">256 Wakas du Pérou</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Lieux sacrés andins endormis. Chaque Waka réactivée ravive la mémoire collective et l'équilibre du monde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="py-20 bg-[oklch(0.985_0.01_260)]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-eyebrow">Sources & Inspirations</p>
          <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
            Le Bénin rencontre le Pérou
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
            <div className="card-light rounded-2xl p-7">
              <h3 className="text-xl text-[color:var(--yony-deep)]">Le Fâ</h3>
              <p className="mt-3 text-muted-foreground">
                Tradition majeure du Bénin. Sa matrice composée de 256 signes constitue l'esprit des Jeux, inspirant les défis qui permettent aux nations de révéler leurs richesses culturelles.
              </p>
            </div>
            <div className="card-light rounded-2xl p-7">
              <h3 className="text-xl text-[color:var(--yony-deep)]">Le Yanantin</h3>
              <p className="mt-3 text-muted-foreground">
                Principe ancestral des Andes du Pérou fondé sur la complémentarité entre les contraires. Il constitue l'âme des Jeux, fondée sur l'enrichissement par la différence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT */}
      <section id="comment" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-eyebrow">Comment ça marche</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              Participer en 4 étapes
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="card-light rounded-2xl p-7">
                <div className="text-4xl font-extrabold text-[color:var(--yony-orange)]">{s.n}</div>
                <h3 className="mt-6 text-lg text-[color:var(--yony-deep)]">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARCOURS */}
      <section id="parcours" className="relative overflow-hidden bg-yony-night text-white py-28">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-eyebrow">10 jan au 22 sept 2027</p>
            <h2 className="mt-3 text-4xl md:text-5xl">16 cycles, 16 nations hôtes</h2>
            <p className="mt-5 text-white/70 max-w-2xl mx-auto">
              Chaque cycle de 16 jours est porté par une nation hôte qui inspire les défis, les récits et les expériences culturelles partagés mondialement.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CYCLES.map(([n, flag, name, date]) => (
              <div key={n} className="card-glow rounded-2xl p-4 text-center">
                <p className="text-[10px] tracking-[0.3em] text-[color:var(--yony-orange)] font-semibold">
                  CYCLE {n}
                </p>
                <div className="text-4xl my-3">{flag}</div>
                <p className="text-sm font-semibold uppercase tracking-wider">{name}</p>
                <p className="text-xs text-white/60 mt-1">{date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JETONS */}
      <section id="jetons" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-eyebrow">Les 8 jetons</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              Comment gagner des jetons
            </h2>
            <p className="mt-5 text-muted-foreground">
              Chaque nation doit en réunir 8 types pour libérer des <strong className="text-[color:var(--yony-deep)]">Trésors</strong> et réactiver des <strong className="text-[color:var(--yony-deep)]">Wakas</strong>.<br />
              Les jetons se gagnent dans les arènes de duels et les espaces de découvertes.
            </p>
          </div>

          <div className="mt-16">
            <div className="mb-6">
              <h3 className="text-xl text-[color:var(--yony-deep)]">4 Arènes de duels</h3>
              <p className="mt-1 text-sm text-muted-foreground">Duels vidéo nation contre nation</p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ARENAS.map((a) => (
                <div key={a.title} className="card-light rounded-2xl p-6">
                  <p className="text-eyebrow">{a.eyebrow}</p>
                  <h4 className="mt-4 text-lg text-[color:var(--yony-deep)]">{a.title}</h4>
                  <p className="mt-3 text-sm text-muted-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="mb-6">
              <h3 className="text-xl text-[color:var(--yony-deep)]">4 Yony Spaces</h3>
              <p className="mt-1 text-sm text-muted-foreground">Espaces de découvertes</p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SPACES.map((a) => (
                <div key={a.title} className="card-light rounded-2xl p-6">
                  <p className="text-eyebrow">{a.eyebrow}</p>
                  <h4 className="mt-4 text-lg text-[color:var(--yony-deep)]">{a.title}</h4>
                  <p className="mt-3 text-sm text-muted-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DELEGATIONS */}
      <section id="delegations" className="relative overflow-hidden bg-yony-night text-white py-28">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-eyebrow">Les délégations</p>
            <h2 className="mt-3 text-4xl md:text-5xl">
              600 membres par nation
            </h2>
            <p className="mt-5 text-white/70">
              Chaque délégation rassemble 600 ambassadrices et ambassadeurs répartis en 6 statuts.<br />
              Ensemble, ils partagent ce que leur nation a de plus précieux.
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DELEGATIONS.map((d) => (
              <div key={d.title} className="card-glow rounded-2xl p-7">
                <p className="text-eyebrow">{d.eyebrow}</p>
                <h3 className="mt-4 text-2xl text-white">{d.title}</h3>
                <p className="text-eyebrow mt-1">{d.per}</p>
                <div className="my-5 h-px bg-white/10" />
                <p className="text-sm text-white/70 leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-14 px-8 text-base font-semibold text-white">
                Rejoindre une délégation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* INSCRIPTION */}
      <section id="inscription" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <JoinDelegationForm />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-yony-night text-white py-28">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-eyebrow">10 jan au 22 sept 2027</p>
          <h2 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
            Rejoins l'aventure de
            <br />
            l'<span className="text-[color:var(--yony-orange)]">Harmonie</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-14 px-8 text-base font-semibold text-white">
                Rejoindre une délégation
              </Button>
            </a>
            <a href="#parcours">
              <Button className="btn-ghost-night rounded-full h-14 px-8 text-base font-semibold">
                Découvrir le parcours
              </Button>
            </a>
          </div>
          <p className="mt-16 text-sm text-white/50">
            © 2027 Yony Games · Une aventure mondiale pour restaurer l'Harmonie du monde
          </p>
        </div>
      </section>
    </div>
  );
}
