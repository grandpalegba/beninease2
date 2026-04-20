import { createClient } from '@/lib/supabase/client';

export async function logChoice(caseId: string, option: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .insert([
      {
        // Mapping exact avec ton schéma SQL
        cas_de_vie_id: parseInt(caseId), // Conversion au cas où l'ID soit un integer en DB
        option_choisie: option
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error logging choice:', error);
    throw error;
  }

  return data; // Contient l'ID de la ligne créée (utile pour le feedback)
}