"use client";

import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import MealForm from "@/components/MealForm";
import PageTransition from "@/components/PageTransition";

export default function EditMealPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProtectedRoute>
      <PageTransition>
        <main className="min-h-screen p-8">
          <MealForm mode="edit" mealId={id} />
        </main>
      </PageTransition>
    </ProtectedRoute>
  );
}
