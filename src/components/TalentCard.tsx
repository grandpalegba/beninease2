import type { Talent } from "@/data/talents";

interface TalentCardProps {
  talent: Talent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
      <div className="aspect-square overflow-hidden">
        <img
          src={talent.image}
          alt={talent.name}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-primary/15 px-3 py-1 font-sans text-xs font-medium text-primary">
          {talent.category}
        </span>
        <h3 className="font-display text-lg font-semibold text-primary">
          {talent.name}
        </h3>
        <p className="mt-1 font-sans text-sm text-muted-foreground line-clamp-3">
          {talent.bio}
        </p>
        <p className="mt-2 font-sans text-xs italic text-primary/70">
          « {talent.quote} »
        </p>
      </div>
    </div>
  );
};

export default TalentCard;
