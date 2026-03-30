import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Redirect to the user's intended destination or a default dashboard
      return NextResponse.redirect(`${origin}${next ?? "/dashboard/votant"}`);
    }
  }

  // Fallback redirect in case of error or no code
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
