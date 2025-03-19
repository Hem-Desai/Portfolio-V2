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

// Function to add or update a reaction
export async function addReaction(emoji: string) {
  const { data: existing } = await supabase
    .from("reactions")
    .select("*")
    .eq("emoji", emoji)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("reactions")
      .update({ count: existing.count + 1 })
      .eq("emoji", emoji);

    if (error) {
      console.error("Error updating reaction:", error);
    }
  } else {
    const { error } = await supabase
      .from("reactions")
      .insert([{ emoji, count: 1 }]);

    if (error) {
      console.error("Error adding reaction:", error);
    }
  }
}
