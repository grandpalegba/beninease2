import { NextResponse, type NextRequest } from "next/server";
import type { PublicUserRow } from "@/lib/auth/types";
import { getHomePathForUser } from "@/lib/auth/routes";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // DÉSACTIVÉ TEMPORAIREMENT pour test - si le site s'affiche, le problème vient du middleware
  return NextResponse.next();

  // --- ACCÈS PUBLIC ---
  // On autorise immédiatement l'accès aux talents, au classement et aux images OG pour les robots et visiteurs
  // Cette exception est impérative pour que les réseaux sociaux (WhatsApp, Facebook) voient les métadonnées.
  if (
    pathname.startsWith("/talents") || 
    pathname.startsWith("/classement") || 
    pathname.startsWith("/api/og")
  ) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Utilisation de getSession pour une vérification rapide de la session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  let profile: PublicUserRow | null = null;
  if (user) {
    // On vérifie d'abord dans votants
    const { data: votantData } = await supabase
      .from("votants")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();
      
    if (votantData) {
      profile = { id: votantData.id, role: votantData.role, is_approved: true };
    } else {
      // Sinon on vérifie dans Talents
      const { data: talentData } = await supabase
        .from("talents")
        .select("id, role, is_validated")
        .eq("id", user.id)
        .maybeSingle();
        
      if (talentData) {
        profile = { id: talentData.id, role: talentData.role, is_approved: talentData.is_validated };
      }
    }
  }

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isPending = pathname === "/pending-approval";
  const isAdminArea = pathname.startsWith("/admin");
  const isJuryArea = pathname.startsWith("/jury/dashboard");
  const isProfileArea = pathname.startsWith("/profile");

  // Redirection si non connecté sur les zones protégées
  if (!user) {
    if (isLogin) return response;
    if (isAdminArea || isJuryArea || isProfileArea || isPending) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Si l'utilisateur est connecté mais n'a pas de profil, on laisse passer.
  // La logique de création de profil se trouve dans les pages elles-mêmes.
  if (!profile) {
    return response;
  }

  const home = getHomePathForUser(profile);

  if (isHome) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isLogin) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isAdminArea && profile.role !== "admin") {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isJuryArea) {
    if (profile.role !== "jury") {
      return NextResponse.redirect(new URL(home, request.url));
    }
    if (!profile.is_approved) {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
  }

  if (isProfileArea && profile.role !== "candidate") {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isPending) {
    if (profile.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (profile.role === "candidate") {
      return NextResponse.redirect(new URL("/profile/edit", request.url));
    }
    if (profile.role === "jury" && profile.is_approved) {
      return NextResponse.redirect(new URL("/jury/dashboard", request.url));
    }
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
     * - public (public files like images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
