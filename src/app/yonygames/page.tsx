"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinDelegationForm } from "@/components/JoinDelegationForm";
import "./yony-games.css";
import { translations, Language } from "@/lib/data/yonygames-translations";



export default function YonyGamesPage() {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [lang, setLang] = useState<Language>("Français");
  const LANGUAGES: Language[] = ["Français", "English", "Español", "Português"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLangDropdown && !(event.target as Element).closest('.lang-menu-container')) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangDropdown]);

  const t = translations[lang];

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
              <a href="#deesse" className="hover:text-[#043a82] transition-colors">{t.nav.deesse}</a>
              <a href="#parcours" className="hover:text-[#043a82] transition-colors">{t.nav.parcours}</a>
              <a href="#jetons" className="hover:text-[#043a82] transition-colors">{t.nav.jetons}</a>
              <a href="#delegations" className="hover:text-[#043a82] transition-colors">{t.nav.delegations}</a>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative lang-menu-container">
                <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="flex items-center gap-1.5 text-[#043a82] hover:text-[color:var(--yony-orange)] transition-colors cursor-pointer">
                  <Globe size={20} />
                  <span className="text-xs font-bold uppercase hidden md:inline-block tracking-widest">{lang.slice(0,2)}</span>
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-2xl rounded-2xl p-2 border border-gray-100 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setShowLangDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${lang === l ? "bg-[#043a82] text-white" : "text-[#043a82] hover:bg-gray-50"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href="#inscription">
                <Button className="btn-yony rounded-full h-10 px-5 text-sm font-semibold text-white">
                  {t.nav.join}
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative isolate overflow-hidden bg-yony-night text-white">
        <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-32 text-center">
          <p className="text-eyebrow">{t.hero.date}</p>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-[1.05]">
            {t.hero.title1}
            <br />
            {t.hero.title2}{" "}
            <span className="text-[color:var(--yony-orange)]">{t.hero.titleOrange}</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-14 px-8 text-base font-semibold text-white">
                {t.hero.btnJoin}
              </Button>
            </a>
            <a href="#comment">
              <Button className="btn-ghost-night rounded-full h-14 px-8 text-base font-semibold">
                {t.hero.btnHow}
              </Button>
            </a>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {t.stats.map((s) => (
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
            <p className="text-eyebrow">{t.deesse.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              {t.deesse.name}<br />
              <span className="text-3xl md:text-4xl text-[color:var(--yony-blue)] font-bold">{t.deesse.subtitle}</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t.deesse.description}
            </p>
            <div className="mt-8 rounded-2xl bg-[color:var(--yony-deep)] p-6 shadow-xl shadow-[color:var(--yony-deep)]/20">
              <p className="text-[color:var(--yony-orange)] uppercase tracking-[0.3em] font-bold text-[0.78rem]">{t.deesse.missionEyebrow}</p>
              <p className="mt-2 text-lg font-medium text-white leading-relaxed">
                {t.deesse.missionText}
              </p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="card-light rounded-2xl p-5">
                <p className="text-eyebrow">{t.deesse.pillageEyebrow}</p>
                <h3 className="mt-2 text-xl text-[color:var(--yony-deep)]">{t.deesse.pillageTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.deesse.pillageText}
                </p>
              </div>
              <div className="card-light rounded-2xl p-5">
                <p className="text-eyebrow">{t.deesse.ruptureEyebrow}</p>
                <h3 className="mt-2 text-xl text-[color:var(--yony-deep)]">{t.deesse.ruptureTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.deesse.ruptureText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section className="py-20 bg-[color:var(--yony-deep)]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-eyebrow">{t.sources.eyebrow}</p>
          <h2 className="mt-3 text-4xl md:text-5xl text-white">
            {t.sources.title}
          </h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
            <div className="rounded-2xl p-7 bg-white/10 border border-white/15">
              <h3 className="text-xl text-white font-bold">{t.sources.faTitle}</h3>
              <p className="mt-3 text-white/70">
                {t.sources.faText}
              </p>
            </div>
            <div className="rounded-2xl p-7 bg-white/10 border border-white/15">
              <h3 className="text-xl text-white font-bold">{t.sources.yanantinTitle}</h3>
              <p className="mt-3 text-white/70">
                {t.sources.yanantinText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT */}
      <section id="comment" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-eyebrow">{t.comment.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              {t.comment.title}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.steps.map((s) => (
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
            <p className="text-eyebrow">{t.cycles.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t.cycles.title}</h2>
            <p className="mt-5 text-white/70 max-w-2xl mx-auto">
              {t.cycles.text}
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {t.cyclesData.map(([n, flag, name, date]) => (
              <div key={n} className="card-glow rounded-2xl p-4 text-center">
                <p className="text-[10px] tracking-[0.3em] text-[color:var(--yony-orange)] font-semibold">
                  {t.cycles.cycleLabel} {n}
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
            <p className="text-eyebrow">{t.jetons.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl text-[color:var(--yony-deep)]">
              {t.jetons.title}
            </h2>
            <p className="mt-5 text-muted-foreground">
              {t.jetons.text1}<strong className="text-[color:var(--yony-deep)]">{t.jetons.textStrong1}</strong>
              {t.jetons.text2}<strong className="text-[color:var(--yony-deep)]">{t.jetons.textStrong2}</strong>
              {t.jetons.text3}
            </p>
          </div>

          <div className="mt-16">
            <div className="mb-6">
              <h3 className="text-xl text-[color:var(--yony-deep)]">{t.jetons.arenesTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.jetons.arenesSubtitle}</p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.arenas.map((a) => (
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
              <h3 className="text-xl text-[color:var(--yony-deep)]">{t.jetons.spacesTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.jetons.spacesSubtitle}</p>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.spaces.map((a) => (
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
            <p className="text-eyebrow">{t.delegations.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">
              {t.delegations.title}
            </h2>
            <p className="mt-5 text-white/70">
              {t.delegations.subtitle1}<br />
              {t.delegations.subtitle2}
            </p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.delegationsList.map((d) => (
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
                {t.nav.join}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* INSCRIPTION */}
      <section id="inscription" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <JoinDelegationForm lang={lang} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-yony-night text-white py-28">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-eyebrow">{t.cta.date}</p>
          <h2 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
            {t.cta.title1}
            <br />
            <span className="text-[color:var(--yony-orange)]">{t.cta.titleOrange}</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#inscription">
              <Button className="btn-yony rounded-full h-14 px-8 text-base font-semibold text-white">
                {t.cta.btnJoin}
              </Button>
            </a>
            <a href="#parcours">
              <Button className="btn-ghost-night rounded-full h-14 px-8 text-base font-semibold">
                {t.hero.btnHow}
              </Button>
            </a>
          </div>
          <p className="mt-16 text-sm text-white/50">
            © 2027 Yony Games · {t.hero.subtitle}
          </p>
        </div>
      </section>
    </div>
  );
}
