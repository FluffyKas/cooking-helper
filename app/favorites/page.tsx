"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import MealCard from "@/components/MealCard";
import { Meal } from "@/types/meal";
import Link from "next/link";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    async function loadFavorites() {
      try {
        const { data } = await supabase
          .from('favorites')
          .select(`
            meal_id,
            meals (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const meals = data?.map(fav => fav.meals as unknown as Meal).filter(Boolean) || [];
        setFavorites(meals);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Favorites</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Favorites</h1>
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600 mb-4">Please sign in to view your favorites.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Favorites</h1>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t favorited any recipes yet.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-mint-300 text-nav-dark font-semibold rounded-xl hover:bg-mint-400 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
