import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conocé cómo protegemos tu información y cómo gestionamos tus datos en IdeasDev.",
};

export default function PrivacyPage() {
  return (
    <>
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
            Recolectamos información básica a través de Google y GitHub OAuth
            (nombre, email e imagen de perfil). Estos datos son necesarios para
            que puedas acceder a tus proyectos guardados y utilizar la
            plataforma.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            2. Privacidad de tus Chats
          </h2>
          <p>
            Tus conversaciones con la IA se almacenan de forma segura para
            permitir que los proyectos tengan memoria y contexto continuos. No
            vendemos tus datos a terceros ni los utilizamos para entrenar
            modelos públicos externos sin tu consentimiento explícito.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            3. Seguridad de los Datos
          </h2>
          <p>
            Utilizamos bases de datos encriptadas y conexiones seguras (SSL) en
            todo momento para proteger tu información y el contenido de tus
            ideas, cumpliendo con los estándares de seguridad exigidos por la
            normativa aplicable.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            4. Procesamiento de Pagos con Polar.sh
          </h2>
          <p>
            Para gestionar suscripciones y compras de créditos, utilizamos{" "}
            <a
              href="https://polar.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Polar.sh
            </a>{" "}
            como plataforma de pagos. Polar.sh puede recopilar y procesar datos
            de facturación (nombre, correo, dirección de facturación y método de
            pago) bajo sus propios términos. No almacenamos información sensible
            de tarjetas de crédito o débito en nuestros servidores. Podes
            consultar la{" "}
            <a
              href="https://polar.sh/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Política de Privacidad de Polar.sh
            </a>{" "}
            para conocer cómo gestionan esos datos.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            5. Cumplimiento de la Ley 25.326 (Argentina)
          </h2>
          <p>
            Nuestra política cumple con la Ley de Protección de Datos Personales
            N° 25.326 de la República Argentina. Se le hace saber que la Agencia
            de Acceso a la Información Pública, en su carácter de Órgano de
            Control de la Ley N° 25.326, tiene la atribución de atender las
            denuncias y reclamos que interpongan quienes resulten afectados en
            sus derechos.
          </p>

          <h2 className="text-2xl font-bold font-syne text-foreground mt-10">
            5. Tus Derechos y Consentimiento
          </h2>
          <p>
            Al utilizar la plataforma, otorgás tu consentimiento expreso para el
            tratamiento de tus datos. Como titular de los datos personales,
            tenés la facultad de ejercer el derecho de acceso, así como
            solicitar la rectificación o eliminación total de tu cuenta enviando
            un correo a{" "}
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
