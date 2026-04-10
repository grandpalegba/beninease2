"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBottomNav = pathname === "/ambassadeurs" || pathname === "/tresors" || pathname === "/duel" || pathname === "/talents" || pathname?.startsWith("/ambassadeurs/");
  
  return (
    <main className={cn("min-h-screen relative", isBottomNav ? "pt-0 pb-20 md:pb-24" : "pt-16")}>
      {children}
    </main>
  );
}
