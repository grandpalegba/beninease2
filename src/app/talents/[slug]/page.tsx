import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TalentProfileShell from "@/components/talents/TalentProfileShell";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  const supabase = await createSupabaseServerClient();
  const { data: talent } = await supabase
    .from("talents")
    .select("prenom, nom, avatar_url")
    .eq("slug", slug)
    .single();

  if (!talent) return { title: "Talent non trouvé | BeninEase" };

  const fullName = `${talent.prenom} ${talent.nom}`;
  let ogImageUrl = talent.avatar_url || "https://beninease.space/default-talent.jpg";
  
  if (ogImageUrl && !ogImageUrl.startsWith("http") && !ogImageUrl.startsWith("/")) {
    ogImageUrl = `/${ogImageUrl}`;
  }
  
  return {
    title: `${fullName} | BeninEase`,
    description: `Découvrez le profil de ${fullName} sur BeninEase`,
    openGraph: {
      title: `${fullName} | BeninEase`,
      description: `Soutenez ${fullName}`,
      images: [{ url: ogImageUrl }],
    },
  };
}

export default async function TalentProfilePage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  if (!slug) return notFound();

  const supabase = await createSupabaseServerClient();

  const { data: talent, error } = await supabase
    .from("talents")
    .select("id, prenom, nom, city, avatar_url, bio, slogan, video_urls, photo_urls, votes, univers, categorie, instagram_url, tiktok_url, whatsapp_number")
    .eq("slug", slug)
    .single();

  if (error || !talent) {
    console.error("Error fetching talent:", error);
    return notFound();
  }

  // Marqueur de diagnostic — V3 White Minimalist Design
  console.log("V3 DESIGN ACTIVE — slug:", slug, "| talent:", talent.prenom, talent.nom);

  const fullName = `${talent.prenom} ${talent.nom}`;

  // Avatar URL resolving (simplified for now, matching the shell's expectation)
  let publicAvatarUrl = talent.avatar_url;
  if (publicAvatarUrl && !publicAvatarUrl.startsWith("http") && !publicAvatarUrl.startsWith("/")) {
    publicAvatarUrl = `/${publicAvatarUrl}`;
  }

  return (
    <TalentProfileShell
      id={talent.id}
      full_name={fullName}
      city={talent.city || "Bénin"}
      avatar_url={publicAvatarUrl || ""}
      bio_longue={talent.bio || ""}
      slogan={talent.slogan || undefined}
      video_urls={talent.video_urls || []}
      photo_urls={talent.photo_urls || []}
      votes={talent.votes || 0}
      univers={talent.univers}
      categorie={talent.categorie}
      social_links={{
        instagram: talent.instagram_url,
        tiktok: talent.tiktok_url,
        whatsapp: talent.whatsapp_number,
      }}
    />
  );
}
