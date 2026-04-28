/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site BeninEase.
 */
import HeroSection from "@/components/HeroSection";
import { AfrakaDoors } from "@/components/AfrakaDoors";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <AfrakaDoors />
      </main>
    </div>
  );
}
