import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda",
  description:
    "Encontrá respuestas a tus preguntas sobre cómo usar IdeasDev, gestionar tus créditos y potenciar tus proyectos con IA.",
};

export default async function HelpCenterPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user as UserWithDetails} />
      <main className="flex-1 py-20 px-4">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <header className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-syne font-black tracking-tight">
                Centro de Ayuda
              </h1>
              <p className="text-muted-foreground text-lg">
                Todo lo que necesitás saber para empezar a construir tus ideas
                con IdeasDev.
              </p>
            </header>

            <section className="grid gap-8">
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-3">
                <h3 className="text-xl font-bold font-syne">
                  ¿Cómo funciona el chat con memoria?
                </h3>
                <p className="text-muted-foreground">
                  Cada proyecto que creás tiene su propio hilo de conversación.
                  La IA recuerda las decisiones que tomaste, el stack
                  tecnológico que elegiste y el progreso de tu idea.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-3">
                <h3 className="text-xl font-bold font-syne">
                  ¿Qué son los créditos renovables?
                </h3>
                <p className="text-muted-foreground">
                  Dependiendo de tu plan, recibís una cantidad de créditos
                  mensuales. Estos se renuevan cada mes y te permiten
                  interactuar con nuestra API de IA avanzada.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-3">
                <h3 className="text-xl font-bold font-syne">
                  ¿Puedo exportar mi proyecto?
                </h3>
                <p className="text-muted-foreground">
                  Actualmente estamos trabajando en una funcionalidad de
                  exportación para que puedas llevarte el plan de acción
                  generado directamente a tu editor de código preferido.
                </p>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-border">
              <p className="text-muted-foreground">
                ¿No encontrás lo que buscás? Escribinos a{" "}
                <a
                  href="mailto:soporte@ideasdev.com"
                  className="text-primary hover:underline"
                >
                  soporte@ideasdev.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
