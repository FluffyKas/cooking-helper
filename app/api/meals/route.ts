import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { formatLabel } from "@/lib/labels";

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.success) return auth.response;

    const newMeal = await request.json();

    // Format labels
    if (newMeal.labels && Array.isArray(newMeal.labels)) {
      newMeal.labels = newMeal.labels
        .map((label: string) => formatLabel(label))
        .filter(Boolean);
    }

    const mealForDb = {
      name: newMeal.name,
      complexity: newMeal.complexity,
      cuisine: newMeal.cuisine,
      ingredients: newMeal.ingredients || null,
      instructions: newMeal.instructions || null,
      image: newMeal.image || null,
      labels: newMeal.labels || null,
      prep_time: newMeal.prepTime || null,
      servings: newMeal.servings,
      spiciness: newMeal.spiciness || null,
      calories: newMeal.calories || null,
      protein: newMeal.protein || null,
      carbs: newMeal.carbs || null,
      fat: newMeal.fat || null,
    };

    const { data, error } = await auth.authClient
      .from('meals')
      .insert([mealForDb])
      .select()
      .single();

    if (error) {
      console.error("Error adding meal:", error);
      return NextResponse.json(
        { error: "Failed to add meal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, meal: data });
  } catch (error) {
    console.error("Error adding meal:", error);
    return NextResponse.json(
      { error: "Failed to add meal" },
      { status: 500 }
    );
  }
}
