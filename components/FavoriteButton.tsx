"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useFavorites } from "./FavoritesProvider";

interface FavoriteButtonProps {
  mealId: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({ mealId, size = "md" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, isLoading } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);

  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const buttonSize = size === "sm" ? "p-1.5" : "p-2";

  const favorited = isFavorited(mealId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || isToggling) return;

    setIsToggling(true);
    await toggleFavorite(mealId);
    setIsToggling(false);
  };

  if (!user) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading || isToggling}
      className={`${buttonSize} rounded-full transition-all ${
        favorited
          ? "bg-coral-100 text-coral-300 hover:bg-coral-200"
          : "bg-white/80 text-gray-400 hover:text-coral-300 hover:bg-white"
      } ${isLoading || isToggling ? "opacity-50" : ""}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      {favorited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSize}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSize}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
