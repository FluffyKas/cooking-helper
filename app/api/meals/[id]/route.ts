import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { formatLabel } from "@/lib/labels";

// GET single meal
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "data", "meals.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const meals = JSON.parse(fileContents);

    const meal = meals.find((m: any) => m.id === params.id);

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error("Error getting meal:", error);
    return NextResponse.json(
      { error: "Failed to get meal" },
      { status: 500 }
    );
  }
}

// PUT (update) meal
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedData = await request.json();

    // Read existing meals
    const filePath = path.join(process.cwd(), "data", "meals.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const meals = JSON.parse(fileContents);

    // Find and update the meal
    const mealIndex = meals.findIndex((m: any) => m.id === params.id);

    if (mealIndex === -1) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    // Format labels
    if (updatedData.labels && Array.isArray(updatedData.labels)) {
      updatedData.labels = updatedData.labels
        .map((label: string) => formatLabel(label))
        .filter(Boolean);
    }

    // Update meal while keeping the ID
    meals[mealIndex] = {
      id: params.id,
      ...updatedData,
    };

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(meals, null, 2));

    return NextResponse.json({ success: true, meal: meals[mealIndex] });
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: "Failed to update meal" },
      { status: 500 }
    );
  }
}
