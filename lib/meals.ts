import { Meal } from "@/types/meal";
import mealsData from "@/data/meals.json";

export function getAllMeals(): Meal[] {
  return mealsData as Meal[];
}

export function getMealById(id: string): Meal | undefined {
  return getAllMeals().find((meal) => meal.id === id);
}
