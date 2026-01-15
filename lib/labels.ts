import { supabase } from "./supabase";

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
 * Only fetches the labels column instead of all meal data
 */
export async function getAllUniqueLabels(): Promise<string[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('labels');

  if (error) {
    console.error('Error fetching labels:', error);
    return [];
  }

  const labelSet = new Set<string>();

  data?.forEach((row) => {
    row.labels?.forEach((label: string) => {
      const formatted = formatLabel(label);
      if (formatted) {
        labelSet.add(formatted);
      }
    });
  });

  return Array.from(labelSet).sort();
}
