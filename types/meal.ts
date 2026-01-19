export type Complexity = "easy" | "medium" | "hard";

export interface Meal {
  id: string; 
  name: string;
  ingredients?: string[];
  instructions?: string;
  image?: string;
  complexity: Complexity;
  cuisine: string;
  labels?: string[];
  prep_time?: number;
  servings: number;
  spiciness?: number; 
  calories?: number;
  protein?: number;
  carbs?: number; 
  fat?: number; 
  created_at?: string; 
  updated_at?: string; 
}
