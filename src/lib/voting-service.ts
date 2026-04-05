import { supabase } from "@/utils/supabase/client";

export type PlayerGrade = 
  | "Nouveau" 
  | "Votant" 
  | "Électeur" 
  | "Électeur actif" 
  | "Citoyen" 
  | "Citoyen engagé" 
  | "Citoyen conscient" 
  | "Référent 👑";

export const GRADE_WEIGHTS: Record<PlayerGrade, number> = {
  "Nouveau": 1,
  "Votant": 2,
  "Électeur": 3,
  "Électeur actif": 5,
  "Citoyen": 8,
  "Citoyen engagé": 13,
  "Citoyen conscient": 21,
  "Référent 👑": 50,
};

export class VotingService {
  /**
   * Get the player's grade based on their vote history.
   * This calls the RPC function defined in the database.
   */
  static async getPlayerGrade(userId: string): Promise<PlayerGrade> {
    try {
      const { data, error } = await supabase.rpc("get_user_grade", { 
        user_uuid: userId 
      });

      if (error) throw error;
      return (data as PlayerGrade) || "Nouveau";
    } catch (error) {
      console.error("Error fetching player grade:", error);
      return "Nouveau";
    }
  }

  /**
   * Cast a weighted vote for a talent.
   */
  static async castVote(voterId: string, talentId: string, universe: string, category: string) {
    try {
      // 1. Get player's power
      const grade = await this.getPlayerGrade(voterId);
      const weight = GRADE_WEIGHTS[grade] || 1;

      // 2. Record the vote in votes_records
      const { error: recordError } = await supabase
        .from("votes_records")
        .insert({
          voter_id: voterId,
          candidate_id: talentId,
          universe,
          category,
          weight // Assuming the schema supports a weight column, if not we'll need to handle it in a trigger
        });

      if (recordError) throw recordError;

      // 3. Increment the talent's vote count in profiles by the weight
      // Note: We use a custom RPC or manual update if the trigger doesn't handle weights
      const { error: updateError } = await supabase.rpc("increment_talent_votes", {
        talent_id: talentId,
        vote_weight: weight
      });

      if (updateError) {
        // Fallback if RPC doesn't exist: manual update (less safe but works for now)
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("votes")
          .eq("id", talentId)
          .single();
        
        await supabase
          .from("profiles")
          .update({ votes: (currentProfile?.votes || 0) + weight })
          .eq("id", talentId);
      }

      return { success: true, weight };
    } catch (error) {
      console.error("Error casting vote:", error);
      return { success: false, error };
    }
  }
}
