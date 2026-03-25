import type { PublicUserRow } from "@/lib/auth/types";

export function getHomePathForUser(user: PublicUserRow): string {
  if (user.role === "admin") return "/admin/dashboard";
  if (user.role === "jury") {
    return user.is_approved ? "/jury/dashboard" : "/pending-approval";
  }
  return "/profile/edit";
}
