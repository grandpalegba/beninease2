import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface LifeCase {
  id: string;
  label: string;
  persona: string;
  title: string;
  quote: string;
  options: string[];
}

export function useLifeCases() {
  const [cases, setCases] = useState<LifeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCases() {
      try {
        const { data, error } = await supabase
          .from('cas_de_vie')
          .select('*')
          .order('cas_numero', { ascending: true });

        if (error) throw error;

        const mappedData: LifeCase[] = (data || []).map((item: any) => ({
          id: item.id,
          label: item.domaine_cas_de_vie,
          persona: `${item.prenom_cas_de_vie}, ${item.age_cas_de_vie}`,
          title: item.titre_cas_de_vie,
          quote: item.situation_cas_de_vie,
          options: [
            item.option_1,
            item.option_2,
            item.option_3,
            item.option_4
          ].filter((opt) => opt !== null && opt !== '')
        }));

        setCases(mappedData);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, [supabase]);

  return { cases, loading, error };
}
