/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site Yonyverse V4.0.
 */
import { Hero } from "@/components/quest/Hero";
import { CouncilOfSixteen } from "@/components/quest/CouncilOfSixteen";
import { TransmissionArenas } from "@/components/quest/TransmissionArenas";
import { ImpactSection } from "@/components/quest/ImpactSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <CouncilOfSixteen />
        <TransmissionArenas />
        <ImpactSection />
        
        <footer className="border-t border-zinc-100 py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="ml-2 uppercase tracking-[0.4em] font-bold text-zinc-950">Yonyverse V4.0</span>
            </div>
            <div className="flex gap-8 uppercase tracking-[0.25em] font-medium">
              <span>Mentions Légales</span>
              <span>Politique de Confidentialité</span>
              <span>© 2026 Tous droits réservés</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
