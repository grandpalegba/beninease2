import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.user && !next) {
      const { data: talentProfile } = await supabase
        .from("talents")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      let role = talentProfile?.role;

      if (!role) {
        const { data: votantProfile } = await supabase
          .from("Votants")
          .select("id, role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!votantProfile) {
          await supabase.from("Votants").upsert({
            id: session.user.id,
            role: "votant",
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email,
            avatar_url:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              null,
          });
        }

        role = votantProfile?.role || 'votant';
      }

      if (role === 'votant') {
        return NextResponse.redirect(`${origin}/dashboard/votant`);
      } else if (role === 'candidat' || role === 'ambassadeur') {
        return NextResponse.redirect(`${origin}/dashboard/talent`);
      } else if (role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next ?? "/"}`);
}
