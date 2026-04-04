"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import MysteryCard from "@/components/canari/MysteryCard";

export default function TreasurePage({ params }) {
  const [mystere, setMystere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMystere = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer le mystère
        const { data: mystereData, error: mystereError } = await supabase
          .from('mysteres')
          .select('*')
          .eq('id', params.id)
          .single();

        if (mystereError) throw mystereError;

        // Récupérer les questions pour ce mystère
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('mystere_id', params.id)
          .order('question_number', { ascending: true });

        if (questionsError) throw questionsError;

        // Transformer les questions pour le format attendu
        const formattedQuestions = questionsData.map(q => ({
          ...q,
          choices: [q.choice_a, q.choice_b, q.choice_c, q.choice_d]
        }));

        setMystere({
          ...mystereData,
          questions: formattedQuestions
        });

      } catch (error) {
        console.error('Error loading mystere:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadMystere();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-ivoire">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Erreur: {error}</div>
      </div>
    );
  }

  if (!mystere) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-ivoire">Mystère non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <MysteryCard 
        mystere={mystere} 
        onComplete={() => console.log('Mystère complété')}
      />
    </div>
  );
}
