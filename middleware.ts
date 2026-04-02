import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- ACCÈS PUBLIC ---
  // On autorise immédiatement l'accès aux pages publiques
  if (
    pathname.startsWith("/talents") || 
    pathname.startsWith("/classement") || 
    pathname.startsWith("/api/og") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/")
  ) {
    return NextResponse.next();
  }

  // Pour les autres routes, on rafraîchit juste la session
  const { supabase, response } = createSupabaseMiddlewareClient(request);
  
  try {
    await supabase.auth.getSession();
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files like images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
