"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Meal } from "@/types/meal";

interface MealFormProps {
  mode: "add" | "edit";
  mealId?: string;
  onCancel?: () => void;
}

export default function MealForm({ mode, mealId, onCancel }: MealFormProps) {
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imagePreviewLoaded, setImagePreviewLoaded] = useState(false);

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

  // Load meal data for edit mode
  useEffect(() => {
    if (mode !== "edit" || !mealId) return;

    async function loadMeal() {
      try {
        const response = await fetch(`/api/meals/${mealId}`);
        if (!response.ok) {
          throw new Error("Meal not found");
        }
        const data = await response.json();

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
  }, [mode, mealId]);

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
      prev.some((l) => l.toLowerCase() === label.toLowerCase())
        ? prev.filter((l) => l.toLowerCase() !== label.toLowerCase())
        : [...prev, label]
    );
  };

  const addCustomLabel = () => {
    const trimmed = customLabel.trim();
    if (trimmed && !selectedLabels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      // Format the label: capitalize first letter, lowercase rest
      const formatted =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      setSelectedLabels((prev) => [...prev, formatted]);
      setCustomLabel("");

      // Add to available labels if not already there
      if (!availableLabels.some((l) => l.toLowerCase() === formatted.toLowerCase())) {
        setAvailableLabels((prev) => [...prev, formatted].sort());
      }
    }
  };

  const removeLabel = (label: string) => {
    setSelectedLabels((prev) => prev.filter((l) => l !== label));
  };

  // Valid image extensions
  const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];

  // Check if URL has a valid image extension
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return true; // Empty is OK (optional field)
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      // Check extension or allow URLs without extension (could be dynamic images)
      const hasValidExtension = validImageExtensions.some((ext) => pathname.endsWith(ext));
      // Also allow URLs that might serve images without extensions (like from image hosting services)
      const isLikelyImageService = /unsplash|imgur|cloudinary|pexels|pixabay/i.test(url);
      return hasValidExtension || isLikelyImageService || !pathname.includes(".");
    } catch {
      return false; // Invalid URL format
    }
  };

  // Handle image URL change with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setImageError("");
    setImagePreviewLoaded(false);

    if (url && !isValidImageUrl(url)) {
      setImageError("Please enter a valid image URL (jpg, png, gif, webp, etc.)");
    }
  };

  // Handle image preview load success
  const handleImageLoad = () => {
    setImagePreviewLoaded(true);
    setImageError("");
  };

  // Handle image preview load error
  const handleImageError = () => {
    if (formData.image) {
      setImageError("Failed to load image. Please check the URL is correct and accessible.");
      setImagePreviewLoaded(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check for image errors before submitting
    if (imageError) {
      setError("Please fix the image URL error before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const ingredientsArray = formData.ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

      const mealData = {
        name: formData.name,
        ingredients: ingredientsArray.length > 0 ? ingredientsArray : undefined,
        instructions: formData.instructions || undefined,
        image: formData.image || undefined,
        complexity: formData.complexity,
        cuisine: formData.cuisine,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        spiciness: formData.spiciness !== "0" ? parseInt(formData.spiciness) : undefined,
      };

      const url = mode === "add" ? "/api/meals" : `/api/meals/${mealId}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} meal`);
      }

      const result = await response.json();
      const redirectId = mode === "add" ? result.meal.id : mealId;

      // Redirect to meal detail page
      router.push(`/meal/${redirectId}`);
      router.refresh();
    } catch (err) {
      setError(`Failed to ${mode} meal. Please try again.`);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (mode === "edit" && mealId) {
      router.push(`/meal/${mealId}`);
    } else {
      router.push("/");
    }
  };

  // Loading state for edit mode
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  // Error state for edit mode
  if (error && mode === "edit" && !formData.name) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-coral-300">{error}</p>
        <Link href="/" className="text-mint-500 hover:underline">
          ← Back to recipes
        </Link>
      </div>
    );
  }

  const backLink = mode === "edit" && mealId ? `/meal/${mealId}` : "/";
  const backText = mode === "edit" ? "← Back to recipe" : "← Back to recipes";
  const title = mode === "edit" ? "Edit Meal" : "Add New Meal";
  const submitText = isSubmitting
    ? mode === "edit"
      ? "SAVING..."
      : "ADDING..."
    : mode === "edit"
    ? "SAVE CHANGES"
    : "ADD RECIPE";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href={backLink}
        className="inline-block mb-6 text-mint-500 hover:underline"
      >
        {backText}
      </Link>

      <h1 className="text-4xl font-bold mb-8">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name - Required */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipe Name <span className="text-coral-300">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
            placeholder="e.g., Spaghetti Carbonara"
          />
        </div>

        {/* Complexity - Required */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Complexity <span className="text-coral-300">*</span>
          </label>
          <select
            name="complexity"
            required
            value={formData.complexity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Cuisine - Required */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cuisine <span className="text-coral-300">*</span>
          </label>
          <input
            type="text"
            name="cuisine"
            required
            value={formData.cuisine}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
            placeholder="e.g., Italian, Chinese, Mexican"
          />
        </div>

        {/* Spiciness - Optional */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Spiciness Level <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            name="spiciness"
            value={formData.spiciness}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
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
            Ingredients <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
            rows={6}
            placeholder="Enter each ingredient on a new line&#10;e.g.,&#10;400g spaghetti&#10;200g pancetta&#10;4 eggs"
          />
          <p className="text-xs text-gray-500 mt-1">One ingredient per line</p>
        </div>

        {/* Instructions - Optional */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Instructions <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
            rows={8}
            placeholder="Enter cooking instructions..."
          />
        </div>

        {/* Image URL - Optional */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Image URL <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleImageChange}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-800 ${
              imageError
                ? "border-coral-300 focus:ring-coral-200"
                : "border-gray-200 focus:ring-mint-300"
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {/* Image validation error */}
          {imageError && (
            <p className="mt-2 text-sm text-coral-300">{imageError}</p>
          )}
          {/* Image preview */}
          {formData.image && !imageError && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image}
                  alt="Preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`w-full h-full object-cover ${
                    imagePreviewLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!imagePreviewLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Loading preview...
                  </div>
                )}
              </div>
              {imagePreviewLoaded && (
                <p className="mt-2 text-sm text-mint-500">✓ Image loaded successfully</p>
              )}
            </div>
          )}
        </div>

        {/* Labels - Optional */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Labels <span className="text-gray-400 text-xs">(optional)</span>
          </label>

          {/* Available labels as toggle buttons */}
          {availableLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {availableLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedLabels.some((l) => l.toLowerCase() === label.toLowerCase())
                      ? "bg-mint-300 text-nav-dark"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Selected labels display */}
          {selectedLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-mint-300 text-nav-dark rounded-full text-sm"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="hover:text-red-600"
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
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
              placeholder="Add custom label and press Enter..."
            />
            <button
              type="button"
              onClick={addCustomLabel}
              className="px-4 py-2 bg-mint-200 text-nav-dark font-semibold rounded-xl hover:bg-mint-300 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Prep Time and Servings - Optional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Prep Time (minutes) <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="number"
              name="prepTime"
              min="1"
              value={formData.prepTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Servings <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="number"
              name="servings"
              min="1"
              value={formData.servings}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
              placeholder="e.g., 4"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-coral-100 border border-coral-200 rounded-xl text-coral-300">
            {error}
          </div>
        )}

        {/* Submit and Cancel buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitText}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
