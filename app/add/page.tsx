"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import MealForm from "@/components/MealForm";
import PageTransition from "@/components/PageTransition";

export default function AddMealPage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <main className="min-h-screen p-8">
          <MealForm mode="add" />
        </main>
      </PageTransition>
    </ProtectedRoute>
  );
}
