const steps = [
  {
    number: "01",
    title: "Qualifications",
    desc: "Chaque candidat s'inscrit et se présente dans une vidéo. Vote d'un jury de présélection.",
  },
  {
    number: "02",
    title: "Demi-finales : Top 16 - Votes en ligne",
    desc: "Les 16 candidats retenus par catégorie publient 3 vidéos supplémentaires.",
  },
  {
    number: "03",
    title: "Finale : Top 8 - Votes sur le terrain",
    desc: "Les 8 finalistes par catégorie fournissent une 5ème vidéo dévoilée lors de projections publiques dans plusieurs villes du Bénin.",
  },
];

const SelectionSection = () => {
  return (
    <section id="selection" className="py-24 md:py-32">
      <div className="container px-4 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#004d3d] mb-4 font-body">
            Processus de sélection
          </p>
          <h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#008751] text-balance"
            style={{ lineHeight: "1.15" }}
          >
            ⚡ Parcours BeninEase
          </h2>
        </div>

        <div className="relative ml-8 md:ml-16">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start gap-6">
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#008751] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold font-body">{step.number}</span>
                </div>

                <div className="pt-1 min-w-0">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1 leading-snug">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-body text-sm md:text-base mt-2">
                    {step.desc}
                  </p>
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
              Les 4 référents les mieux classés par catégorie représentent le Bénin pendant 1 an. Sur BeninEase, tous bénéficient d'un espace de visibilité, de promotion et de vente de leurs services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectionSection;
