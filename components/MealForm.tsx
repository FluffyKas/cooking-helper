"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Meal } from "@/types/meal";
import { supabase } from "@/lib/supabase";
import Spinner from "./Spinner";
import ImageUrlField from "./ImageUrlField";
import LabelsSelector from "./LabelsSelector";

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
    prepTime: "",
    servings: "",
    spiciness: "0",
  });

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [error, setError] = useState("");

  // Track original values for edit mode to detect changes
  const [originalIngredients, setOriginalIngredients] = useState("");
  const [originalServings, setOriginalServings] = useState("");
  const [originalMacros, setOriginalMacros] = useState<{
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }>({});

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

  useEffect(() => {
    if (mode !== "edit" || !mealId) return;

    async function loadMeal() {
      try {
        const response = await fetch(`/api/meals/${mealId}`);
        if (!response.ok) {
          throw new Error("Meal not found");
        }
        const data = await response.json();

        setFormData({
          name: data.name || "",
          ingredients: data.ingredients?.join("\n") || "",
          instructions: data.instructions || "",
          image: data.image || "",
          complexity: data.complexity || "easy",
          cuisine: data.cuisine || "",
          prepTime: data.prep_time?.toString() || "",
          servings: data.servings?.toString() || "",
          spiciness: data.spiciness?.toString() || "0",
        });

        setSelectedLabels(data.labels || []);
        // Store original values to detect changes
        setOriginalIngredients(data.ingredients?.join("\n") || "");
        setOriginalServings(data.servings?.toString() || "");
        setOriginalMacros({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleNewLabel = (label: string) => {
    setAvailableLabels((prev) => [...prev, label].sort());
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

      const ingredientsChanged = formData.ingredients !== originalIngredients;
      const servingsChanged = formData.servings !== originalServings;
      const shouldCalculateMacros =
        ingredientsArray.length > 0 &&
        (mode === "add" || ingredientsChanged || servingsChanged);

      let calories: number | undefined;
      let protein: number | undefined;
      let carbs: number | undefined;
      let fat: number | undefined;

      if (shouldCalculateMacros) {
        const nutritionResponse = await fetch("/api/nutrition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: ingredientsArray }),
        });

        if (nutritionResponse.ok) {
          const totalNutrition = await nutritionResponse.json();
          const servings = parseInt(formData.servings);
          calories = Math.round(totalNutrition.calories / servings);
          protein = Math.round(totalNutrition.protein / servings);
          carbs = Math.round(totalNutrition.carbs / servings);
          fat = Math.round(totalNutrition.fat / servings);
        }
      } else if (mode === "edit") {
        // Keep existing macros if no recalculation needed
        calories = originalMacros.calories;
        protein = originalMacros.protein;
        carbs = originalMacros.carbs;
        fat = originalMacros.fat;
      }

      const mealData = {
        name: formData.name,
        ingredients: ingredientsArray.length > 0 ? ingredientsArray : undefined,
        instructions: formData.instructions || undefined,
        image: formData.image || undefined,
        complexity: formData.complexity,
        cuisine: formData.cuisine,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
        servings: parseInt(formData.servings),
        spiciness: formData.spiciness !== "0" ? parseInt(formData.spiciness) : undefined,
        calories,
        protein,
        carbs,
        fat,
      };

      const url = mode === "add" ? "/api/meals" : `/api/meals/${mealId}`;
      const method = mode === "add" ? "POST" : "PUT";

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("You must be logged in to save recipes.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} meal`);
      }

      const result = await response.json();
      const redirectId = mode === "add" ? result.meal.id : mealId;

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

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
      <Link href={backLink} className="inline-block mb-6 text-mint-500 hover:underline">
        {backText}
      </Link>

      <h1 className="text-4xl font-bold mb-8">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <ImageUrlField value={formData.image} onChange={handleImageChange} />

        <LabelsSelector
          availableLabels={availableLabels}
          selectedLabels={selectedLabels}
          onLabelsChange={setSelectedLabels}
          onNewLabelCreated={handleNewLabel}
        />

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
              Servings <span className="text-coral-300">*</span>
            </label>
            <input
              type="number"
              name="servings"
              min="1"
              required
              value={formData.servings}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 bg-gray-50 text-gray-800"
              placeholder="e.g., 4"
            />
          </div>
        </div>

        {error && (
          <div
            className="p-4 bg-coral-100 border border-coral-200 rounded-xl text-coral-300"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

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
