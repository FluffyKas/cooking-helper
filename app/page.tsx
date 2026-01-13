import { getAllMeals } from "@/lib/meals";
import MealList from "@/components/MealList";
import LogoutButton from "@/components/LogoutButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/Button";

export default async function Home() {
  const meals = await getAllMeals();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto mt-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white/80">Cooking Helper</h1>
          <div className="flex items-stretch gap-4">
            <Button href="/add">+ ADD NEW MEAL</Button>
            <LogoutButton />
          </div>
        </header>
        <main className="min-h-screen">
          <MealList meals={meals} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
