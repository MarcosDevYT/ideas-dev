import { Code2, Lightbulb, Braces, Rocket } from "lucide-react";
import { Container } from "../container";

const steps = [
  {
    step: "01",
    title: "Define tu perfil",
    description:
      "Ingresa tu stack tecnológico favorito y tu rol actual. Esto afina la IA.",
    icon: Code2,
  },
  {
    step: "02",
    title: "Genera ideas",
    description:
      "Chatea con la IA y recibe propuestas estructuradas con tecnologías, dificultades y funcionalidades.",
    icon: Lightbulb,
  },
  {
    step: "03",
    title: "Crea un proyecto vivo",
    description:
      "Convierte esa idea en un entorno con memoria. La IA recordará el contexto en cada paso.",
    icon: Braces,
  },
  {
    step: "04",
    title: "Desarrolla",
    description:
      "Haz preguntas técnicas, pide roadmaps y empieza a codear tu MVP sin bloqueos.",
    icon: Rocket,
  },
];

export const HowItWorks = () => {
  return (
    <Container id="how-it-works">
      <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
        {/* Título de sección */}
        <div className="md:w-1/3 space-y-6 mt-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl 2xl:text-[4rem] font-bold tracking-tight leading-tight">
            Del prompt al <span className="text-primary font-bold">deploy</span>{" "}
            en 4 pasos.
          </h2>
          <p className="text-muted-foreground text-lg">
            Un flujo de trabajo diseñado para eliminar la fricción entre tener
            una idea y empezar a escribir código.
          </p>
        </div>

        {/* Timeline / Pasos */}
        <div className="md:w-3/5 rounded-xl px-2 py-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/bg-hero.png"
              className="size-full object-cover"
              alt="bg-hero"
            />
          </div>

          <div className="absolute inset-0 backdrop-blur-md" />

          <div className="relative border-l border-border ml-6 md:ml-8 space-y-8 pb-4">
            {steps.map((step, i) => (
              <div key={i} className="relative pl-10 md:pl-16">
                {/* Círculo del step */}
                <span className="absolute -left-6 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-background border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.1)] text-primary font-bold">
                  {step.step}
                </span>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
