/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site BeninEase.
 */
import { AfrakaDoors } from "@/components/AfrakaDoors";
import { Hero } from "@/components/quest/Hero";
import { Vision } from "@/components/quest/Vision";
import { Architecture } from "@/components/quest/Architecture";
import { Protagonistes } from "@/components/quest/Protagonistes";
import { Guardians } from "@/components/quest/Guardians";
import { CtaFinal } from "@/components/quest/CtaFinal";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <Vision />
        <Architecture />
        <Protagonistes />
        <Guardians />
        <CtaFinal />
        <AfrakaDoors />
        
        <footer className="border-t border-zinc-100 py-10 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-green)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-yellow)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-red)" }} />
              <span className="ml-2 uppercase tracking-[0.25em] font-medium text-black">Yonyverse</span>
            </div>
            <div className="uppercase tracking-[0.25em]">© L'Odyssée du Retour</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
