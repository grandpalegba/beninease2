const missionLines = [
  "Beninease connecte le monde à l'Excellence Béninoise.",
  "Les talents y sont sélectionnés et validés par les Béninois.",
  "À l'issue des votes, 256 talents représentent le Bénin.",
] as const;

type MissionBannerProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const MissionBanner = ({ ctaHref = "/postuler", ctaLabel = "Postuler maintenant" }: MissionBannerProps) => {
  return (
    <section lang="fr" className="py-16 md:py-20 bg-[#b25c39]">
      <div className="container max-w-4xl px-4 text-center sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:gap-4 md:max-w-4xl md:gap-5">
          {missionLines.map((line) => (
            <p
              key={line}
              className="text-balance text-primary-foreground font-body text-lg leading-snug sm:text-xl sm:leading-relaxed md:text-2xl md:leading-[2.05] lg:text-[1.65rem] lg:leading-[2.15]"
            >
              {line}
            </p>
          ))}
        </div>
        <a
          href={ctaHref}
          className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold font-body shadow-md transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.98] bg-[#f0e6d8] text-[#b25c39] hover:bg-[#e8dcc8]"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
};

export default MissionBanner;
