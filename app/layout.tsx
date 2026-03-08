import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import "./globals.css";
import { baseUrl } from "@/lib/baseUrl";

export const dynamic = "force-dynamic";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Configuración de la metadata de la aplicación
export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME} | Transforma tus ideas en proyectos reales`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description:
    "IdeasDev es la plataforma definitiva para desarrolladores. Genera ideas de proyectos tecnológicos con IA, construye proyectos vivos con memoria y lleva tu portfolio al siguiente nivel.",
  keywords: [
    "saas",
    "ideas de proyectos",
    "desarrollo web",
    "inteligencia artificial",
    "coding",
    "software engineering",
    "proyectos con IA",
  ],
  authors: [{ name: "IdeasDev Team" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: baseUrl,
    title: "IdeasDev - Constructor de Ideas para Desarrolladores",
    description:
      "Transforma tus ideas vagas en proyectos accionables con el poder de la IA y el seguimiento continuo.",
    siteName: "IdeasDev",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeasDev - Constructor de Ideas para Desarrolladores",
    description:
      "Transforma tus ideas vagas en proyectos accionables con el poder de la IA.",
    creator: "@MarcosDev",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} ${syne.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session} refetchOnWindowFocus={false}>
            {children}
          </SessionProvider>
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
