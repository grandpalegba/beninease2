import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TalentProfileStitchClient from "@/components/talents/TalentProfileStitchClient";

// Désactive le cache statique Next.js — chaque requête déclenche un fetch Supabase frais
export const revalidate = 0;


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const supabase = await createSupabaseServerClient();

  const { data: talent } = await supabase
    .from("talents")
    .select("prenom, nom, avatar_url, bio, slogan")
    .eq("slug", slug)
    .maybeSingle();

  if (!talent) return { title: "Talent non trouvé | BeninEase" };

  const fullName = `${talent.prenom} ${talent.nom}`;
  let ogImageUrl = talent.avatar_url || "https://beninease.space/default-talent.jpg";

  if (ogImageUrl && !ogImageUrl.startsWith("http") && !ogImageUrl.startsWith("/")) {
    ogImageUrl = `/${ogImageUrl}`;
  }

  return {
    title: `${fullName} | BeninEase`,
    description: talent.bio || `Découvrez le profil de ${fullName} sur BeninEase`,
    openGraph: {
      title: `${fullName} | BeninEase`,
      description: talent.slogan || `Soutenez ${fullName}`,
      images: [{ url: ogImageUrl }],
    },
  };
}

export default async function TalentProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) return notFound();

  const supabase = await createSupabaseServerClient();

  // 1. Fetch current talent data
  const { data: talent, error } = await supabase
    .from("talents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !talent) return notFound();

  // 2. Fetch all talent slugs in deck order (weighted_votes_total desc) for swipe logic
  const { data: allTalents } = await supabase
    .from("talents")
    .select("slug")
    .order("weighted_votes_total", { ascending: false });

  let nextSlug = null;
  let prevSlug = null;

  if (allTalents && allTalents.length > 1) {
    const currentIndex = allTalents.findIndex((t: any) => t.slug === slug);
    if (currentIndex !== -1) {
      // Logic for circular swipe or simple bounds?
      // User request: swipe horizontal. Circular is usually more premium.
      nextSlug = allTalents[(currentIndex + 1) % allTalents.length].slug;
      prevSlug = allTalents[(currentIndex - 1 + allTalents.length) % allTalents.length].slug;
    }
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      <TalentProfileStitchClient 
        talent={talent} 
        nextSlug={nextSlug} 
        prevSlug={prevSlug} 
      />
    </div>
  );
}