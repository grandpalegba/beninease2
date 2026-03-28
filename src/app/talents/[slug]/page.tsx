import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { candidates } from "@/data/candidates";
import TalentProfileClient from "./TalentProfileClient";

/**
 * Normalise une chaîne : minuscules et suppression des accents.
 */
function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const supabase = await createSupabaseServerClient();
  const { data: talent } = await supabase
    .from('profiles')
    .select('prenom, nom, avatar_url, category')
    .eq('slug', slug)
    .single();

  if (!talent) return { title: "Talent non trouvé | Beninease" };

  const fullName = `${talent.prenom} ${talent.nom}`;
  
  // Utilisation directe du bucket Supabase 'talents' avec format prenom-nom.jpg
  // Les noms sont convertis en minuscules et sans accents pour correspondre aux fichiers.
  const fileName = `${normalizeName(talent.prenom)}-${normalizeName(talent.nom)}.jpg`;
  const ogImageUrl = `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/talents/${fileName}`;
  
  return {
    title: `${fullName} | Vote Beninease`,
    description: `Vote pour ${fullName} sur Beninease`,
    openGraph: {
      title: `${fullName} | Vote`,
      description: `Soutiens ${fullName}`,
      url: `https://beninease.space/talents/${slug}`,
      siteName: 'Beninease',
      locale: 'fr_BJ',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullName,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} | Vote`,
      description: `Soutiens ${fullName}`,
      images: [ogImageUrl],
    },
  };
}

export default async function TalentProfilePage({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch from Supabase
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, slug, prenom, nom, category, city, avatar_url, votes')
    .eq('slug', slug)
    .single();

  if (!profile) {
    notFound();
  }

  // 2. Combine with local candidate data (for tabs content etc.)
  const candidate = candidates.find(c => c.slug === slug);

  if (!candidate) {
    notFound();
  }

  // Inject Supabase data into the candidate object if needed, 
  // or pass them separately. Here we pass Supabase data as props.
  
  // On construit l'URL publique pour le composant client également
  let publicAvatarUrl = profile.avatar_url;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wtjhkqkqmexddroqwawk.supabase.co';
  
  if (profile.avatar_url) {
    if (profile.avatar_url.startsWith('http') || profile.avatar_url.startsWith('/')) {
      publicAvatarUrl = profile.avatar_url;
    } else {
      const cleanPath = profile.avatar_url.startsWith('/') ? profile.avatar_url.slice(1) : profile.avatar_url;
      const bucketName = 'talents'; // Utilisation du bucket 'talents'
      const pathWithoutBucket = cleanPath.startsWith(`${bucketName}/`) 
        ? cleanPath.replace(`${bucketName}/`, '') 
        : cleanPath;

      publicAvatarUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${pathWithoutBucket}`;
    }
  } else {
    // Si pas d'avatar spécifique en base, on construit l'URL basée sur prenom-nom.jpg dans le bucket 'talents'
    // avec normalisation des accents.
    const fileName = `${normalizeName(profile.prenom)}-${normalizeName(profile.nom)}.jpg`;
    publicAvatarUrl = `${supabaseUrl}/storage/v1/object/public/talents/${fileName}`;
  }

  return (
    <TalentProfileClient 
      candidate={candidate} 
      initialVotesCount={profile.votes || 0}
      profileId={profile.id}
      avatarUrl={publicAvatarUrl}
    />
  );
}
