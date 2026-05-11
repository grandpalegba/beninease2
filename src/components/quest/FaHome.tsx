"use client";

import { motion } from "framer-motion";
import { NATIONS, flagEmoji } from "./Pantheon";

export function FaHome() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#1B2A4A",
        backgroundColor: "#1B2A4A",
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
            16 Nations Hôtes
          </h2>
          <p style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            maxWidth: "800px",
            margin: "2rem auto 4rem auto",
            textAlign: "center"
          }}>
            À chaque cycle, une nouvelle Nation Hôte devient le cœur vivant des Jeux, inspirant les défis, récits et expériences culturelles partagés par les participants du monde entier.
          </p>
        </div>

        {/* Centered Nations grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "2rem",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "2.5rem 2rem",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
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
                  gap: "0.75rem",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>{flagEmoji(n.code)}</span>
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.4)",
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
      </div>
    </section>
  );
}
