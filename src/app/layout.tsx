import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import BodyWrapper from "@/components/BodyWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BeninEase - Les Trésors du Bénin",
  description: "Découvrez les ambassadeurs et les mystères du patrimoine béninois.",
  keywords: ["Bénin", "Ambassadeurs", "Culture", "Patrimoine", "Excellence"],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "BeninEase - L'Excellence Béninoise",
    description: "Découvrez les ambassadeurs et les mystères du patrimoine béninois.",
    url: "https://beninease.space",
    type: "website",
    locale: "fr_BJ",
    siteName: "BeninEase",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen antialiased bg-[#F9F9F7]">
        <ConditionalHeader />
        <BodyWrapper>
          {children}
        </BodyWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
