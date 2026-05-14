"use client";

import { motion } from "framer-motion";
import { NATIONS, Flag } from "./Pantheon";

export function FaHome() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#043a82",
        backgroundColor: "#043a82",
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
          className="bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 p-6 md:p-10 max-w-[700px] mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {NATIONS.map((n, i) => (
              <motion.div
                key={n.code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex flex-col items-center gap-2 md:gap-3"
              >
                <Flag code={n.code} className="text-3xl md:text-4xl" />
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold text-center leading-tight">
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
