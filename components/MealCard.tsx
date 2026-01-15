import Link from "next/link";
import { Meal } from "@/types/meal";
import { getSpicyIcons } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import SafeImage from "./SafeImage";

interface MealCardProps {
  meal: Meal;
}

const accentColors = [
  "bg-mint-100",
  "bg-lavender-100",
  "bg-coral-100",
];

const labelColors = [
  "bg-mint-200 text-gray-800",
  "bg-lavender-200 text-gray-800",
  "bg-coral-200 text-gray-800",
];

export default function MealCard({ meal }: MealCardProps) {

  // Pick accent color based on meal id for consistency
  const accentIndex = meal.id.charCodeAt(0) % accentColors.length;
  const accentColor = accentColors[accentIndex];

  return (
    <div className="relative group">
      <Link href={`/meal/${meal.id}`}>
        <div className={`rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02] ${accentColor}`}>
          <div className="relative h-48 bg-gray-100">
            {meal.image ? (
              <SafeImage
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
          {/* 156px is more or less the height of the card if there are 2 rows of labels - this has been done for a more consistent card height */}
          <div className="p-4 min-h-[156px]">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{meal.name}</h3>
              {meal.spiciness && meal.spiciness > 0 && (
                <span className="text-lg ml-2 flex-shrink-0">
                  {getSpicyIcons(meal.spiciness)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
              <span className="capitalize">{meal.complexity}</span>
              <span>·</span>
              <span>{meal.cuisine}</span>
              {meal.prep_time && (
                <>
                  <span>·</span>
                  <span>{meal.prep_time} min</span>
                </>
              )}
            </div>
            {meal.labels && meal.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {meal.labels.map((label, index) => {
                  // Pick color, avoiding the card's accent color
                  const colorIndex = (index + accentIndex + 1) % labelColors.length;
                  return (
                    <span
                      key={label}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${labelColors[colorIndex]}`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-2 right-2 flex items-center gap-1.5">
         <Link
          href={`/edit/${meal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Edit recipe"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
        <FavoriteButton mealId={meal.id} size="sm" />
      </div>
    </div>
  );
}
