import Link from "next/link";
import Image from "next/image";
import { Meal } from "@/types/meal";

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  // Generate chili icons based on spiciness level
  const getSpicyIcons = (level?: number) => {
    if (!level || level === 0) return null;
    return "🌶️".repeat(level);
  };

  return (
    <div className="relative group">
      <Link href={`/meal/${meal.id}`}>
        <div className="border border-white/20 rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-white/10 dark:bg-white/10 backdrop-blur-md dark:border-white/10">
          {/* Image */}
          <div className="relative h-48 bg-gray-200 dark:bg-gray-700/50">
            {meal.image ? (
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{meal.name}</h3>
              {meal.spiciness && meal.spiciness > 0 && (
                <span className="text-lg ml-2 flex-shrink-0">
                  {getSpicyIcons(meal.spiciness)}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="capitalize">{meal.complexity}</span>
              <span>•</span>
              <span>{meal.cuisine}</span>
              {meal.prep_time && (
                <>
                  <span>•</span>
                  <span>{meal.prep_time} min</span>
                </>
              )}
            </div>

            {/* Labels */}
            {meal.labels && meal.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {meal.labels.map((label) => (
                  <span
                    key={label}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Edit button - only visible on hover */}
      <Link
        href={`/edit/${meal.id}`}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 p-2 bg-white/20 dark:bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
        aria-label="Edit recipe"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700 dark:text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </Link>
    </div>
  );
}
