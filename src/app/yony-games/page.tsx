"use client";

import React from "react";
import "./yony-games.css";
import Image from "next/image";
import { motion } from "framer-motion";

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
              OLYMPIADES DES TRADITIONS DU MONDE
            </h1>
            <p className="cover-desc">
              Libérer des trésors et révéler des lieux magiques
            </p>

            
            <div className="cover-stats-row">

              <div className="cover-stat">
                <div className="cover-stat-n">256</div>
                <div className="cover-stat-l">Jours de Cycle</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT ─── */}
        <div className="main">
          


          {/* Section: Les Équipes (Action-Oriented) */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Les délégations <em>nationales</em></h2>
            </div>
            
            <div className="actors-grid" style={{ marginTop: '2rem' }}>
              <div className="actor-card a2" style={{ background: 'rgba(212,146,42,0.05)', borderColor: 'var(--gold)' }}>

                <h3 className="actor-name">Les Amazones</h3>
                <p className="actor-desc">
                  Femmes porteuses de projets à impact. Vous gérez la banque des jetons et coordonnez les coalitions mondiales.
                </p>
                <button className="btn-recruit">DEVENIR UNE AMAZONE - STRATÈGE</button>

              </div>

              <div className="actor-card a3" style={{ background: 'rgba(46,95,163,0.05)', borderColor: 'var(--blue)' }}>

                <h3 className="actor-name">Les Soutiens</h3>
                <p className="actor-desc">
                  Experts recrutés directement par les Amazones. Vous alimentez les arènes et produisez l'énergie du jeu.
                </p>
                <button className="btn-recruit blue">REJOINDRE LA DÉLÉGATION - EXPERT</button>

              </div>


            </div>
          </section>

          {/* Section: Les 6 Arènes (Gallery) */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Les 6 <em>espaces des jeux</em></h2>
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', textAlign: 'center' }}>
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
          </section>



        </div>

      </main>
    </div>
  );
}
