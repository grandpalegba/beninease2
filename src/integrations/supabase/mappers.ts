import type { Database } from "@/integrations/supabase/types";
import { SIGNS } from "@/data/fongbe";
import { LIFE_CASES } from "@/data/cases";
import type { Consultation } from "@/data/consultations";

type ConsultationRow = Database["public"]["Views"]["consultations_with_scores"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapConsultationRow(
  row: ConsultationRow,
  profile: Pick<ProfileRow, "first_name" | "age" | "archetype" | "photo_index">,
): Consultation {
  const signX = SIGNS[row.sign_x_index];
  const signY = SIGNS[row.sign_y_index];
  const lifeCase = LIFE_CASES.find((c) => c.id === row.life_case_id);

  if (!signX || !signY) {
    throw new Error(`Unknown sign index in consultation ${row.id}`);
  }
  if (!lifeCase) {
    throw new Error(`Unknown life_case_id ${row.life_case_id} in consultation ${row.id}`);
  }

  return {
    id: `${row.row_index}-${row.col_index}`,
    rowIndex: row.row_index,
    colIndex: row.col_index,
    signX,
    signY,
    dynamicWord: row.dynamic_word,
    lifeCase: {
      image: lifeCase.photoUrl || "",
      label: lifeCase.label,
      title: lifeCase.title,
      quote: lifeCase.quote,
      persona: lifeCase.persona,
    },
    reflection: row.reflection,
    author: row.is_anonymous ? "Anonyme" : (profile.first_name || "Anonyme"),
    isAnonymous: row.is_anonymous,
    videoSeed: profile.photo_index,
    scores: {
      count: row.score_count || 0,
    },
  };
}
