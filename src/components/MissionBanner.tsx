import Link from "next/link";

const missionLines = [
  "BeninEase connecte le monde à l'Excellence Béninoise.",
  "Les talents y sont sélectionnés et validés par les Béninois.",
  "À l'issue des votes, 256 talents représentent le Bénin.",
] as const;

type MissionBannerProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const MissionBanner = ({ ctaHref = "/postuler", ctaLabel = "POSTULER MAINTENANT" }: MissionBannerProps) => {
  return (
    <section lang="fr" className="py-16 md:py-24 bg-[#008751]">
      <div className="container max-w-4xl px-6 text-center sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 sm:gap-5 md:max-w-4xl md:gap-6">
          {missionLines.map((line) => (
            <p
              key={line}
              className="text-balance text-white font-body text-lg leading-relaxed sm:text-xl sm:leading-relaxed md:text-2xl md:leading-[2.05] lg:text-[1.65rem] lg:leading-[2.15] max-sm:leading-[1.8] max-sm:px-6"
            >
              {line}
            </p>
          ))}
        </div>
        <Link
          href={ctaHref}
          className="mt-14 sm:mt-16 inline-flex items-center justify-center rounded-full px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase font-sans shadow-xl transition-all hover:shadow-2xl active:scale-[0.98] bg-white text-[#008751] hover:bg-[#004d3d] hover:text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
};

export default MissionBanner;
