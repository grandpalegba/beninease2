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
              Libérer des trésors (Bénin) et révéler des lieux magiques (Pérou)
            </p>
            <p className="cover-slogan">
              "Votre talent est la clé qui déverrouille l'histoire."
            </p>
            
            <div className="cover-stats-row">
              <div className="cover-stat">
                <div className="cover-stat-n">16</div>
                <div className="cover-stat-l">Nations Hôtes</div>
              </div>
              <div className="cover-stat">
                <div className="cover-stat-n">512</div>
                <div className="cover-stat-l">Trésors & Sites</div>
              </div>
              <div className="cover-stat">
                <div className="cover-stat-n">256</div>
                <div className="cover-stat-l">Jours de Cycle</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAIN CONTENT ─── */}
        <div className="main">
          
          {/* Section: Chiffres-Clés */}
          <section className="kf-section">
            <div className="section-header-block">
              <h2 className="section-title-big">L'Ingénierie <em>de la Victoire</em></h2>
            </div>
            
            <div className="kf-grid" style={{ marginTop: '2rem' }}>
              <div className="kf-card c1">
                <div className="kf-card-pre">Nations</div>
                <div className="kf-card-n">16</div>
                <div className="kf-card-label">Pays hôtes mobilisés pour chaque cycle de 256 jours</div>
              </div>
              <div className="kf-card c2">
                <div className="kf-card-pre">Trésors & Sites</div>
                <div className="kf-card-n">512</div>
                <div className="kf-card-label">256 trésors béninois + 256 sites archéologiques péruviens</div>
              </div>
              <div className="kf-card c3">
                <div className="kf-card-pre">Convergence</div>
                <div className="kf-card-n">41</div>
                <div className="kf-card-label">Ceques de Cusco = Lignées du Dahomey — Preuve de Convergence</div>
              </div>
              <div className="kf-card c4">
                <div className="kf-card-pre">Signes du Fâ</div>
                <div className="kf-card-n">256</div>
                <div className="kf-card-label">16 Amazones × 16 cycles = colonne vertébrale symbolique du jeu</div>
              </div>
            </div>

            <div className="quote-block">
              <p className="quote-text">
                "L'originalité des Yony Games, c'est d'avoir compris qu'un événement culturel mondial pouvait être sublimé par la convergence des sagesses ancestrales."
              </p>
              <div className="quote-author">YONY</div>
            </div>
          </section>

          {/* Section: Les Équipes (Action-Oriented) */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Rejoindre <em>l'Épopée</em></h2>
            </div>
            
            <div className="actors-grid" style={{ marginTop: '2rem' }}>
              <div className="actor-card a2" style={{ background: 'rgba(212,146,42,0.05)', borderColor: 'var(--gold)' }}>
                <div className="recruit-badge">RECRUTEMENT EN COURS</div>
                <div className="actor-icon">👑</div>
                <div className="actor-role">Conseil Souverain • 16 par pays</div>
                <h3 className="actor-name">Les Amazones</h3>
                <p className="actor-desc">
                  Femmes porteuses de projets à impact. Vous gérez la banque des jetons et coordonnez les coalitions mondiales.
                </p>
                <button className="btn-recruit">DEVENIR UNE AMAZONE - STRATÈGE</button>
                <span className="urgency-tag">Bénin : 4 places restantes</span>
              </div>

              <div className="actor-card a3" style={{ background: 'rgba(46,95,163,0.05)', borderColor: 'var(--blue)' }}>
                <div className="actor-icon">🛡️</div>
                <div className="actor-role">Générateurs de Jetons • 240 par pays</div>
                <h3 className="actor-name">Les Soutiens</h3>
                <p className="actor-desc">
                  Experts recrutés directement par les Amazones. Vous alimentez les arènes et produisez l'énergie du jeu.
                </p>
                <button className="btn-recruit blue">REJOINDRE LA DÉLÉGATION - EXPERT</button>
                <span className="urgency-tag">Sénégal : 12 places d'experts restantes</span>
              </div>

              <div className="actor-card a1">
                <div className="actor-icon">🧭</div>
                <div className="actor-role">Explorateurs de terrain</div>
                <h3 className="actor-name">L'Équipe Voyageurs</h3>
                <p className="actor-desc">
                  Porteur • Photographe • Spécialiste. Vous documentez les traditions sur 16 pays pendant 256 jours.
                </p>
                <button className="btn-recruit" style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)' }}>Candidature Voyageur</button>
              </div>
            </div>
          </section>

          {/* Section: Les 6 Arènes (Gallery) */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Les 6 <em>Arènes de Pouvoir</em></h2>
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', textAlign: 'center' }}>
              Choisissez votre domaine d'expertise et commencez à générer les jetons nécessaires à la libération des trésors.
            </p>

            <div className="spaces">
              <div className="space-card">
                <div className="space-tag s1">Sagesses</div>
                <div className="space-token-icon">👁️</div>
                <p className="space-desc">Défis de discernement et résolutions de cas de vie ancestraux.</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
              <div className="space-card">
                <div className="space-tag s2">Savoirs</div>
                <div className="space-token-icon">📜</div>
                <p className="space-desc">Culture générale, traditions orales et maîtrise des langues.</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
              <div className="space-card">
                <div className="space-tag s3">Talents</div>
                <div className="space-token-icon">🎨</div>
                <p className="space-desc">Duels artistiques, artisanat et performances traditionnelles.</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
              <div className="space-card">
                <div className="space-tag s4">Histoires</div>
                <div className="space-token-icon">🗣️</div>
                <p className="space-desc">Partage de récits de vie et transmission de la mémoire.</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
              <div className="space-card">
                <div className="space-tag s5">Portails</div>
                <div className="space-token-icon">⛩️</div>
                <p className="space-desc">Présence physique et activation des lieux partenaires (QR Codes).</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
              <div className="space-card">
                <div className="space-tag s6">Voyages</div>
                <div className="space-token-icon">🤝</div>
                <p className="space-desc">Cérémonies d'harmonisation et convergence mondiale en live.</p>
                <button className="btn-arena">S'engager dans cette arène</button>
              </div>
            </div>
          </section>

          {/* Section: Mur des Convergences (Social Proof) */}
          <section className="wall-preview">
            <h2 className="section-title-big">Le Mur des <em>Convergences</em></h2>
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)' }}>Le mouvement est lancé. Voici l'état de construction de la mémoire mondiale.</p>
            <div className="wall-grid">
              {[...Array(60)].map((_, i) => (
                <div key={i} className={`wall-brick ${i < 24 ? 'active' : ''}`}></div>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 'bold' }}>24 / 512 TRÉSORS LIBÉRÉS</div>
          </section>

        </div>

      </main>
    </div>
  );
}
