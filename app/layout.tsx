import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { JetBrains_Mono, Space_Grotesk, Syne } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import "./globals.css";

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
    default: `${process.env.NEXT_PUBLIC_APP_NAME}`,
    template: `${process.env.NEXT_PUBLIC_APP_NAME} | %s`,
  },
  description:
    "IdeasDev es un constructor de ideas para desarrolladores, donde los usuarios generan ideas de proyectos tecnológicos mediante un chat con IA y luego pueden convertir esas ideas en proyectos vivos con memoria, contexto y seguimiento.",
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
