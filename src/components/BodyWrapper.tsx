"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMystery = pathname === "/talents" || pathname === "/tresors";
  
  return (
    <main className={cn("min-h-screen relative", isMystery ? "pt-0 pb-16" : "pt-16")}>
      {children}
    </main>
  );
}
