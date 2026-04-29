import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  photoIndex: number;
  imageUrl?: string;
  email?: string;
  index: number;
  products: string[];
  projects: string[];
}

export function useProfiles() {
  return useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      // We assume the table 'profiles' has these columns now
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, photo_index, image_url' as any)
        .order('first_name' as any);

      if (error) throw error;
      if (!data) return [];
      
      return (data as any[]).map(row => ({
        id: row.id,
        firstName: row.first_name || '',
        lastName: row.last_name || '',
        photoIndex: row.photo_index || 0,
        imageUrl: row.image_url,
        email: '', // Not in DB currently
        index: 0,   // Not in DB currently
        products: [],
        projects: []
      }));
    }
  });
}
