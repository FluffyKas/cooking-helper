import { NextResponse } from "next/server";
import { getAllUniqueLabels } from "@/lib/labels";

export async function GET() {
  try {
    const labels = await getAllUniqueLabels();
    return NextResponse.json({ labels });
  } catch (error) {
    console.error("Error getting labels:", error);
    return NextResponse.json(
      { error: "Failed to get labels" },
      { status: 500 }
    );
  }
}
