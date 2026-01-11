"use client";

import { useState } from "react";
import MealCard from "./MealCard";
import { Meal } from "@/types/meal";

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter meals based on search query
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          No recipes found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
