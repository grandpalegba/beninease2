import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

/**
 * Middleware principal pour la gestion des sessions et de la protection des routes.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Refresh de la session Supabase
  const { supabase, response } = await createSupabaseMiddlewareClient(request);

  // 2. Vérification de la session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. --- ROUTES PROTÉGÉES ---
  
  // Admin Area
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Dashboard Area (Talent & Votant)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Settings Area
  if (pathname.startsWith("/settings")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4. --- LOGIQUE DE REDIRECTION INTELLIGENTE ---
  // Si l'utilisateur est connecté et va sur /login, on le redirige vers son dashboard
  if (pathname === "/login" && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    const role = profile?.role || 'votant';
    if (role === 'admin') return NextResponse.redirect(new URL("/admin", request.url));
    if (role === 'candidat' || role === 'ambassadeur') return NextResponse.redirect(new URL("/dashboard/talent", request.url));
    return NextResponse.redirect(new URL("/dashboard/votant", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files like logos)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
