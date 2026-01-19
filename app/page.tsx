import { getMealsPaginated } from "@/lib/meals";
import MealList from "@/components/MealList";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home(): Promise<JSX.Element> {
  const { meals, total, hasMore } = await getMealsPaginated(20, 0);

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <MealList
            initialMeals={meals}
            initialTotal={total}
            initialHasMore={hasMore}
          />
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
