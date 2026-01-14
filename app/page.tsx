import { getAllMeals } from "@/lib/meals";
import MealList from "@/components/MealList";
import ProtectedRoute from "@/components/ProtectedRoute";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home(): Promise<JSX.Element> {
  const meals = await getAllMeals();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <MealList meals={meals} />
      </div>
    </ProtectedRoute>
  );
}
