const steps = [
  {
    number: "01",
    title: "Découverte & Pré-sélection",
    desc: "16 talents par catégorie sont identifiés et entrent en compétition.",
  },
  {
    number: "02",
    title: "Présentation des talents",
    desc: "Chaque candidat se présente à travers 4 vidéos pour révéler sa vision.",
  },
  {
    number: "03",
    title: "Votes de la communauté",
    desc: "La communauté vote sur la plateforme (confirmation via WhatsApp).",
  },
  {
    number: "04",
    title: "Demi-finales : Top 8",
    desc: "Les 8 talents les plus soutenus par catégorie accèdent à la phase finale.",
  },
  {
    number: "05",
    title: "Finale : Projections & vote hybride",
    desc: "Une 5ᵉ vidéo des finalistes est dévoilée lors de projections publiques à travers le Bénin.",
    extra: "👉 Votes : 50% digital • 50% terrain",
  },
];

const SelectionSection = () => {
  return (
    <section id="selection" className="py-24 md:py-32">
      <div className="container px-4 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 font-body">
            Processus de sélection
          </p>
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance"
            style={{ lineHeight: "1.15" }}
          >
            ⚡ Parcours Beninease
          </h2>
        </div>

        <div className="relative ml-8 md:ml-16">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start gap-6">
                <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-sm font-bold font-body">{step.number}</span>
                </div>

                <div className="pt-1 min-w-0">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm md:text-base mt-1">{step.desc}</p>
                  {"extra" in step && step.extra ? (
                    <p className="text-foreground font-body text-sm md:text-base mt-3 font-medium">{step.extra}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <div className="rounded-xl border border-border bg-muted/40 px-6 py-6 md:px-8 md:py-7">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
              🏆 Résultat
            </h3>
            <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
              Les 4 talents les mieux classés deviennent Ambassadeurs et représentent le Bénin pendant 1 an.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectionSection;
