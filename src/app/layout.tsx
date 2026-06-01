import { Suspense } from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import BodyWrapper from "@/components/BodyWrapper";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Yonyverse - Explorer la Matrice du Fâ",
  description: "Libération des Trésors du Bénin.",
  keywords: ["Bénin", "Talents", "Culture", "Patrimoine", "Excellence", "Fâ", "Jeux Mondiaux", "Yonyverse"],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Yonyverse - Explorer la Matrice du Fâ",
    description: "Libération des Trésors du Bénin.",
    url: "https://beninease.space",
    type: "website",
    locale: "fr_BJ",
    siteName: "Yonyverse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yonyverse - Explorer la Matrice du Fâ",
    description: "Libération des Trésors du Bénin.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={cn("scroll-smooth", "font-sans", inter.variable)}>
      <body className="min-h-screen antialiased bg-[#F9F9F7]">
        <Providers>
          <Suspense fallback={null}>
            <ConditionalHeader />
          </Suspense>
          <BodyWrapper>
            {children}
          </BodyWrapper>
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
