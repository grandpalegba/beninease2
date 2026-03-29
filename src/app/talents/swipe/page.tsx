import { createSupabaseServerClient } from "@/lib/supabase/server";
import CandidateSwiper from "@/components/CandidateSwiper";
import { notFound } from "next/navigation";
import type { Talent } from "@/types";

export default async function TalentSwipePage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  
  // Fetch all talents from profiles table
  const resolvedParams = await searchParams;
  const initialSlug = resolvedParams.slug;

  const { data: talents, error } = await supabase
    .from("profiles")
    .select("id, slug, prenom, nom, category, univers, categorie, avatar_url, votes, bio, role")
    .or('role.eq.candidat,role.eq.ambassadeur,role.eq.candidate,role.eq.talent,role.eq.partenaire,role.eq.jury')
    .order("votes", { ascending: false });

  if (error || !talents || talents.length === 0) {
    notFound();
  }

  return (
    <CandidateSwiper 
      talents={talents as Talent[]} 
      initialSlug={initialSlug} 
    />
  );
}
