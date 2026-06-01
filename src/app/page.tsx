/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site BeninEase.
 */
import { Hero } from "@/components/quest/Hero";
import { OdysseyIntro } from "@/components/quest/OdysseyIntro";
import { Delegation } from "@/components/quest/Delegation";
import { FaHome } from "@/components/quest/FaHome";
import { CtaFinal } from "@/components/quest/CtaFinal";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <OdysseyIntro />

        
        <footer className="border-t border-zinc-100 py-12 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-[10px] text-zinc-400">
            <div className="flex items-center gap-3 uppercase tracking-[0.3em] font-medium">
              <span className="text-black">Yonyverse</span>
              <span className="opacity-30">—</span>
              <span>© Tous droits réservés</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
