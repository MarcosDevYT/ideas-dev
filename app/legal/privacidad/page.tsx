import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conocé cómo protegemos tu información y cómo gestionamos tus datos en IdeasDev.",
};

export default async function PrivacyPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user as UserWithDetails} />
      <main className="flex-1 py-20 px-4">
        <Container>
          <article className="max-w-3xl mx-auto prose prose-invert">
            <h1 className="text-4xl font-syne font-black mb-8">
              Política de Privacidad
            </h1>
            <p className="text-muted-foreground mb-6 italic">
              Última actualización: Marzo 2026
            </p>

            <section className="space-y-6 text-muted-foreground">
              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                1. Datos que Recolectamos
              </h2>
              <p>
                Recolectamos información básica a través de Google y GitHub
                OAuth (nombre, email e imagen de perfil). Estos datos son
                necesarios para que puedas acceder a tus proyectos guardados.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                2. Privacidad de tus Chats
              </h2>
              <p>
                Tus conversaciones con la IA se almacenan de forma segura para
                permitir que los proyectos tengan memoria y contexto continuos.
                No vendemos tus datos a terceros ni los utilizamos para entrenar
                modelos públicos externos sin tu consentimiento explícito.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                3. Seguridad de los Datos
              </h2>
              <p>
                Utilizamos bases de datos encriptadas y conexiones seguras (SSL)
                en todo momento para proteger tu información y el contenido de
                tus ideas.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                4. Tus Derechos
              </h2>
              <p>
                Podés solicitar la eliminación total de tu cuenta y todos los
                datos asociados enviando un correo a privacidad@ideasdev.com.
              </p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
