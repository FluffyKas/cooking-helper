import { getAllMeals } from "@/lib/meals";
import MealList from "@/components/MealList";
import LogoutButton from "@/components/LogoutButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default async function Home() {
  const meals = await getAllMeals();

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Cooking Helper</h1>
            
            <div className="flex items-center gap-4">
              <LogoutButton />
              <Link 
                href="/add"
                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                + ADD NEW MEAL
              </Link>
            </div>
          </div>

          {/* Meal list with search and filters */}
          <MealList meals={meals} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
