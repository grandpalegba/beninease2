"use client";

import React from "react";
import "./yony-games.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { Delegation } from "@/components/quest/Delegation";
import { FaHome } from "@/components/quest/FaHome";
import { CtaFinal } from "@/components/quest/CtaFinal";
import FaMatrix from "@/components/FaMatrix";

export default function YonyGamesPage() {
  return (
    <div className="yony-games">
      <main className="min-h-screen">
        
        {/* ─── COVER ─── */}
        <section className="cover" style={{ background: '#1B2A4A', border: 'none' }}>
          <div className="cover-stripe-top"></div>
          


          <div className="cover-body">
            <h1 className="cover-title" style={{ color: 'var(--gold)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              OLYMPIADES DU FÂ
            </h1>
            <h2 className="cover-subtitle" style={{ color: 'white', fontSize: '20px', fontWeight: '500', marginBottom: '3rem', letterSpacing: '0.03em' }}>
              Récits, Savoirs et Traditions Ancestrales du monde
            </h2>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
              <strong>Mission :</strong> 16 trésors de 16 pays doivent retrouver leur terre d'origine et toute leur puissance pour délivrer l'énergie de guérison du monde.
            </p>
            
            <div className="cover-stats-row">
              <div className="cover-stat">
                <div className="cover-stat-n">256</div>
                <div className="cover-stat-l">16 cycles de 16 jours</div>
              </div>
              <div className="cover-stat">
                <div className="cover-stat-n">16</div>
                <div className="cover-stat-l">Nations Hôtes</div>
              </div>
              <div className="cover-stat">
                <div className="cover-stat-n">256</div>
                <div className="cover-stat-l">Trésors à libérer</div>
              </div>
            </div>
          </div>
        </section>
        <Delegation />
        <FaHome />
        <div className="main">
          {/* Section: Les 6 Arènes (Gallery) */}
          <section className="content-section">
            <div className="max-w-5xl mx-auto">
              <div className="section-header-block">
                <h2 className="section-title-big">Les 6 <em>arènes des jeux</em></h2>
              </div>
              
              <p style={{ marginTop: '0.5rem', fontSize: '17px', color: 'rgba(0,0,0,0.6)', marginBottom: '2.5rem', textAlign: 'center' }}>
                Les Amazones répartissent leurs soutiens en fonction de leur domaine d'expertise.
              </p>

              <div className="spaces">
                <div className="space-card">
                  <div className="space-tag s1">Sagesses</div>
                  <p className="space-desc">Défis de discernement et résolutions de cas de vie ancestraux.</p>
                </div>
                <div className="space-card">
                  <div className="space-tag s2">Savoirs</div>
                  <p className="space-desc">Culture générale, traditions orales et maîtrise des langues.</p>
                </div>
                <div className="space-card">
                  <div className="space-tag s3">Talents</div>
                  <p className="space-desc">Duels artistiques, artisanat et performances traditionnelles.</p>
                </div>
                <div className="space-card">
                  <div className="space-tag s4">Histoires</div>
                  <p className="space-desc">Partage de récits de vie et transmission de la mémoire.</p>
                </div>
                <div className="space-card">
                  <div className="space-tag s5">Portails</div>
                  <p className="space-desc">Présence physique et activation des lieux partenaires (QR Codes).</p>
                </div>
                <div className="space-card">
                  <div className="space-tag s6">Voyages</div>
                  <p className="space-desc">Cérémonies d'harmonisation et convergence mondiale en live.</p>
                </div>
              </div>
            </div>
          </section>
 
  
  
          <section className="py-24" style={{ background: '#FFFFFF' }}>
            <div className="max-w-5xl mx-auto px-4">
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h2 style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "#2E5FA3",
                  letterSpacing: "0.01em",
                  lineHeight: 1.1,
                  marginBottom: "1.5rem"
                }}>
                  La Matrice du Fâ
                </h2>
                <p style={{
                  fontSize: "18px",
                  color: "rgba(0,0,0,0.6)",
                  lineHeight: 1.7,
                  maxWidth: "850px",
                  margin: "0 auto 1.5rem auto",
                  textAlign: "center"
                }}>
                  Chaque signe de la Matrice définit, selon l’arène choisie, les défis à relever. Une bibliothèque collaborative enrichie par des spécialistes du Fâ proposera des clés de compréhension, récits et interprétations liés à chaque signe.
                </p>
                <p style={{
                  fontSize: "18px",
                  color: "rgba(0,0,0,0.6)",
                  lineHeight: 1.7,
                  maxWidth: "850px",
                  margin: "0 auto",
                  textAlign: "center"
                }}>
                  En parallèle, une matrice distincte consacrée aux valeurs humaines fondamentales, développée avec des experts dédiés, apportera un autre angle de lecture autour des émotions, des relations et des expériences universelles.
                </p>
              </div>

              <div className="w-full">
                <FaMatrix useModal={true} />
              </div>
            </div>
          </section>

          <CtaFinal />




        </div>

      </main>
    </div>
  );
}
