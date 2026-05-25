export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          tier: 'free' | 'pro';
          leaderboard_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          tier?: 'free' | 'pro';
          leaderboard_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          tier?: 'free' | 'pro';
          leaderboard_opt_in?: boolean;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          total_xp: number;
          lessons_completed: number;
          flashcards_mastered: number;
          quiz_correct: number;
          quiz_total: number;
          streak_days: number;
          exam_readiness_pct: number;
          last_active_at: string | null;
        };
        Insert: {
          user_id: string;
          total_xp?: number;
          lessons_completed?: number;
          flashcards_mastered?: number;
          quiz_correct?: number;
          quiz_total?: number;
          streak_days?: number;
          exam_readiness_pct?: number;
          last_active_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_stats']['Insert']>;
      };
      lesson_progress: {
        Row: { user_id: string; lesson_id: string; completed_at: string };
        Insert: { user_id: string; lesson_id: string; completed_at?: string };
        Update: { completed_at?: string };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          scenario: string;
          correct: boolean;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          scenario: string;
          correct: boolean;
          attempted_at?: string;
        };
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>;
      };
      flashcard_mastery: {
        Row: { user_id: string; card_id: string; mastered_at: string };
        Insert: { user_id: string; card_id: string; mastered_at?: string };
        Update: { mastered_at?: string };
      };
      lesson_comments: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          parent_comment_id: string | null;
          body: string;
          created_at: string;
          edited_at: string | null;
          deleted_at: string | null;
          flagged_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          parent_comment_id?: string | null;
          body: string;
          created_at?: string;
          edited_at?: string | null;
          deleted_at?: string | null;
          flagged_count?: number;
        };
        Update: { body?: string; edited_at?: string | null; deleted_at?: string | null };
      };
      comment_flags: {
        Row: { comment_id: string; flagger_id: string; reason: string | null; flagged_at: string };
        Insert: { comment_id: string; flagger_id: string; reason?: string | null; flagged_at?: string };
        Update: { reason?: string | null };
      };
    };
    Views: {
      leaderboard: {
        Row: {
          display_name: string;
          total_xp: number;
          lessons_completed: number;
          exam_readiness_pct: number;
          last_active_at: string | null;
        };
      };
    };
    Functions: Record<string, never>;
  };
}
