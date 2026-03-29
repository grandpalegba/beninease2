import Image from "next/image";
import heroBg from "@/assets/hero-benin-2.png";

const HeroSection = () => {
  return (
    <section className="relative bg-[#F9F9F7] overflow-hidden">
      <div className="container max-w-6xl px-4 pt-28 pb-10 text-center md:pt-32 md:pb-14 relative z-10">
        <div className="mb-8 md:mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h1
            className="font-display text-6xl font-bold text-black sm:text-7xl md:text-8xl lg:text-9xl mb-4"
            style={{ lineHeight: "1.05" }}
          >
            Benin is US
          </h1>
          <p
            className="font-display text-xl font-medium text-[#006B3F] sm:text-2xl md:text-3xl lg:text-4xl"
            style={{ letterSpacing: "0.02em" }}
          >
            Unity & Success
          </p>
        </div>

        <div
          className="mx-auto w-full max-w-5xl opacity-0 animate-fade-up overflow-hidden rounded-2xl bg-white/10 shadow-xl ring-1 ring-black/5"
          style={{ animationDelay: "0.35s" }}
        >
          <Image
            src={heroBg}
            alt="Collage célébrant l'excellence béninoise"
            className="mx-auto block h-auto w-full object-contain object-center shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
