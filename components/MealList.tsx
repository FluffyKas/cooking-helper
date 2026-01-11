"use client";

import { useState, useMemo } from "react";
import MealCard from "./MealCard";
import { Meal, Complexity } from "@/types/meal";

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | "all">("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Get unique cuisines and labels from all meals
  const cuisines = useMemo(() => {
    const uniqueCuisines = new Set(meals.map((meal) => meal.cuisine));
    return Array.from(uniqueCuisines).sort();
  }, [meals]);

  const allLabels = useMemo(() => {
    const labelSet = new Set<string>();
    meals.forEach((meal) => {
      meal.labels?.forEach((label) => labelSet.add(label));
    });
    return Array.from(labelSet).sort();
  }, [meals]);

  // Filter meals based on all criteria
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Search by name
      const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by complexity
      const matchesComplexity = selectedComplexity === "all" || meal.complexity === selectedComplexity;
      
      // Filter by cuisine
      const matchesCuisine = selectedCuisine === "all" || meal.cuisine === selectedCuisine;
      
      // Filter by labels (meal must have ALL selected labels)
      const matchesLabels = selectedLabels.length === 0 || 
        selectedLabels.every((label) => meal.labels?.includes(label));

      return matchesSearch && matchesComplexity && matchesCuisine && matchesLabels;
    });
  }, [meals, searchQuery, selectedComplexity, selectedCuisine, selectedLabels]);

  // Toggle label selection
  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedComplexity("all");
    setSelectedCuisine("all");
    setSelectedLabels([]);
  };

  const hasActiveFilters = searchQuery || selectedComplexity !== "all" || 
    selectedCuisine !== "all" || selectedLabels.length > 0;

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complexity filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Complexity</label>
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value as Complexity | "all")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Cuisine filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Cuisine</label>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Labels filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Labels</label>
          <div className="flex flex-wrap gap-2">
            {allLabels.map((label) => (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedLabels.includes(label)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {filteredMeals.length === meals.length
          ? `Showing all ${meals.length} recipes`
          : `Found ${filteredMeals.length} of ${meals.length} recipes`}
      </p>

      {/* Meals grid */}
      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No recipes found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
