import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { formatLabel } from "@/lib/labels";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const newMeal = await request.json();

    // Format labels
    if (newMeal.labels && Array.isArray(newMeal.labels)) {
      newMeal.labels = newMeal.labels
        .map((label: string) => formatLabel(label))
        .filter(Boolean);
    }

    // Transform field names to match database
    const mealForDb = {
      name: newMeal.name,
      complexity: newMeal.complexity,
      cuisine: newMeal.cuisine,
      ingredients: newMeal.ingredients || null,
      instructions: newMeal.instructions || null,
      image: newMeal.image || null,
      labels: newMeal.labels || null,
      prep_time: newMeal.prepTime || null,
      servings: newMeal.servings || null,
      spiciness: newMeal.spiciness || null,
    };

    const { data, error } = await supabase
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
