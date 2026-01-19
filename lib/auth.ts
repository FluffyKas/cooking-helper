import { NextResponse } from "next/server";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { supabase, createAuthenticatedClient } from "./supabase";

interface AuthSuccess {
  success: true;
  user: User;
  token: string;
  authClient: SupabaseClient;
}

interface AuthFailure {
  success: false;
  response: NextResponse;
}

type AuthResult = AuthSuccess | AuthFailure;

/**
 * Authenticate a request using the Authorization header.
 * Returns the user, token, and an authenticated Supabase client on success.
 * Returns a 401 NextResponse on failure.
 *
 * @example
 * const auth = await authenticateRequest(request);
 * if (!auth.success) return auth.response;
 * // Use auth.user, auth.token, auth.authClient
 */
export async function authenticateRequest(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return {
    success: true,
    user,
    token,
    authClient: createAuthenticatedClient(token),
  };
}

/**
 * Authenticate using a custom Supabase client (e.g., admin client).
 * Use this for routes that need service role access.
 */
export async function authenticateWithClient(
  request: Request,
  client: SupabaseClient
): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error: authError } = await client.auth.getUser(token);

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return {
    success: true,
    user,
    token,
    authClient: client,
  };
}
