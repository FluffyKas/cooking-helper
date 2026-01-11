import { getAllMeals } from "@/lib/meals";
import MealList from "@/components/MealList";

export default function MealsPage() {
  const meals = getAllMeals();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Recipes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and search through our recipe collection
          </p>
        </div>

        {/* Meal list with search */}
        <MealList meals={meals} />
      </div>
    </main>
  );
}
