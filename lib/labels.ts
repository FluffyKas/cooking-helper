import { getAllMeals } from "./meals";

/**
 * Format a label: capitalize first letter, lowercase rest, trim spaces
 */
export function formatLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * Get all unique labels from existing meals, formatted consistently
 */
export async function getAllUniqueLabels(): Promise<string[]> {
  const meals = await getAllMeals();
  const labelSet = new Set<string>();

  meals.forEach((meal) => {
    meal.labels?.forEach((label) => {
      const formatted = formatLabel(label);
      if (formatted) {
        labelSet.add(formatted);
      }
    });
  });

  return Array.from(labelSet).sort();
}
