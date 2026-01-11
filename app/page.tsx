import { getAllMeals } from "@/lib/meals";
import MealList from "@/components/MealList";
import Link from "next/link";

export default function Home() {
  const meals = getAllMeals();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Cooking Helper</h1>
          
          <Link 
            href="/add"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add New Meal
          </Link>
        </div>

        {/* Meal list with search and filters */}
        <MealList meals={meals} />
      </div>
    </main>
  );
}
