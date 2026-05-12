/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site BeninEase.
 */
import { Hero } from "@/components/quest/Hero";
import { YonyLegend } from "@/components/quest/YonyLegend";
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
        <YonyLegend />

        
        <footer className="border-t border-zinc-100 py-10 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-green)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-yellow)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--benin-red)" }} />
              <span className="ml-2 uppercase tracking-[0.25em] font-medium text-black">Yonyverse</span>
            </div>
            <div className="uppercase tracking-[0.25em]">© Tous droits réservés</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
