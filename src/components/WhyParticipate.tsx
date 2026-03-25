import { Globe, TrendingUp, UserCheck, MapPin, Star, CheckCircle } from "lucide-react";

const benefits = [
  { icon: Globe, label: "Visibilité internationale" },
  { icon: TrendingUp, label: "Augmentation de la clientèle" },
  { icon: UserCheck, label: "Personal Branding" },
  { icon: MapPin, label: "Renforcement du tourisme" },
  { icon: Star, label: "Rayonnement du Bénin" },
  { icon: CheckCircle, label: "Participation gratuite" },
];

const WhyParticipate = () => {
  return (
    <section className="py-24 md:py-32 bg-[#b25c39] text-accent-foreground">
      <div className="container px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gold mb-4 font-body">
            Avantages
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-balance" style={{ lineHeight: "1.15" }}>
            Pourquoi postuler ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-5">
                <Icon className="w-6 h-6 text-gold shrink-0" />
                <span className="text-sm font-medium text-primary-foreground/90 font-body">{b.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <a
            href="/login?signup=true"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase text-[#b25c39] shadow-lg transition-all hover:bg-[#f0e6d8] hover:scale-105 active:scale-95"
          >
            S'inscrire maintenant
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyParticipate;
