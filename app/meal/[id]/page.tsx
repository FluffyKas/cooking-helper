import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMealById } from "@/lib/meals";
import DeleteMealButton from "@/components/DeleteMealButton";
import FavoriteButton from "@/components/FavoriteButton";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Label pill colors
const labelColors = [
  "bg-mint-200 text-gray-800",
  "bg-lavender-200 text-gray-800",
  "bg-coral-200 text-gray-800",
];

export default async function MealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) {
    notFound();
  }

  // Type assertion - after notFound check, meal is guaranteed to exist
  const mealData = meal;

  // Generate chili icons based on spiciness level
  const getSpicyIcons = (level?: number) => {
    if (!level || level === 0) return null;
    return "🌶️".repeat(level);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-block mb-6 text-mint-500 font-medium hover:underline"
        >
          ← Back to recipes
        </Link>

        {/* Header with Edit button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <h1 className="text-4xl font-bold">{mealData.name}</h1>
            {mealData.spiciness && mealData.spiciness > 0 && (
              <span className="text-3xl">
                {getSpicyIcons(meal.spiciness)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton mealId={id} />
            <Link
              href={`/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-mint-200 text-nav-dark font-semibold rounded-2xl hover:bg-mint-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              EDIT
            </Link>
            <DeleteMealButton mealId={id} mealName={mealData.name} />
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Complexity:</span>
            <span className="capitalize">
              {mealData.complexity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Cuisine:</span>
            <span>{mealData.cuisine}</span>
          </div>
          {mealData.prep_time && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Prep Time:</span>
              <span>{mealData.prep_time} minutes</span>
            </div>
          )}
          {mealData.servings && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Servings:</span>
              <span>{mealData.servings}</span>
            </div>
          )}
          {mealData.spiciness && mealData.spiciness > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Spiciness:</span>
              <span className="text-lg">{getSpicyIcons(meal.spiciness)}</span>
            </div>
          )}
        </div>

        {/* Labels - colorful pills */}
        {mealData.labels && mealData.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {mealData.labels.map((label, index) => (
              <span
                key={label}
                className={`px-3 py-1 rounded-full text-sm font-medium ${labelColors[index % labelColors.length]}`}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {mealData.image && (
          <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={mealData.image}
              alt={mealData.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Ingredients */}
        {mealData.ingredients && mealData.ingredients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {mealData.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {mealData.instructions && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {mealData.instructions}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
