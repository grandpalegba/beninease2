import Image from "next/image";
import heroBg from "@/assets/hero-benin-2.png";

const HeroSection = () => {
  return (
    <section className="relative bg-background">
      <div className="container max-w-6xl px-4 pt-28 pb-10 text-center md:pt-32 md:pb-14">
        <h1
          className="font-display text-5xl font-bold text-[#008751] opacity-0 animate-fade-up sm:text-6xl md:text-7xl lg:text-8xl mb-8 md:mb-10"
          style={{ lineHeight: "1.05", animationDelay: "0.2s" }}
        >
          Benin Is Us
          <span className="mt-3 block text-lg font-medium text-[#E9B113] sm:text-xl md:text-2xl lg:text-3xl">
            Le Bénin, c&apos;est Nous
          </span>
        </h1>

        <div
          className="mx-auto w-full max-w-5xl opacity-0 animate-fade-up overflow-hidden rounded-2xl bg-muted/40 shadow-lg ring-1 ring-border/50"
          style={{ animationDelay: "0.35s" }}
        >
          <Image
            src={heroBg}
            alt="Collage célébrant l'excellence béninoise : Zangbéto, Bio Guéra, Amazone, Porte du Non-Retour, King Béhanzin, et paysages naturels du Bénin"
            className="mx-auto block h-auto w-full object-contain object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
