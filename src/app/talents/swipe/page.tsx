import { createSupabaseServerClient } from "@/lib/supabase/server";
import CandidateSwiper from "@/components/CandidateSwiper";
import { notFound } from "next/navigation";
import type { Talent } from "@/types";

export default async function TalentSwipePage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const supabase = await createSupabaseServerClient();
  
  // Fetch all talents for the swiper
  const { data: talents, error } = await supabase
    .from("talents")
    .select("id, slug, prenom, nom, category, avatar_url, votes, bio")
    .order("votes", { ascending: false });

  if (error || !talents || talents.length === 0) {
    notFound();
  }

  const resolvedParams = await searchParams;
  const initialSlug = resolvedParams.slug;

  return (
    <CandidateSwiper 
      talents={talents as Talent[]} 
      initialSlug={initialSlug} 
    />
  );
}
