import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TalentProfileClient from "../[slug]/TalentProfileClient";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = decodeURIComponent(resolvedParams.id);

  const supabase = await createSupabaseServerClient();
  const { data: talent, error } = await supabase
    .from('talents')
    .select('prenom, nom, avatar_url, categorie')
    .eq('id', id)
    .single();

  if (error || !talent) {
    return {
      title: "Talent non trouvé - BeninEase",
      description: "Ce talent n'existe pas ou a été supprimé.",
    };
  }

  return {
    title: `${talent.prenom} ${talent.nom} - Talent Béninois | BeninEase`,
    description: `Découvrez ${talent.prenom} ${talent.nom}, talent exceptionnel dans la catégorie ${talent.categorie}. Votez pour soutenir l'excellence béninoise.`,
    openGraph: {
      title: `${talent.prenom} ${talent.nom} - BeninEase`,
      description: `Découvrez ${talent.prenom} ${talent.nom}, talent exceptionnel dans la catégorie ${talent.categorie}.`,
      images: [
        {
          url: talent.avatar_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${talent.prenom} ${talent.nom} - BeninEase`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${talent.prenom} ${talent.nom} - BeninEase`,
      description: `Découvrez ${talent.prenom} ${talent.nom}, talent exceptionnel dans la catégorie ${talent.categorie}.`,
      images: [talent.avatar_url || "/og-image.png"],
    },
    alternates: {
      canonical: `/talents/${id}`,
    },
  };
}

export default async function TalentPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const id = decodeURIComponent(resolvedParams.id);

  const supabase = await createSupabaseServerClient();
  const { data: talent, error } = await supabase
    .from('talents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !talent) {
    notFound();
  }

  return (
    <TalentProfileClient 
      candidate={{
        id: talent.id,
        slug: talent.slug || `talent-${talent.id}`,
        prenom: talent.prenom,
        nom: talent.nom,
        portrait: talent.avatar_url,
        city: talent.city,
        univers: talent.univers,
        categorie: talent.categorie,
        tabs: {}
      }}
      initialVotesCount={talent.votes || 0}
      profileId={talent.id}
      avatarUrl={talent.avatar_url}
    />
  );
}
