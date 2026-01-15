"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";

interface FavoritesContextType {
  favorites: Set<string>;
  isLoading: boolean;
  isFavorited: (mealId: string) => boolean;
  toggleFavorite: (mealId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all favorites for the user on mount
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      setIsLoading(false);
      return;
    }

    const userId = user.id;

    async function loadFavorites() {
      try {
        const { data } = await supabase
          .from('favorites')
          .select('meal_id')
          .eq('user_id', userId);

        const favoriteIds = new Set(data?.map(f => f.meal_id) || []);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [user]);

  const isFavorited = useCallback((mealId: string) => {
    return favorites.has(mealId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (mealId: string) => {
    if (!user) return;

    const isCurrentlyFavorited = favorites.has(mealId);

    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (isCurrentlyFavorited) {
        next.delete(mealId);
      } else {
        next.add(mealId);
      }
      return next;
    });

    try {
      if (isCurrentlyFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('meal_id', mealId);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, meal_id: mealId });
      }
    } catch (error) {
      // Revert on error
      console.error("Error toggling favorite:", error);
      setFavorites(prev => {
        const next = new Set(prev);
        if (isCurrentlyFavorited) {
          next.add(mealId);
        } else {
          next.delete(mealId);
        }
        return next;
      });
    }
  }, [user, favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, isFavorited, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
