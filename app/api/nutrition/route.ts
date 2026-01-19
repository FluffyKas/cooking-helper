import { NextResponse } from "next/server";

interface NutritionRequest {
  ingredients: string[];
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function POST(request: Request) {
  try {
    const { ingredients }: NutritionRequest = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Ingredients are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Calculate the TOTAL nutritional information for ALL these ingredients combined:

${ingredients.map((ing) => `- ${ing}`).join("\n")}

Respond with ONLY a JSON object in this exact format, no other text:
{"calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number|}

Where:
- calories: total calories for ALL ingredients combined (integer)
- protein: total grams of protein for ALL ingredients (integer)
- carbs: total grams of carbohydrates for ALL ingredients (integer)
- fat: total grams of fat for ALL ingredients (integer)

Base your estimates on standard nutritional databases. If ingredient quantities are unclear, make reasonable assumptions for a typical recipe.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a nutrition expert. Calculate total nutritional information accurately based on ingredients provided. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        seed: 42,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to calculate nutrition" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    let nutrition: NutritionData;
    try {
      // Handle potential markdown code blocks
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      nutrition = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse nutrition response:", content);
      return NextResponse.json(
        { error: "Failed to parse nutrition data" },
        { status: 500 }
      );
    }

    if (
      typeof nutrition.calories !== "number" ||
      typeof nutrition.protein !== "number" ||
      typeof nutrition.carbs !== "number" ||
      typeof nutrition.fat !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid nutrition data format" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      calories: Math.round(nutrition.calories),
      protein: Math.round(nutrition.protein),
      carbs: Math.round(nutrition.carbs),
      fat: Math.round(nutrition.fat),
    });
  } catch (error) {
    console.error("Error calculating nutrition:", error);
    return NextResponse.json(
      { error: "Failed to calculate nutrition" },
      { status: 500 }
    );
  }
}
