import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import ProfilePreview from "@/components/ProfilePreview";
import UniversGrid from "@/components/UniversGrid";
import MissionBanner from "@/components/MissionBanner";
import SelectionSection from "@/components/SelectionSection";
import WhyParticipate from "@/components/WhyParticipate";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ConceptSection />
        <MissionBanner />
        <ProfilePreview />
        <UniversGrid />
        <SelectionSection />
        <WhyParticipate />
      </main>
      <Footer />
    </div>
  );
}
