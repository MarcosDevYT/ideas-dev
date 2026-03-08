import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Home } from "@/components/layout/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IdeasDev — Transforma tus ideas en proyectos reales con IA",
  description:
    "IdeasDev es la plataforma definitiva para desarrolladores. Genera ideas de proyectos tecnológicos con IA, construye proyectos con memoria y lleva tu portfolio al siguiente nivel.",
  openGraph: {
    title: "IdeasDev — Transforma tus ideas en proyectos reales con IA",
    description:
      "Genera ideas de proyectos tecnológicos con IA y construye proyectos con memoria continua.",
    images: [
      { url: "/home-opengraph.png", width: 1200, height: 630, alt: "IdeasDev" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeasDev — Transforma tus ideas en proyectos reales con IA",
    description: "Genera ideas de proyectos tecnológicos con IA.",
    images: ["/home-opengraph.png"],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  return <Home user={user as unknown as UserWithDetails} />;
}
