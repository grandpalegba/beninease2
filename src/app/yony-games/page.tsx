"use client";

import React from "react";
import "./yony-games.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { Delegation } from "@/components/quest/Delegation";
import { FaHome } from "@/components/quest/FaHome";
import { CtaFinal } from "@/components/quest/CtaFinal";

export default function YonyGamesPage() {
  return (
    <div className="yony-games">
      <main className="min-h-screen">
        
        {/* ─── COVER ─── */}
        <section className="cover" style={{ background: 'var(--navy-d)', border: 'none' }}>
          <div className="cover-stripe-top"></div>
          
          <div className="cover-header">
            <div className="cover-logo">
              <Image 
                src="/yony-games-logo.png" 
                alt="Yony Games Logo" 
                width={52} 
                height={52} 
                className="cover-logo-img"
              />
              <div className="cover-logo-text">
                <span className="cover-logo-name">YONY GAMES</span>
              </div>
            </div>
          </div>

          <div className="cover-body">
            <h1 className="cover-title" style={{ color: 'var(--gold)', letterSpacing: '0.05em' }}>
              OLYMPIADES DES TRADITIONS <br /> DU MONDE
            </h1>


            
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

        {/* ─── MAIN CONTENT ─── */}
        <div className="main">
          




          {/* Section: Les 6 Arènes (Gallery) */}
          <section className="content-section">
            <div className="max-w-5xl mx-auto">
              <div className="section-header-block">
                <h2 className="section-title-big">Les 6 <em>arènes des jeux</em></h2>
              </div>
              
              <p style={{ marginTop: '1rem', fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', textAlign: 'center' }}>
                Choisissez votre domaine d'expertise et commencez à générer les jetons nécessaires à la libération des trésors.
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
 
  
  

          <CtaFinal />




        </div>

      </main>
    </div>
  );
}
