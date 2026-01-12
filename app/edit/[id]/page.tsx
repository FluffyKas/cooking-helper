"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Meal } from "@/types/meal";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditMealPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
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

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [customLabel, setCustomLabel] = useState("");
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
    if (!id) return;
    async function loadMeal() {
      try {
        const response = await fetch(`/api/meals/${id}`);
        if (!response.ok) {
          throw new Error("Meal not found");
        }
        const data = await response.json();
        setMeal(data);

        // Populate form with existing data
        setFormData({
          name: data.name || "",
          ingredients: data.ingredients?.join("\n") || "",
          instructions: data.instructions || "",
          image: data.image || "",
          complexity: data.complexity || "easy",
          cuisine: data.cuisine || "",
          labels: "", // Labels are handled separately
          prepTime: data.prep_time?.toString() || "",
          servings: data.servings?.toString() || "",
          spiciness: data.spiciness?.toString() || "0",
        });

        setSelectedLabels(data.labels || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading meal:", err);
        setError("Failed to load meal");
        setIsLoading(false);
      }
    }

    loadMeal();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const addCustomLabel = () => {
    const trimmed = customLabel.trim();
    if (trimmed && !selectedLabels.includes(trimmed)) {
      // Format the label: capitalize first letter, lowercase rest
      const formatted =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      setSelectedLabels((prev) => [...prev, formatted]);
      setCustomLabel("");

      // Add to available labels if not already there
      if (!availableLabels.includes(formatted)) {
        setAvailableLabels((prev) => [...prev, formatted].sort());
      }
    }
  };

  const removeLabel = (label: string) => {
    setSelectedLabels((prev) => prev.filter((l) => l !== label));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const ingredientsArray = formData.ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

      const updatedMeal = {
        name: formData.name,
        ingredients: ingredientsArray,
        instructions: formData.instructions,
        image: formData.image,
        complexity: formData.complexity,
        cuisine: formData.cuisine,
        labels: selectedLabels,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        spiciness: formData.spiciness ? parseInt(formData.spiciness) : 0,
      };

      const response = await fetch(`/api/meals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMeal),
      });

      if (!response.ok) {
        throw new Error("Failed to update meal");
      }

      router.push(`/meal/${id}`);
    } catch (err) {
      setError("Failed to update meal. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <p>Loading...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error && !meal) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-red-500">{error}</p>
            <Link href="/" className="text-blue-400 hover:underline">
              ← Back to recipes
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href={`/meal/${id}`}
            className="inline-block mb-6 text-blue-400 hover:underline"
          >
            ← Back to recipe
          </Link>

          <h1 className="text-4xl font-bold mb-8">Edit Meal</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
              />
            </div>

            {/* Complexity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Complexity *
              </label>
              <select
                name="complexity"
                required
                value={formData.complexity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Cuisine *
              </label>
              <input
                type="text"
                name="cuisine"
                required
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="e.g., Italian, Chinese, Mexican"
              />
            </div>

            {/* Prep Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="30"
              />
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Servings
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="4"
              />
            </div>

            {/* Spiciness */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Spiciness Level
              </label>
              <select
                name="spiciness"
                value={formData.spiciness}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
              >
                <option value="0">Not Spicy</option>
                <option value="1">Mild 🌶️</option>
                <option value="2">Medium 🌶️🌶️</option>
                <option value="3">Hot 🌶️🌶️🌶️</option>
              </select>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ingredients (one per line)
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="Step-by-step instructions..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium mb-2">Labels</label>

              {/* Available labels as toggle buttons */}
              {availableLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableLabels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleLabel(label)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedLabels.includes(label)
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected labels */}
              {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Custom label input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomLabel();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-md text-white"
                  placeholder="Add custom label..."
                />
                <button
                  type="button"
                  onClick={addCustomLabel}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {/* Submit button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <Link
                href={`/meal/${id}`}
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                CANCEL
              </Link>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
