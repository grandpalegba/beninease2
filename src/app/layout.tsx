import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";

export const metadata: Metadata = {
  title: "Beninease - Ambassadeurs du Bénin",
  description: "Découvrez et soutenez les talents qui font rayonner l'excellence béninoise.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Beninease - Ambassadeurs du Bénin",
    description: "Découvrez et soutenez les talents qui font rayonner l'excellence béninoise.",
    url: "https://beninease.space",
    type: "website",
    locale: "fr_BJ",
    siteName: "Beninease",
  },
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
