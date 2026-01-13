"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import MealForm from "@/components/MealForm";

export default function AddMealPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen p-8">
        <MealForm mode="add" />
      </main>
    </ProtectedRoute>
  );
}
