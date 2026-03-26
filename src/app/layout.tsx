import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";

export const metadata: Metadata = {
  title: "Beninease Auth",
  description: "Supabase Auth + role-based routing (Next.js)",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh antialiased">
        <Header />
        <MobileNavigation />
        <div className="pt-20 md:pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
