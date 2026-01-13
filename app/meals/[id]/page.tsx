import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMealById } from "@/lib/meals";

export default function MealDetailPage({ params }: { params: { id: string } }) {
  const meal = getMealById(params.id);

  if (!meal) {
    notFound();
  } 

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/meals"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to recipes
        </Link>

        <h1 className="text-4xl font-bold mb-4">{meal.name}</h1>

        <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Complexity:</span>
            <span className="capitalize px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
              {meal.complexity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Cuisine:</span>
            <span>{meal.cuisine}</span>
          </div>
          {meal.prepTime && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Prep Time:</span>
              <span>{meal.prepTime} minutes</span>
            </div>
          )}
          {meal.servings && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Servings:</span>
              <span>{meal.servings}</span>
            </div>
          )}
        </div>

        {meal.labels && meal.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {meal.labels.map((label) => (
              <span
                key={label}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {meal.image && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {meal.instructions && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {meal.instructions}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
