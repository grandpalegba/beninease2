"use client";

import React from "react";
import "./yony-games.css";
import Image from "next/image";
import { motion } from "framer-motion";

export default function YonyGamesPage() {
  return (
    <div className="yony-games">
      <main className="min-h-screen bg-[#F5F3EF]">
        
        {/* ─── COVER ─── */}
        <section className="cover">
          <div className="cover-stripe-top"></div>
          <div className="cover-geo">
            <div className="cover-geo-circle1"></div>
            <div className="cover-geo-circle2"></div>
            <div className="cover-geo-circle3"></div>
            <div className="cover-geo-circle4"></div>
            <div className="cover-geo-circle5"></div>
            <div className="cover-geo-circle6"></div>
          </div>
          
          <div className="cover-header">
            <div className="cover-logo">
              <Image 
                src="/logo.png" 
                alt="Yony Games Logo" 
                width={52} 
                height={52} 
                className="cover-logo-img"
              />
              <div className="cover-logo-text">
                <span className="cover-logo-name">YONY GAMES</span>
                <span className="cover-logo-tagline">L'épopée de la mémoire</span>
              </div>
            </div>
            <div className="cover-badge">Présentation Officielle</div>
          </div>

          <div className="cover-body">
            <div className="cover-eyebrow">
              <span>Vision & Stratégie</span>
            </div>
            <h1 className="cover-title">
              Jeux de Valorisation du <em>Féminin</em> et des <em>Traditions</em> du Monde
            </h1>
            <p className="cover-desc">
              Un événement sportif et culturel panafricain d'envergure, célébrant la convergence des sagesses ancestrales et l'impact réel sur le monde.
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

          <div className="cover-footer">
            <div className="cover-date">2026 — 2027</div>
            <div className="cover-doc-type">PROGRAMME</div>
          </div>
        </section>

        {/* ─── MAIN CONTENT ─── */}
        <div className="main">
          
          {/* Section: Chiffres-Clés */}
          <section className="kf-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Chiffres-<em>Clés</em></h2>
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

            <div className="kf-budget-row">
              <div className="kf-bud b1">
                <div className="kf-bud-label">Structure des Équipes</div>
                <div className="kf-bud-amount">3</div>
                <div className="kf-bud-note">Voyageurs par pays hôte — Porteur, Photographe, Spécialiste des traditions</div>
              </div>
              <div className="kf-bud b2">
                <div className="kf-bud-label">Conseil Souverain</div>
                <div className="kf-bud-amount">16</div>
                <div className="kf-bud-note">Amazones par délégation — femmes porteuses de projets à impact</div>
              </div>
              <div className="kf-bud b3">
                <div className="kf-bud-label">Jetons Sacrés</div>
                <div className="kf-bud-amount">6</div>
                <div className="kf-bud-note">Types de jetons à réunir pour libérer un trésor ou réactiver un site</div>
              </div>
            </div>

            <div className="quote-block">
              <p className="quote-text">
                "L'originalité des Yony Games, c'est d'avoir compris qu'un événement culturel mondial pouvait être sublimé par la convergence des sagesses ancestrales. Depuis les cérémonies d'ouverture jusqu'au choix des sites, nous mettons à profit l'incroyable richesse du patrimoine mondial — et de la mémoire des femmes."
              </p>
              <div className="quote-author">YONY</div>
              <div className="quote-role">Fondatrice & Visionnaire</div>
            </div>
          </section>

          {/* Section: L'Esprit du Jeu */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">L'Esprit <em>du Jeu</em></h2>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <div className="content-lead">
                Les Yony Games célèbrent la force du collectif et la sagesse des ancêtres. Ils ne sont pas une compétition ordinaire — ils sont une épopée de mémoire, de sororité et d'impact réel sur le monde.
              </div>
              
              <div className="fa-block">
                <div className="fa-number">256</div>
                <div className="fa-content">
                  <h3 className="fa-title">16 AMAZONES × 16 CYCLES = 256 SIGNES DU FÂ</h3>
                  <p className="fa-desc">
                    Le nombre exact de signes de la matrice divinatoire du Fâ — système de connaissance ancestral béninois millénaire. 
                    Ce n'est pas une coïncidence : c'est la colonne vertébrale symbolique des Yony Games. 
                    256 trésors du Bénin, 256 sites du Pérou, 256 membres par délégation, 256 jours de cycle. 
                    La structure du jeu est inscrite dans l'ancestralité.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Le Nombre 41 */}
          <section className="content-section">
            <div className="num41-block">
              <div className="num41-header">
                <div className="num41-digit">41</div>
                <div className="num41-text">
                  <h3 className="num41-headline">Preuve de <em>Convergence</em></h3>
                  <p className="num41-sub">Une symétrie sacrée entre l'Afrique et l'Amérique</p>
                </div>
              </div>
              <div className="num41-cols">
                <div className="num41-col benin">
                  <div className="num41-col-tag">Bénin</div>
                  <h4 className="num41-col-title">41 Lignées du Dahomey</h4>
                  <p className="num41-col-desc">Les familles fondatrices qui portent la mémoire du Royaume et ses traditions sacrées.</p>
                </div>
                <div className="num41-col peru">
                  <div className="num41-col-tag">Pérou</div>
                  <h4 className="num41-col-title">41 Ceques de Cusco</h4>
                  <p className="num41-col-desc">Lignes énergétiques invisibles reliant le Temple du Soleil aux sites sacrés de l'Empire Inca.</p>
                </div>
                <div className="num41-col yony">
                  <div className="num41-col-tag">Yony Games</div>
                  <h4 className="num41-col-title">Convergence Totale</h4>
                  <p className="num41-col-desc">Le jeu réunit ces deux géométries pour créer un pont de conscience entre les deux continents.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: La Mission */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">La Mission — <em>La Double Épopée</em></h2>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <div className="content-lead">
                Le succès aux Yony Games dépend d'une double épopée de sauvegarde du patrimoine mondial, menée simultanément sur deux continents.
              </div>
              
              <div className="mission-duo">
                <div className="mission-card benin">
                  <div className="mission-card-geo"></div>
                  <div className="mission-country">Continent Africain • Bénin</div>
                  <h3 className="mission-title">La Libération des Trésors</h3>
                  <p className="mission-desc">
                    Redonner vie et visibilité à 256 trésors historiques béninois. Chaque trésor libéré est une victoire pour la mémoire collective de l'humanité.
                  </p>
                  <div className="mission-count">256</div>
                </div>
                <div className="mission-card peru">
                  <div className="mission-card-geo"></div>
                  <div className="mission-country">Continent Américain • Pérou</div>
                  <h3 className="mission-title">La Réactivation des Sites</h3>
                  <p className="mission-desc">
                    Réveiller l'énergie vibratoire de 256 sites archéologiques dans la Vallée Sacrée de Cusco. Chaque réactivation est un souffle rendu aux ancêtres.
                  </p>
                  <div className="mission-count">256</div>
                </div>
              </div>

              <div className="gold-rule">
                <strong>La Règle d'Or :</strong> Pour valider une libération ou une réactivation, il faut <strong>6 appels de 6 nations différentes</strong>. 
                Aucune nation ne peut libérer seule. C'est l'union de vos forces qui déclenche la réussite. 
                L'Indice d'Harmonie récompense l'équilibre entre vos actions au Bénin et au Pérou.
              </div>
            </div>
          </section>

          {/* Section: La Mécanique */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">La Mécanique <em>de Libération</em></h2>
            </div>
            
            <div className="lib-grid" style={{ marginTop: '2rem' }}>
              <div className="lib-step">
                <div className="lib-n">6</div>
                <div className="lib-l">types de jetons réunis</div>
              </div>
              <div className="lib-step">
                <div className="lib-n">6</div>
                <div className="lib-l">nations différentes en coalition</div>
              </div>
              <div className="lib-step">
                <div className="lib-n">1</div>
                <div className="lib-l">trésor ou site libéré</div>
              </div>
              <div className="lib-step">
                <div className="lib-n">?</div>
                <div className="lib-l">points aléatoires cryptés révélés</div>
              </div>
              <div className="lib-step">
                <div className="lib-n">×16</div>
                <div className="lib-l">multiplicateur max de solidarité</div>
              </div>
            </div>

            <div className="gold-rule" style={{ borderLeftColor: '#F0BE68' }}>
              Les trésors sont visibles sur un marché ouvert. Les nations repèrent librement ceux auxquels elles souhaitent contribuer — sans invitation, sans négociation préalable. 
              Les coalitions se forment par affinité stratégique et complémentarité de jetons.
            </div>
          </section>

          {/* Section: L'Ingénierie */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">L'Ingénierie <em>de la Victoire</em></h2>
            </div>
            
            <div className="score-grid" style={{ marginTop: '2rem' }}>
              <div className="score-card s1">
                <div className="score-label">Composante 1</div>
                <h3 className="score-title">Le Bonus de l'Audace</h3>
                <p className="score-desc">Le jeu valorise l'initiative. Les délégations qui prennent des risques sont récompensées.</p>
                <div className="score-val">×1.5</div>
              </div>
              <div className="score-card s2">
                <div className="score-label">Composante 2</div>
                <h3 className="score-title">Multiplicateur de Solidarité</h3>
                <p className="score-desc">Chaque projet Amazone financé incrémente le multiplicateur global. C'est le levier le plus puissant du score.</p>
                <div className="score-val">×16</div>
              </div>
              <div className="score-card s3">
                <div className="score-label">Composante 3</div>
                <h3 className="score-title">L'Indice d'Harmonie</h3>
                <p className="score-desc">L'équilibre entre vos actions au Bénin et au Pérou libère toute la puissance de votre multiplicateur.</p>
                <div className="score-val">= MAX</div>
              </div>
            </div>

            <div className="pioneer-duo">
              <div className="pioneer-card">
                <div className="pioneer-badge">Statut de Pionnier</div>
                <h3 className="pioneer-title">Les 3 Premières Coalitions</h3>
                <p className="pioneer-desc">Les 3 premières délégations qui lancent une coalition reçoivent un bonus sur les points du projet libéré.</p>
                <div className="pioneer-val">× 1.5</div>
              </div>
              <div className="pioneer-card">
                <div className="pioneer-badge">Force de Frappe</div>
                <h3 className="pioneer-title">Les Délégations qui Complètent</h3>
                <p className="pioneer-desc">Les nations qui rejoignent une coalition et la portent à 6 sécurisent les points de base pour leur pays.</p>
                <div className="pioneer-val">Points Base</div>
              </div>
            </div>

            <div className="formula-block">
              <div className="formula-eq">
                Score Final = Σ (Points Trésors + Points Sites) × Multiplicateur de Solidarité (1 → 16)
                <span>Calculé en temps réel sur la blockchain de la mémoire</span>
              </div>
            </div>
          </section>

          {/* Section: Les Équipes */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Les <em>Équipes</em></h2>
            </div>
            
            <div className="actors-grid" style={{ marginTop: '2rem' }}>
              <div className="actor-card a1">
                <div className="actor-icon">🧭</div>
                <div className="actor-role">Cœur vivant du jeu</div>
                <h3 className="actor-name">L'Équipe des 3 Voyageurs</h3>
                <p className="actor-desc">
                  Porteur de projet • Photographe • Spécialiste des traditions. 16 jours par pays hôte, 16 pays, 256 jours. 
                  Ils documentent, créent les défis culturels et organisent les cérémonies d'harmonisation.
                </p>
              </div>
              <div className="actor-card a2">
                <div className="actor-icon">👑</div>
                <div className="actor-role">Conseil Souverain • 16 par pays</div>
                <h3 className="actor-name">Les Amazones</h3>
                <p className="actor-desc">
                  Des femmes porteuses de projets à impact, une par délégation. Elles gèrent collectivement la banque des 6 jetons, 
                  coordonnent les coalitions de libération et organisent les soirées de convergence. Leur organisation est libre.
                </p>
              </div>
              <div className="actor-card a3">
                <div className="actor-icon">🛡️</div>
                <div className="actor-role">Générateurs de Jetons • 240 par pays</div>
                <h3 className="actor-name">Les Soutiens</h3>
                <p className="actor-desc">
                  15 experts par Amazone, recrutés par le conseil. Ils alimentent les 6 espaces du jeu et produisent les jetons nécessaires à la libération des trésors. 
                  Ils servent les Amazones sans les gouverner.
                </p>
              </div>
              <div className="actor-card a4">
                <div className="actor-inner">
                  <div className="actor-icon">🌍</div>
                  <div className="actor-text">
                    <div className="actor-role">Concordance + Convergence</div>
                    <h3 className="actor-name">Touristes et Grand Public Mondial</h3>
                    <p className="actor-desc">
                      Les touristes génèrent la Concordance en scannant les QR codes des lieux culturels partenaires. 
                      Le grand public mondial génère la Convergence en assistant aux cérémonies d'harmonisation diffusées en live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Les 6 Espaces */}
          <section className="content-section">
            <div className="section-header-block">
              <h2 className="section-title-big">Les 6 Espaces & <em>Les 6 Jetons</em></h2>
            </div>
            
            <p style={{ marginTop: '2rem', fontSize: '14px', color: '#666', marginBottom: '1.5rem' }}>
              Chaque espace produit un type de jeton. Les 6 jetons sont nécessaires pour libérer un trésor ou réactiver un site.
            </p>

            <div className="spaces">
              <div className="space-row">
                <div className="space-tag s1">Espace Sagesses</div>
                <div className="space-desc">Résolutions de cas de vie • défis de sagesse ancestrale et de discernement</div>
                <div className="space-token t1">Jeton de Conscience</div>
              </div>
              <div className="space-row">
                <div className="space-tag s2">Espace Savoirs</div>
                <div className="space-desc">Défis de culture générale • questions sur les traditions, l'histoire, les langues</div>
                <div className="space-token t2">Jeton de Connaissance</div>
              </div>
              <div className="space-row">
                <div className="space-tag s3">Espace Talents</div>
                <div className="space-desc">Duels artistiques • musique, arts visuels, danse, artisanat traditionnel</div>
                <div className="space-token t3">Jeton de Compétence</div>
              </div>
              <div className="space-row">
                <div className="space-tag s4">Espace Histoires</div>
                <div className="space-desc">Partage de récits de vie • témoignages, narrations orales, mémoire transmise</div>
                <div className="space-token t4">Jeton de Confiance</div>
              </div>
              <div className="space-row">
                <div className="space-tag s5">Espace Portails</div>
                <div className="space-desc">Scan de QR codes sur les lieux partenaires • présence physique sur les sites culturels</div>
                <div className="space-token t5">Jeton de Concordance</div>
              </div>
              <div className="space-row">
                <div className="space-tag s6">Espace Voyages</div>
                <div className="space-desc">Cérémonies d'harmonisation en live • création du Mur des Convergences</div>
                <div className="space-token t6">Jeton de Convergence</div>
              </div>
            </div>
          </section>

          {/* Section: Closing */}
          <section className="content-section" style={{ marginBottom: '5rem' }}>
            <div className="closing">
              <div className="closing-label">Rejoignez l'Épopée</div>
              <h2 className="closing-text">
                Les <em>Yony Games</em> ne sont pas un jeu, c'est un <strong>serment</strong> prêté à la mémoire de nos ancêtres.
              </h2>
            </div>
          </section>

        </div>

        {/* ─── FOOTER ─── */}
        <footer className="bg-[#1B2A4A] text-white py-12 px-8 text-center mt-12">
          <div className="max-w-4xl mx-auto">
            <Image 
              src="/logo.png" 
              alt="Yony Games Logo" 
              width={64} 
              height={64} 
              className="mx-auto mb-6 opacity-80"
            />
            <p className="text-xl font-light italic mb-8 opacity-60">
              "Le futur appartient à ceux qui se souviennent de leur passé."
            </p>
            <div className="flex justify-center gap-8 text-xs uppercase tracking-widest opacity-40">
              <span>Bénin</span>
              <span>Pérou</span>
              <span>Monde</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
