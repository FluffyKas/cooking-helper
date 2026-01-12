export type Complexity = "easy" | "medium" | "hard";

export interface Meal {
  id: string; // UUID from Supabase
  name: string;
  ingredients?: string[];
  instructions?: string;
  image?: string;
  complexity: Complexity;
  cuisine: string;
  labels?: string[];
  prep_time?: number; // Changed from prepTime to match DB
  servings?: number;
  spiciness?: number; // 0-3, where 0 = not spicy, 3 = very spicy
  created_at?: string; // Timestamp from Supabase
  updated_at?: string; // Timestamp from Supabase
}
