import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.user && !next) {
      // Logic for automatic redirection based on role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role || 'votant';

      if (role === 'votant') {
        return NextResponse.redirect(`${origin}/dashboard/votant`);
      } else if (role === 'candidat') {
        return NextResponse.redirect(`${origin}/dashboard/candidat`);
      } else if (role === 'ambassadeur') {
        return NextResponse.redirect(`${origin}/dashboard/ambassadeur`);
      } else if (role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next ?? "/"}`);
}
