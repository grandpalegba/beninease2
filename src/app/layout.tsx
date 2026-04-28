import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import BodyWrapper from "@/components/BodyWrapper";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BLACK TO BENIN - Les Trésors du Bénin",
  description: "Découvrez les talents et les mystères du patrimoine béninois.",
  keywords: ["Bénin", "Talents", "Culture", "Patrimoine", "Excellence"],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "BLACK TO BENIN - L'Excellence Béninoise",
    description: "Découvrez les talents et les mystères du patrimoine béninois.",
    url: "https://beninease.space",
    type: "website",
    locale: "fr_BJ",
    siteName: "BLACK TO BENIN",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen antialiased bg-[#F9F9F7]">
        <Providers>
          <ConditionalHeader />
          <BodyWrapper>
            {children}
          </BodyWrapper>
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
