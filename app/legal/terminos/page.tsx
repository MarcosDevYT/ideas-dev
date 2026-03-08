import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Leé los términos de servicio de IdeasDev para entender tus derechos y responsabilidades al usar nuestra plataforma.",
};

export default function TermsPage() {
  return (
    <>
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
            Al acceder y utilizar IdeasDev, aceptás cumplir con estos términos.
            Nuestra plataforma está diseñada para ayudarte a idear proyectos
            tecnológicos mediante IA. El uso indebido de las herramientas de IA
            resultará en la suspensión de la cuenta.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            2. Uso de la IA y Créditos
          </h2>
          <p>
            El consumo de la API de IA se gestiona mediante créditos. IdeasDev
            no garantiza que las ideas generadas sean 100% precisas, sino que
            sirven como una base de inspiración y planificación para
            desarrolladores.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            3. Suscripciones y Pagos
          </h2>
          <p>
            Los pagos se procesan de forma segura a través de{" "}
            <a
              href="https://polar.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Polar.sh
            </a>
            , que actúa como Merchant of Record (MoR) en nombre de IdeasDev. Al
            suscribirte o comprar créditos, aceptás también los{" "}
            <a
              href="https://polar.sh/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Términos de Servicio de Polar.sh
            </a>
            . Los pagos, facturas y reembolsos son procesados por Polar.sh según
            su política comercial. No se realizan reembolsos parciales por meses
            no utilizados una vez que el ciclo de suscripción ha comenzado,
            salvo excepciones a criterio del equipo de IdeasDev.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            4. Propiedad Intelectual
          </h2>
          <p>
            Vos sos el dueño de las ideas y proyectos que generes dentro de la
            plataforma. IdeasDev se reserva los derechos sobre la tecnología
            propietaria utilizada para generar dichas ideas.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            5. Limitación de Responsabilidad (Exención de Garantías)
          </h2>
          <p>
            El servicio se proporciona &quot;tal cual&quot; (as is) y
            &quot;según disponibilidad&quot;. Marcos (MarcosDev) y el equipo de
            IdeasDev no se hacen responsables por daños directos, indirectos,
            lucro cesante, pérdida de datos o interrupciones del servicio. El
            usuario asume toda la responsabilidad y riesgo por el uso de la
            plataforma.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            6. Jurisdicción y Ley Aplicable
          </h2>
          <p>
            Estos Términos y Condiciones se rigen e interpretan de acuerdo con
            las leyes de la República Argentina. Cualquier controversia que
            derive de su aplicación se someterá a los Tribunales Ordinarios de
            la Ciudad Autónoma de Buenos Aires, renunciando a cualquier otro
            fuero o jurisdicción.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            7. Contacto
          </h2>
          <p>
            Si tenés alguna duda sobre estos Términos y Condiciones, o necesitás
            asistencia, podés contactarnos enviando un correo a{" "}
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
    </>
  );
}
