import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Cooking Helper</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Your personal recipe manager
        </p>
        
        <Link 
          href="/meals"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    </main>
  );
}
