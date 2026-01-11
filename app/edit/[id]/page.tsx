"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Meal } from "@/types/meal";

export default function EditMealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    image: "",
    complexity: "easy" as "easy" | "medium" | "hard",
    cuisine: "",
    labels: "",
    prepTime: "",
    servings: "",
    spiciness: "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load available labels
  useEffect(() => {
    async function loadLabels() {
      try {
        const response = await fetch("/api/labels");
        const data = await response.json();
        setAvailableLabels(data.labels || []);
      } catch (err) {
        console.error("Failed to load labels:", err);
        setAvailableLabels([]);
      }
    }
    loadLabels();
  }, []);

  // Load meal data
  useEffect(() => {
    async function loadMeal() {
      try {
        const response = await fetch(`/api/meals/${params.id}`);
        if (!response.ok) {
          throw new Error("Meal not found");
        }
        const mealData: Meal = await response.json();
        setMeal(mealData);

        // Populate form
        setFormData({
          name: mealData.name,
          ingredients: mealData.ingredients?.join("\n") || "",
          instructions: mealData.instructions || "",
          image: mealData.image || "",
          complexity: mealData.complexity,
          cuisine: mealData.cuisine,
          labels: mealData.labels?.join(", ") || "",
          prepTime: mealData.prepTime?.toString() || "",
          servings: mealData.servings?.toString() || "",
          spiciness: mealData.spiciness?.toString() || "0",
        });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load meal");
        setIsLoading(false);
      }
    }

    loadMeal();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare the meal data
      const updatedMeal = {
        name: formData.name,
        ingredients: formData.ingredients
          ? formData.ingredients.split("\n").filter((line) => line.trim())
          : undefined,
        instructions: formData.instructions || undefined,
        image: formData.image || undefined,
        complexity: formData.complexity,
        cuisine: formData.cuisine,
        labels: formData.labels
          ? formData.labels.split(",").map((label) => label.trim()).filter(Boolean)
          : undefined,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        spiciness: formData.spiciness !== "0" ? parseInt(formData.spiciness) : undefined,
      };

      // Send to API route
      const response = await fetch(`/api/meals/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMeal),
      });

      if (!response.ok) {
        throw new Error("Failed to update meal");
      }

      // Redirect to meal detail page
      router.push(`/meal/${params.id}`);
      router.refresh();
    } catch (err) {
      setError("Failed to update meal. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!meal) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-red-500">Meal not found</p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to recipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href={`/meal/${params.id}`}
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to recipe
        </Link>

        <h1 className="text-4xl font-bold mb-8">Edit Meal</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name - Required */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipe Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>

          {/* Complexity - Required */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Complexity <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.complexity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  complexity: e.target.value as "easy" | "medium" | "hard",
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Cuisine - Required */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cuisine <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="e.g., Italian, Chinese, Mexican"
            />
          </div>

          {/* Spiciness - Optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Spiciness Level <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <select
              value={formData.spiciness}
              onChange={(e) => setFormData({ ...formData, spiciness: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="0">Not spicy at all</option>
              <option value="1">🌶️ Mild</option>
              <option value="2">🌶️🌶️ Medium</option>
              <option value="3">🌶️🌶️🌶️ Hot</option>
            </select>
          </div>

          {/* Ingredients - Optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ingredients <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              rows={6}
              placeholder="Enter each ingredient on a new line"
            />
            <p className="text-xs text-gray-500 mt-1">One ingredient per line</p>
          </div>

          {/* Instructions - Optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              rows={8}
              placeholder="Enter cooking instructions..."
            />
          </div>

          {/* Image URL - Optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Labels - Optional */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Labels <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            
            {/* Dynamic labels as toggle buttons */}
            {availableLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {availableLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const currentLabels = formData.labels ? formData.labels.split(",").map(l => l.trim()).filter(Boolean) : [];
                      // Case-insensitive comparison
                      const labelIndex = currentLabels.findIndex(l => l.toLowerCase() === label.toLowerCase());
                      
                      if (labelIndex !== -1) {
                        // Remove label
                        const newLabels = currentLabels.filter((_, i) => i !== labelIndex);
                        setFormData({ ...formData, labels: newLabels.join(", ") });
                      } else {
                        // Add label
                        setFormData({ ...formData, labels: currentLabels.concat(label).join(", ") });
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.labels.split(",").map(l => l.trim()).some(l => l.toLowerCase() === label.toLowerCase())
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Custom label input */}
            <div>
              <input
                type="text"
                placeholder="Add custom label (press Enter to add)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const rawLabel = input.value.trim();
                    if (rawLabel) {
                      // Format: capitalize first letter, lowercase rest
                      const formatted = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1).toLowerCase();
                      const currentLabels = formData.labels ? formData.labels.split(",").map(l => l.trim()).filter(Boolean) : [];
                      // Check if label already exists (case-insensitive)
                      if (!currentLabels.some(l => l.toLowerCase() === formatted.toLowerCase())) {
                        setFormData({ ...formData, labels: currentLabels.concat(formatted).join(", ") });
                      }
                      input.value = "";
                    }
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Type a custom label and press Enter to add it</p>
            </div>

            {/* Show selected labels */}
            {formData.labels && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Selected labels:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.labels.split(",").map(l => l.trim()).filter(Boolean).map((label) => (
                    <span
                      key={label}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs flex items-center gap-1"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => {
                          const currentLabels = formData.labels.split(",").map(l => l.trim()).filter(Boolean);
                          const newLabels = currentLabels.filter(l => l !== label);
                          setFormData({ ...formData, labels: newLabels.join(", ") });
                        }}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prep Time & Servings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prep Time (minutes) <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Servings <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="e.g., 4"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/meal/${params.id}`}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}