"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { talents } from "@/data/talents";
import TalentCard from "@/components/TalentCard";

const categories = ["Tous", ...new Set(talents.map((t) => t.category))];

const RefletsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const router = useRouter();

  const filtered =
    selectedCategory === "Tous"
      ? talents
      : talents.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border py-12 text-center">
        <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">
          Talents du Bénin
        </h1>

        {/* Category filter */}
        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 font-sans text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Duel button */}
        <button
          onClick={() => router.push("/duel")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#bd0020] px-8 py-3 font-display text-base font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#a0001a] active:scale-95"
        >
          🔥 Démarrer les Duels
        </button>
      </header>

      {/* Grid */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {filtered.map((talent) => (
            <TalentCard key={talent.name} talent={talent} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center font-sans text-sm text-muted-foreground">
        © 2026 BeninEase — Tous droits réservés
      </footer>
    </div>
  );
};

export default RefletsPage;
