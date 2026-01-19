import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { authenticateWithClient } from "@/lib/auth";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: Request) {
  try {
    const auth = await authenticateWithClient(request, supabaseAdmin);
    if (!auth.success) return auth.response;

    await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_id", auth.user.id);

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(auth.user.id);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
