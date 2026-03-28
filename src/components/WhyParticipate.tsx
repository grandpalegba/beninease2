import { Globe, TrendingUp, UserCheck, MapPin, Star, CheckCircle } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: Globe, label: "Visibilité internationale" },
  { icon: TrendingUp, label: "Augmentation de la clientèle" },
  { icon: UserCheck, label: "Personal Branding" },
  { icon: MapPin, label: "Renforcement du tourisme" },
  { icon: Star, label: "Rayonnement du Bénin" },
  { icon: CheckCircle, label: "Participation citoyenne" },
];

const WhyParticipate = () => {
  return (
    <section className="py-24 md:py-32 bg-[#008751] text-accent-foreground">
      <div className="container px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/80 mb-4 font-body">
            Avantages
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance" style={{ lineHeight: "1.15" }}>
            Pourquoi postuler ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-5 border border-white/5">
                <Icon className="w-6 h-6 text-white shrink-0" />
                <span className="text-sm font-medium text-white/90 font-body">{b.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/postuler"
            className="inline-flex items-center justify-center rounded-full bg-[#F9F9F7] px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase text-[#008751] shadow-lg transition-all hover:bg-[#004d3d] hover:text-white hover:scale-105 active:scale-95"
          >
            POSTULER MAINTENANT
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyParticipate;
