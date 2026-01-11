import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sorry, we couldn't find the recipe you're looking for.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
        >
          BACK TO RECIPES
        </Link>
      </div>
    </main>
  );
}
