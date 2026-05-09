"use client";

import { motion } from "framer-motion";
import { NATIONS, flagEmoji } from "./Pantheon";

export function FaHome() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#0d0d0d",
        backgroundColor: "#0d0d0d",
        color: "#ffffff",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.01em",
              lineHeight: 1.05,
            }}
          >
            La Géométrie Sacrée du{" "}
            <em style={{ color: "#D4922A", fontStyle: "normal" }}>Fâ</em>
          </h2>
        </div>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "17px",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "4rem",
            textAlign: "center",
          }}
        >
          La structure des jeux s'appuie sur la science du Fâ, l'une des plus grandes
          traditions majeures du patrimoine béninois.
        </p>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left: Nations grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "2rem",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "2rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.5rem",
              }}
            >
              {NATIONS.map((n, i) => (
                <motion.div
                  key={n.code}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{flagEmoji(n.code)}</span>
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {n.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Temporalité Unique */}
            <div>
              <h3
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "0.75rem",
                }}
              >
                Temporalité Unique
              </h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                La compétition s'articule en{" "}
                <strong style={{ color: "#D4922A" }}>16 cycles</strong> de{" "}
                <strong style={{ color: "#D4922A" }}>16 jours</strong> chacun. Une
                résonance temporelle parfaite avec la matrice primordiale.
              </p>
            </div>

            {/* Quote card */}
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", lineHeight: 1.6 }}>
                Les Défis sont construits autour des cultures, des traditions de{" "}
                <span style={{ color: "#D4922A" }}>16 Nations-Mères</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
