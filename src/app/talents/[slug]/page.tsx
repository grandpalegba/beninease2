import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TalentProfileShell from "@/components/talents/TalentProfileShell";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;

  const supabase = await createSupabaseServerClient();

  const { data: talent } = await supabase
    .from("talents")
    .select("prenom, nom, avatar_url")
    .eq("slug", slug)
    .maybeSingle(); // ✅ FIX

  if (!talent) {
    return { title: "Talent non trouvé | BeninEase" };
  }

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
  const slug = params.slug; // ✅ FIX (plus de await inutile)

  if (!slug) return notFound();

  const supabase = await createSupabaseServerClient();

  const { data: talent, error } = await supabase
    .from("talents")
    .select(`
      id, prenom, nom, city, avatar_url, bio, slogan, 
      video_urls, photo_urls, votes, univers, categorie, 
      instagram_url, tiktok_url, whatsapp_number
    `)
    .eq("slug", slug)
    .maybeSingle(); // ✅ FIX PRINCIPAL

  console.log("SLUG:", slug);
  console.log("TALENT:", talent);

  if (error || !talent) {
    console.error("Error fetching talent:", error);
    return notFound();
  }

  const fullName = `${talent.prenom} ${talent.nom}`;

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