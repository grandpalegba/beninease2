import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yony Games — Présentation Officielle",
  description: "Découvrez les Yony Games, un événement sportif et culturel panafricain d'envergure, célébrant la convergence des sagesses ancestrales.",
  openGraph: {
    title: "Yony Games — Présentation Officielle",
    description: "Un événement sportif et culturel panafricain d'envergure.",
    images: ["/logo.png"],
  },
};

export default function YonyGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
