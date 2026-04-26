import { supabase } from "@/lib/supabase";

/** Returns the shared Supabase client. */
export function useSupabase() {
  return supabase;
}
