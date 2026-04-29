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
        .select('id, first_name, last_name, photo_index, image_url, index, products, projects, email' as any)
        .order('index' as any);

      if (error) throw error;
      if (!data) return [];
      
      return (data as any[]).map(row => ({
        id: row.id,
        firstName: row.first_name || '',
        lastName: row.last_name || '',
        photoIndex: row.photo_index || 0,
        imageUrl: row.image_url,
        email: row.email,
        index: row.index || 0,
        products: row.products || [],
        projects: row.projects || []
      }));
    }
  });
}
