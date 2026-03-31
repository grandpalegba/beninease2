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
  const slug = decodeURIComponent(resolvedParams.slug);

  // Debug temporaire
  console.log("metadata slug:", slug);

  const supabase = await createSupabaseServerClient();
  const { data: talent, error } = await supabase
    .from('profiles')
    .select('prenom, nom, avatar_url, category')
    .eq('slug', slug)
    .maybeSingle();

  // Debug temporaire
  console.log("metadata data:", talent);
  console.log("metadata error:", error);

  if (error || !talent) return { title: "Talent non trouvé | Beninease" };

  const fullName = `${talent.prenom} ${talent.nom}`;
  
  // Utilisation directe de talent.avatar_url si elle existe, sinon fallback sur une image par défaut.
  let ogImageUrl = talent.avatar_url || `https://beninease.space/default-talent.jpg`;
  if (ogImageUrl && !ogImageUrl.startsWith('http') && !ogImageUrl.startsWith('/')) {
    ogImageUrl = `/${ogImageUrl}`;
  }
  
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
  const slug = decodeURIComponent(resolvedParams.slug);

  // Debug temporaire
  console.log("slug:", slug);

  // 1. Fetch from Supabase
  const supabase = await createSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*') // Get everything including new fields
    .eq('slug', slug)
    .maybeSingle();

  // Debug temporaire
  console.log("data:", profile);
  console.log("error:", error);

  if (error) {
    console.error("Error fetching profile:", error);
    return <div>Erreur: {error.message}</div>;
  }

  if (!profile) {
    return <div>Profil non trouvé pour le slug: {slug}</div>;
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
    } else if (profile.avatar_url.startsWith('talents/')) {
      // Cas des images locales dans public/talents/
      publicAvatarUrl = `/${profile.avatar_url}`;
    } else if (profile.avatar_url.endsWith('.jpg') || profile.avatar_url.endsWith('.png')) {
      // Cas des images locales sans prefixe
      publicAvatarUrl = `/talents/${profile.avatar_url}`;
    } else {
      // Cas des images dans Supabase Storage
      const cleanPath = profile.avatar_url.startsWith('/') ? profile.avatar_url.slice(1) : profile.avatar_url;
      const bucketName = 'talents'; 
      const pathWithoutBucket = cleanPath.startsWith(`${bucketName}/`) 
        ? cleanPath.replace(`${bucketName}/`, '') 
        : cleanPath;

      publicAvatarUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${pathWithoutBucket}`;
    }
  } else {
    // Fallback local ou placeholder
    publicAvatarUrl = `/talents/${slug}.jpg`;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <TalentProfileClient 
        candidate={candidate} 
        initialVotesCount={profile.votes || 0}
        profileId={profile.id}
        avatarUrl={publicAvatarUrl}
        profileData={profile} // Pass all data
      />
    </div>
  );
}
