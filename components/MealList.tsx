"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MealCard from "./MealCard";
import { Meal, Complexity } from "@/types/meal";

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | "all">("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Collapse state for search & filter panel
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesComplexity = selectedComplexity === "all" || meal.complexity === selectedComplexity;
      const matchesCuisine = selectedCuisine === "all" || meal.cuisine === selectedCuisine;
      const matchesLabels = selectedLabels.length === 0 ||
        selectedLabels.every((label) => meal.labels?.includes(label));
      return matchesSearch && matchesComplexity && matchesCuisine && matchesLabels;
    });
  }, [meals, searchQuery, selectedComplexity, selectedCuisine, selectedLabels]);

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedComplexity("all");
    setSelectedCuisine("all");
    setSelectedLabels([]);
  };

  const pickRandomRecipe = () => {
    if (filteredMeals.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredMeals.length);
    const randomMeal = filteredMeals[randomIndex];
    router.push(`/meal/${randomMeal.id}`);
  };

  const hasActiveFilters = searchQuery || selectedComplexity !== "all" ||
    selectedCuisine !== "all" || selectedLabels.length > 0;

  // Count active filters for badge (including search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedComplexity !== "all") count++;
    if (selectedCuisine !== "all") count++;
    count += selectedLabels.length;
    return count;
  }, [searchQuery, selectedComplexity, selectedCuisine, selectedLabels]);

  return (
    <div>
      {/* Search & Filter panel - collapsible with animation */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isFilterOpen ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search recipes by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent text-gray-800 placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>

          {/* Filter panel */}
          <div className="p-5 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-mint-500 font-medium hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Complexity</label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value as Complexity | "all")}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent text-gray-800 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Cuisine</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent text-gray-800 cursor-pointer"
                >
                  <option value="all">All</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
            </div>

            {allLabels.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {allLabels.map((label) => (
                    <button
                      key={label}
                      onClick={() => toggleLabel(label)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedLabels.includes(label)
                          ? "bg-mint-300 text-nav-dark"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Search & Filter toggle button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`relative flex items-center gap-2 p-3 md:px-4 rounded-xl transition-colors ${
              isFilterOpen || activeFilterCount > 0
                ? "bg-mint-200 text-nav-dark"
                : "bg-white text-gray-600 shadow-sm"
            }`}
            aria-label="Toggle search and filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="hidden md:inline font-medium">Search & Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 md:static md:ml-1 w-5 h-5 bg-coral-200 text-nav-dark text-xs font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Random Recipe button */}
          <button
            onClick={pickRandomRecipe}
            disabled={filteredMeals.length === 0}
            className="p-3 md:px-4 bg-lavender-100 text-gray-700 font-medium rounded-xl hover:bg-lavender-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span>🎲</span>
            <span className="hidden md:inline">Random Recipe</span>
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          {filteredMeals.length === meals.length
            ? `${meals.length} recipes`
            : `${filteredMeals.length} of ${meals.length}`}
        </p>
      </div>

      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-lg mb-2 text-gray-600">No recipes found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}