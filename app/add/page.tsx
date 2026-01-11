"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMealPage() {
  const router = useRouter();
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare the meal data
      const newMeal = {
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
      };

      // Send to API route
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeal),
      });

      if (!response.ok) {
        throw new Error("Failed to add meal");
      }

      // Redirect to home page
      router.push("/");
      router.refresh(); // Refresh to show new meal
    } catch (err) {
      setError("Failed to add meal. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to recipes
        </Link>

        <h1 className="text-4xl font-bold mb-8">Add New Meal</h1>

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
              placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;400g spaghetti&#10;200g pancetta&#10;4 eggs"
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
            <input
              type="text"
              value={formData.labels}
              onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="e.g., veggie, dinner, quick"
            />
            <p className="text-xs text-gray-500 mt-1">Separate labels with commas</p>
          </div>

          {/* Prep Time - Optional */}
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

            {/* Servings - Optional */}
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
              {isSubmitting ? "Adding..." : "Add Recipe"}
            </button>
            <Link
              href="/"
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
