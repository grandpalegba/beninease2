import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface LifeCase {
  id: string;
  cas_numero: number;
  label: string;
  persona: string;
  title: string;
  quote: string;
  options: string[];
  verdicts: string[];
  audioUrls: string[];
  photoUrl: string;
  audioUrl: string;
}

export function useLifeCases() {
  const [cases, setCases] = useState<LifeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        const { data, error } = await supabase
          .from('cas_de_vie')
          .select('*')
          .order('cas_numero', { ascending: true });

        if (error) throw error;

        console.log("Nombre de records chargés:", data?.length);

        const mappedData: LifeCase[] = (data || []).map((item: any) => ({
          id: item.id,
          cas_numero: item.cas_numero,
          label: item.domaine_cas_de_vie,
          persona: `${item.prenom_cas_de_vie}, ${item.age_cas_de_vie} ans, ${item.profession_cas_de_vie}`,
          title: item.titre_cas_de_vie,
          quote: item.situation_cas_de_vie,
          options: [
            item.option_1,
            item.option_2,
            item.option_3,
            item.option_4
          ].filter((opt) => opt !== null && opt !== ''),
          verdicts: [
            item.conseil_1,
            item.conseil_2,
            item.conseil_3,
            item.conseil_4
          ].map(v => v || ""),
          audioUrls: [
            item.audio_1,
            item.audio_2,
            item.audio_3,
            item.audio_4
          ].map(a => a || ""),
          photoUrl: `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/images_casdevie/m${item.cas_numero}.jpg`,
          audioUrl: `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/casdevie/cas${item.cas_numero}.mp3`
        }));

        setCases(mappedData);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  return { cases, loading, error };
}
