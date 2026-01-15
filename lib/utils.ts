/**
 * Generate chili icons based on spiciness level
 * @param level - Spiciness level (0-3)
 * @returns Chili emoji string or null if not spicy
 */
export function getSpicyIcons(level?: number): string | null {
  if (!level || level === 0) return null;
  return "\u{1F336}\u{FE0F}".repeat(level);
}
