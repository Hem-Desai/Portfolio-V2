import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Reaction {
  id: number;
  created_at: string;
  emoji: string;
  count: number;
}

// Function to get all reactions
export async function getReactions() {
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .order("count", { ascending: false });

  if (error) {
    console.error("Error fetching reactions:", error);
    return [];
  }

  return data;
}

// Add +1 to an emoji. Goes through a database function so visitors
// can only increment counts, never edit or delete rows directly.
// See supabase/kudos-policy.sql.
export async function addReaction(emoji: string) {
  const { error } = await supabase.rpc("increment_reaction", {
    p_emoji: emoji,
  });

  if (error) {
    console.error("Error adding reaction:", error);
  }
}
