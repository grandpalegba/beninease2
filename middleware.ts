import { NextResponse, type NextRequest } from "next/server";
import type { PublicUserRow } from "@/lib/auth/types";
import { getHomePathForUser } from "@/lib/auth/routes";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: PublicUserRow | null = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("id, role, is_approved")
      .eq("id", user.id)
      .maybeSingle();
    profile = (data as PublicUserRow | null) ?? null;
  }

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isPending = pathname === "/pending-approval";
  const isAdminArea = pathname.startsWith("/admin");
  const isJuryArea = pathname.startsWith("/jury/dashboard");
  const isProfileArea = pathname.startsWith("/profile");

  // Not authenticated
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

  // Authenticated but missing profile row (should not happen if trigger works)
  if (!profile) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "missing_profile");
    return NextResponse.redirect(url);
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
    "/",
    "/login",
    "/pending-approval",
    "/admin/:path*",
    "/jury/:path*",
    "/classement/:path*",
    "/talents/:path*",
    "/profile/:path*",
  ],
};
