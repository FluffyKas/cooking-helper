import { NextResponse } from "next/server";
import { supabase, createAuthenticatedClient } from "@/lib/supabase";
import { formatLabel } from "@/lib/labels";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting meal:", error);
    return NextResponse.json(
      { error: "Failed to get meal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const authClient = createAuthenticatedClient(token);

    const { id } = await params;
    const updatedData = await request.json();

    // Format labels
    if (updatedData.labels && Array.isArray(updatedData.labels)) {
      updatedData.labels = updatedData.labels
        .map((label: string) => formatLabel(label))
        .filter(Boolean);
    }

    const mealForDb = {
      name: updatedData.name,
      complexity: updatedData.complexity,
      cuisine: updatedData.cuisine,
      ingredients: updatedData.ingredients || null,
      instructions: updatedData.instructions || null,
      image: updatedData.image || null,
      labels: updatedData.labels || null,
      prep_time: updatedData.prepTime || null,
      servings: updatedData.servings,
      spiciness: updatedData.spiciness || null,
      calories: updatedData.calories || null,
      protein: updatedData.protein || null,
      carbs: updatedData.carbs || null,
      fat: updatedData.fat || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await authClient
      .from('meals')
      .update(mealForDb)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating meal:", error);
      return NextResponse.json({ error: "Failed to update meal" }, { status: 500 });
    }

    return NextResponse.json({ success: true, meal: data });
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: "Failed to update meal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const authClient = createAuthenticatedClient(token);

    const { id } = await params;

    const { error } = await authClient
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting meal:", error);
      return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}
