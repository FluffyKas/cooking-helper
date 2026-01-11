import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { formatLabel } from "@/lib/labels";

export async function POST(request: Request) {
  try {
    const newMeal = await request.json();

    // Read existing meals
    const filePath = path.join(process.cwd(), "data", "meals.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const meals = JSON.parse(fileContents);

    // Generate new ID (simple increment based on existing IDs)
    const maxId = meals.reduce((max: number, meal: any) => {
      const id = parseInt(meal.id);
      return id > max ? id : max;
    }, 0);
    const newId = (maxId + 1).toString();

    // Format labels
    if (newMeal.labels && Array.isArray(newMeal.labels)) {
      newMeal.labels = newMeal.labels
        .map((label: string) => formatLabel(label))
        .filter(Boolean);
    }

    // Add new meal with generated ID
    const mealToAdd = {
      id: newId,
      ...newMeal,
    };

    meals.push(mealToAdd);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(meals, null, 2));

    return NextResponse.json({ success: true, meal: mealToAdd });
  } catch (error) {
    console.error("Error adding meal:", error);
    return NextResponse.json(
      { error: "Failed to add meal" },
      { status: 500 }
    );
  }
}
