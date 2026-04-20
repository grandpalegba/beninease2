import { supabase } from "@/lib/supabase/client";

/**
 * Simulations de tests pour le flux Consultation.
 * Permet de vérifier l'upload storage et l'insertion en base sans passer par l'UI.
 */
export async function simulateFullConsultation() {
  console.log("🚀 Démarrage du test de simulation...");

  try {
    // 1. Récupération d'un cas (ex: Cas n°1)
    const { data: cases } = await supabase
      .from('cas_de_vie')
      .select('*')
      .eq('cas_numero', 1)
      .single();

    if (!cases) throw new Error("Cas n°1 non trouvé dans la base.");
    console.log("✅ Cas trouvé:", cases.titre_cas_de_vie);

    // 2. Création d'un faux Blob Audio
    const fakeAudioContent = new Uint8Array([0, 1, 2, 3, 4, 5]);
    const blob = new Blob([fakeAudioContent], { type: 'audio/webm' });
    console.log("✅ Faux blob audio généré.");

    // 3. Upload vers Storage
    const fileName = `test_sim_${Date.now()}.webm`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('consultation_audios')
      .upload(fileName, blob);

    if (uploadError) throw uploadError;
    console.log("✅ Upload Storage réussi:", uploadData.path);

    const { data: publicUrlData } = supabase.storage
      .from('consultation_audios')
      .getPublicUrl(fileName);

    const audioUrl = publicUrlData.publicUrl;

    // 4. Insertion Consultation
    const payload = {
      case_id: cases.id,
      choix_intuitif: cases.option_1, // Intuition
      choix_definitif: cases.option_2, // Réflexion
      phrase_sagesse: "La patience est une vertu que le Fâ nous enseigne. (Test)",
      audio_url: audioUrl,
      signe_revele: "Gbé Yɛku (Test Simulation)"
    };

    console.log("Payload Simulation envoyé à Supabase:", payload);

    const { data: consultation, error: insertError } = await supabase
      .from('consultations')
      .insert([payload])
      .select()
      .single();

    if (insertError) throw insertError;
    console.log("✅ Insertion BDD réussie. ID:", consultation.id);

    return { success: true, consultation };
  } catch (error) {
    console.error("❌ Échec de la simulation:", error);
    return { success: false, error };
  }
}
