"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExplorer = pathname?.includes("/explorer") || pathname?.includes("/cours/") || pathname?.includes("/sato-challenge");
  const isBottomNav = pathname === "/referent" || pathname === "/tresors" || pathname === "/duel" || pathname === "/talents" || pathname === "/mysteres" || pathname === "/consultation" || pathname?.startsWith("/referent/");
  
  const hidesHeader = isExplorer || isBottomNav;

  return (
    <main className={cn("min-h-screen relative", hidesHeader ? "pt-0 pb-20 md:pb-24" : "pt-16")}>
      {children}
    </main>
  );
}
