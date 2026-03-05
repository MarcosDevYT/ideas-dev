import { Container } from "../container";
import IntegrationsColums from "./IntegrationsColums";

const integrations = [
  {
    name: "Next.js",
    icon: "/integrations/nextjs.svg",
    description: "Framework principal para una experiencia web ultrarrápida.",
  },
  {
    name: "TypeScript",
    icon: "/integrations/typescript.svg",
    description: "Desarrollo robusto con tipado estático para evitar errores.",
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    icon: "/integrations/tailwindcss.svg",
    description: "Estilizado premium y responsive con un diseño moderno.",
  },
  {
    name: "Prisma",
    icon: "/integrations/prisma.svg",
    description: "ORM potente para una gestión de datos eficiente y segura.",
  },
  {
    name: "PostgreSQL",
    icon: "/integrations/postgresql.svg",
    description: "Base de datos relacional escalable para tus proyectos.",
  },
  {
    name: "GitHub",
    icon: "/integrations/github.svg",
    description: "Colaboración y versionado de código para desarrolladores.",
  },
  {
    name: "Angular",
    icon: "/integrations/angularjs.svg",
    description:
      "Plataforma para construir aplicaciones web móviles y de escritorio.",
  },
  {
    name: "Vue.js",
    icon: "/integrations/vuejs.svg",
    description: "El framework progresivo para interfaces de usuario modernas.",
  },
  {
    name: "Astro",
    icon: "/integrations/astro.svg",
    description: "Optimizado para la velocidad con arquitectura de islas.",
  },
  {
    name: "Java",
    icon: "/integrations/java.svg",
    description:
      "Robustez y escalabilidad para aplicaciones de nivel empresarial.",
  },
  {
    name: "Bun",
    icon: "/integrations/bun.svg",
    description:
      "Runtime de JavaScript todo en uno diseñado para la velocidad.",
  },
  {
    name: "Node.js",
    icon: "/integrations/nodejs.svg",
    description: "Entorno de ejecución de JavaScript para el backend.",
  },
];

export type IntegrationsType = typeof integrations;

export default function Integrations() {
  return (
    <Container>
      <div className="grid lg:grid-cols-2 items-center lg:gap-16">
        <article>
          <div className="flex">
            <span className="bg-primary/10 text-primary border border-primary/20 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              Ecosistema de Nivel Superior
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-[3.5rem] font-syne font-black leading-tight max-w-2xl bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
            Infraestructura <span className="text-primary italic">premium</span>{" "}
            para tus ideas
          </h2>

          <p className="text-white/60 mt-8 text-xl leading-relaxed max-w-xl xl:max-w-2xl">
            No solo generamos conceptos; te proporcionamos el stack tecnológico
            que los mejores desarrolladores del mundo utilizan. Desde la
            velocidad de
            <span className="text-white font-medium"> Next.js</span> hasta la
            robustez de
            <span className="text-white font-medium"> PostgreSQL</span>, tus
            proyectos nacen con cimientos de arquitectura profesional.
          </p>
        </article>

        <article>
          <div className="grid md:grid-cols-2 gap-4 h-[400px] lg:h-[800px] mt-8 lg:mt-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <IntegrationsColums integrations={integrations} />
            <IntegrationsColums
              integrations={integrations.slice().reverse()}
              className="hidden md:flex"
              reverse
            />
          </div>
        </article>
      </div>
    </Container>
  );
}
