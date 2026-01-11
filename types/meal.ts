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
  prepTime?: number; // in minutes
  servings?: number;
  spiciness?: number; // 0-3, where 0 = not spicy, 3 = very spicy
}
