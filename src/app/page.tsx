/**
 * PAGE PUBLIQUE - ACCUEIL
 * Role: Vitrine principale du site BeninEase.
 */
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import UniversGrid from "@/components/UniversGrid";
import MissionBanner from "@/components/MissionBanner";
import SelectionSection from "@/components/SelectionSection";
import WhyParticipate from "@/components/WhyParticipate";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>

        <HeroSection />
        <MissionBanner />
        <ConceptSection />
        <UniversGrid />
        <SelectionSection />
        <WhyParticipate />
      </main>
      <Footer />
    </div>
  );
}
