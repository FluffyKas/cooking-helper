import Link from "next/link";
import Image from "next/image";
import { Meal } from "@/types/meal";

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <Link href={`/meal/${meal.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
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
          <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
          
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="capitalize">{meal.complexity}</span>
            <span>•</span>
            <span>{meal.cuisine}</span>
            {meal.prepTime && (
              <>
                <span>•</span>
                <span>{meal.prepTime} min</span>
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
  );
}
