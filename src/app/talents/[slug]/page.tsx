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
    .from('talents')
    .select('prenom, nom, avatar_url, categorie')
    .eq('slug', slug)
    .single();

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

export default async function TalentProfilePage({ params }: { params: { slug: string } }) {
  // Debug des params
  console.log("PARAMS:", params);
  console.log("SLUG:", params.slug);

  const slug = decodeURIComponent(params.slug);

  // Vérification du slug
  if (!slug) {
    return <div>Slug manquant</div>;
  }

  // Connexion Supabase
  const supabase = await createSupabaseServerClient();

  // Requête principale
  const { data: talent, error } = await supabase
    .from('talents')
    .select('id, slug, prenom, nom, avatar_url, votes, bio, categorie, univers, instagram_url, tiktok_url, whatsapp_number, city')
    .eq('slug', slug)
    .limit(1)
    .single();

  // Debug complet pour vérifier les données du talent
  console.log("SLUG:", slug);
  console.log("DATA:", talent);
  console.log("ERROR:", error);
  console.log("UNIVERS:", talent?.univers);
  console.log("CATEGORIE:", talent?.categorie);

  // Gestion des erreurs
  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  if (!talent) {
    return <div>Talent non trouvé pour le slug: {slug}</div>;
  }
const candidate = candidates.find(c => c.slug === slug) || null;

  // Inject Supabase data into the candidate object if needed, 
  // or pass them separately. Here we pass Supabase data as props.
  
  // On construit l'URL publique pour le composant client également
  let publicAvatarUrl = talent.avatar_url;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wtjhkqkqmexddroqwawk.supabase.co';
  
  if (talent.avatar_url) {
    if (talent.avatar_url.startsWith('http') || talent.avatar_url.startsWith('/')) {
      publicAvatarUrl = talent.avatar_url;
    } else if (talent.avatar_url.startsWith('talents/')) {
      // Cas des images locales dans public/talents/
      publicAvatarUrl = `/${talent.avatar_url}`;
    } else if (talent.avatar_url.endsWith('.jpg') || talent.avatar_url.endsWith('.png')) {
      // Cas des images locales sans prefixe
      publicAvatarUrl = `/talents/${talent.avatar_url}`;
    } else {
      // Cas des images dans Supabase Storage
      const cleanPath = talent.avatar_url.startsWith('/') ? talent.avatar_url.slice(1) : talent.avatar_url;
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
        candidate={candidate || {
          slug: talent.slug,
          prenom: talent.prenom,
          nom: talent.nom,
          portrait: talent.avatar_url,
          city: null,
          univers: talent.univers,
          categorie: talent.categorie,
          tabs: {}
        }} 
        initialVotesCount={talent.votes || 0}
        profileId={talent.id}
        avatarUrl={publicAvatarUrl}
        profileData={{
          instagram_url: talent.instagram_url,
          tiktok_url: talent.tiktok_url,
          whatsapp_number: talent.whatsapp_number,
          city: talent.city
        }} 
      />
    </div>
  );
}
