import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          due_date: string | null;
          current_week: number | null;
          medical_conditions: string | null;
          checklists: any[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          due_date?: string | null;
          current_week?: number | null;
          medical_conditions?: string | null;
          checklists?: any[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          due_date?: string | null;
          current_week?: number | null;
          medical_conditions?: string | null;
          checklists?: any[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      symptom_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          symptoms: string[];
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          symptoms: string[];
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          symptoms?: string[];
          notes?: string | null;
          created_at?: string;
        };
      };
      checklist_state: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};
