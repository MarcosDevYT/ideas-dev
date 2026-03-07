import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Leé los términos de servicio de IdeasDev para entender tus derechos y responsabilidades al usar nuestra plataforma.",
};

export default async function TermsPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user as UserWithDetails} />
      <main className="flex-1 py-20">
        <Container>
          <article className="max-w-3xl mx-auto prose prose-invert">
            <h1 className="text-4xl font-syne font-black mb-8">
              Términos y Condiciones
            </h1>
            <p className="text-muted-foreground mb-6 italic">
              Última actualización: Marzo 2026
            </p>

            <section className="space-y-6 text-muted-foreground">
              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al acceder y utilizar IdeasDev, aceptás cumplir con estos
                términos. Nuestra plataforma está diseñada para ayudarte a idear
                proyectos tecnológicos mediante IA. El uso indebido de las
                herramientas de IA resultará en la suspensión de la cuenta.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                2. Uso de la IA y Créditos
              </h2>
              <p>
                El consumo de la API de IA se gestiona mediante créditos.
                IdeasDev no garantiza que las ideas generadas sean 100%
                precisas, sino que sirven como una base de inspiración y
                planificación para desarrolladores.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                3. Suscripciones y Pagos
              </h2>
              <p>
                Los pagos se procesan de forma segura a través de pasarelas
                autorizadas. No se realizan reembolsos parciales por meses no
                utilizados una vez que el ciclo ha comenzado.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                4. Propiedad Intelectual
              </h2>
              <p>
                Vos sos el dueño de las ideas y proyectos que generes dentro de
                la plataforma. IdeasDev se reserva los derechos sobre la
                tecnología propietaria utilizada para generar dichas ideas.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                5. Limitación de Responsabilidad (Exención de Garantías)
              </h2>
              <p>
                El servicio se proporciona &quot;tal cual&quot; (as is) y
                &quot;según disponibilidad&quot;. Marcos (MarcosDev) y el equipo
                de IdeasDev no se hacen responsables por daños directos,
                indirectos, lucro cesante, pérdida de datos o interrupciones del
                servicio. El usuario asume toda la responsabilidad y riesgo por
                el uso de la plataforma.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                6. Jurisdicción y Ley Aplicable
              </h2>
              <p>
                Estos Términos y Condiciones se rigen e interpretan de acuerdo
                con las leyes de la República Argentina. Cualquier controversia
                que derive de su aplicación se someterá a los Tribunales
                Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando a
                cualquier otro fuero o jurisdicción.
              </p>

              <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
                7. Contacto
              </h2>
              <p>
                Si tenés alguna duda sobre estos Términos y Condiciones, o
                necesitás asistencia, podés contactarnos enviando un correo a{" "}
                <a
                  href={`mailto:${process.env.SUPPORT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.SUPPORT_EMAIL}
                </a>
                .
              </p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
