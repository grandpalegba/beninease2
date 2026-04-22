import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileDetailClient from "@/components/profil/ProfileDetailClient";

/**
 * ProfilePage - Server Component
 * Fetches a single profile from Supabase by ID.
 */
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return notFound();

  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !profile) return notFound();

  // Mapping snake_case from DB to camelCase for the UI component
  const mappedProfile = {
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    photoIndex: profile.photo_index || 0,
    imageUrl: profile.image_url,
    email: profile.email,
    products: (profile as any).products || [],
    projects: (profile as any).projects || [],
    age: profile.age,
    archetype: profile.archetype,
    createdAt: profile.created_at
  };

  return <ProfileDetailClient profile={mappedProfile} />;
}
