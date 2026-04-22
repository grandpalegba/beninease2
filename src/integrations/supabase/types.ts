export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          age: number | null
          archetype: string | null
          photo_index: number
          created_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          age?: number | null
          archetype?: string | null
          photo_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          age?: number | null
          archetype?: string | null
          photo_index?: number
          created_at?: string
        }
      }
    }
    Views: {
      consultations_with_scores: {
        Row: {
          id: string
          row_index: number
          col_index: number
          sign_x_index: number
          sign_y_index: number
          dynamic_word: string
          life_case_id: string
          selected_option: number
          reflection: string
          is_anonymous: boolean
          video_offset: number
          score_resonance: number | null
          score_relevance: number | null
          score_clarity: number | null
          score_count: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
