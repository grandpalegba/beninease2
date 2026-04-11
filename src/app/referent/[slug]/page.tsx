import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ReferentProfileStitchClient from "@/components/referent/ReferentProfileStitchClient";

// Désactive le cache statique Next.js — chaque requête déclenche un fetch Supabase frais
export const revalidate = 0;


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const supabase = await createSupabaseServerClient();

  const { data: ambassadeur } = await supabase
    .from("ambassadeurs")
    .select("prenom, nom, avatar_url, bio, slogan")
    .eq("slug", slug)
    .maybeSingle();

  if (!ambassadeur) return { title: "Ambassadeur non trouvé | BeninEase" };

  const fullName = `${ambassadeur.prenom} ${ambassadeur.nom}`;
  let ogImageUrl = ambassadeur.avatar_url || "https://beninease.space/default-talent.jpg";

  if (ogImageUrl && !ogImageUrl.startsWith("http") && !ogImageUrl.startsWith("/")) {
    ogImageUrl = `/${ogImageUrl}`;
  }

  return {
    title: `${fullName} | BeninEase`,
    description: ambassadeur.bio || `Découvrez le profil de ${fullName} sur BeninEase`,
    openGraph: {
      title: `${fullName} | BeninEase`,
      description: ambassadeur.slogan || `Soutenez ${fullName}`,
      images: [{ url: ogImageUrl }],
    },
  };
}

export default async function ReferentProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) return notFound();

  const supabase = await createSupabaseServerClient();

  // 1. Fetch current ambassadeur data
  const { data: ambassadeur, error } = await supabase
    .from("ambassadeurs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !ambassadeur) return notFound();

  // 2. Fetch all ambassadeur slugs in deck order (weighted_votes_total desc) for swipe logic
  const { data: allAmbassadeurs } = await supabase
    .from("ambassadeurs")
    .select("slug")
    .order("weighted_votes_total", { ascending: false });

  let nextSlug = null;
  let prevSlug = null;

  if (allAmbassadeurs && allAmbassadeurs.length > 1) {
    const currentIndex = allAmbassadeurs.findIndex((t: any) => t.slug === slug);
    if (currentIndex !== -1) {
      // Logic for circular swipe or simple bounds?
      // User request: swipe horizontal. Circular is usually more premium.
      nextSlug = allAmbassadeurs[(currentIndex + 1) % allAmbassadeurs.length].slug;
      prevSlug = allAmbassadeurs[(currentIndex - 1 + allAmbassadeurs.length) % allAmbassadeurs.length].slug;
    }
  }

  return (
    <div className="bg-white min-h-screen pt-20">
      <ReferentProfileStitchClient 
        ambassadeur={ambassadeur} 
        nextSlug={nextSlug} 
        prevSlug={prevSlug} 
      />
    </div>
  );
}