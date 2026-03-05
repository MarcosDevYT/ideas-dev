import {
  MessageSquare,
  FolderSync,
  BotMessageSquare,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "../container";
import Image from "next/image";

const features = [
  {
    title: "Chat Inmersivo, Ideas Reales",
    description:
      "Che, dejá de dar vueltas. Nuestro chat impulsado por IA estructura tu idea para Frontend, Backend o Full Stack al toque.",
    icon: MessageSquare,
    className:
      "md:col-span-2 md:row-span-2 bg-primary text-primary-foreground border-transparent",
    iconClassName:
      "text-primary-foreground bg-primary-foreground/10 border-primary-foreground/20",
    large: true,
    content: (
      <div className="mt-8 flex flex-col gap-3 font-mono text-sm opacity-90 relative">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
        <div className="self-end bg-primary-foreground/20 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] backdrop-blur-sm border border-primary-foreground/10">
          Quiero hacer un clon de Trello pero para devs
        </div>
        <div className="self-start bg-black/20 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%] backdrop-blur-sm border border-black/10">
          <p className="font-bold mb-1">¡De una! Stack recomendado:</p>
          <ul className="list-disc pl-4 space-y-1 text-primary-foreground/80">
            <li>Frontend: Next.js + Tailwind</li>
            <li>Backend: Hono + Postgres</li>
            <li>Realtime: WebSockets (Socket.io)</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Proyectos Vivos",
    description:
      "Convertí tu idea en un proyecto accionable con memoria. No arranques desde cero.",
    icon: FolderSync,
    src: "bg-green",
    className: "md:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm",
    iconClassName: "text-foreground bg-foreground/10 border-foreground/20",
    content: (
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
          /src/components
        </span>
        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/20">
          database.sql
        </span>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border/50">
          Dockerfile
        </span>
      </div>
    ),
  },
  {
    title: "Créditos Mensuales",
    description:
      "Usá tus créditos sabiamente para generar código, diagramas y más. 100 recargados cada mes.",
    icon: BotMessageSquare,
    className:
      "md:col-span-1 bg-secondary text-secondary-foreground border-transparent",
    iconClassName:
      "text-secondary-foreground bg-secondary-foreground/10 border-secondary-foreground/20",
    content: (
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col font-mono">
            <span className="text-2xl font-black leading-none">100</span>
            <span className="text-xs uppercase font-bold opacity-70">
              Disponibles
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Adaptado a tu medida",
    description:
      "Estudiante, Semisenior o Crack. Te armamos el stack y la complejidad para que no te quedes trabado y rompas la matrix con tu código.",
    icon: Settings2,
    src: "bg-violet",
    className:
      "md:col-span-3 bg-card/80 dark:bg-card/40 border-border/50 flex flex-col md:flex-row gap-6 items-center justify-between",
    iconClassName: "text-primary bg-background border-border/50",
    content: (
      <div className="flex flex-wrap gap-3 mt-4 w-full md:w-auto">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/50 min-w-24">
          <span className="text-xs text-muted-foreground uppercase font-bold mb-1">
            Junior
          </span>
          <div className="w-full h-1 bg-primary/20 rounded-full">
            <div className="w-1/3 h-full bg-primary rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background border border-border/50 min-w-24">
          <span className="text-xs text-muted-foreground uppercase font-bold mb-1">
            Semi Sr
          </span>
          <div className="w-full h-1 bg-primary/20 rounded-full">
            <div className="w-2/3 h-full bg-primary rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2 bg-background border-primary min-w-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <span className="relative text-xs text-primary uppercase font-bold mb-1">
            Senior
          </span>
          <div className="relative w-full h-1 bg-primary/30 rounded-full">
            <div className="w-full h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),1)]" />
          </div>
        </div>
      </div>
    ),
  },
];

export const FeaturesBento = () => {
  return (
    <Container className="flex flex-col items-center justify-center gap-16">
      <div className="text-center space-y-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-7xl font-syne font-black tracking-tight">
          Todo lo que necesitas para ejecutar.
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Herramientas diseñadas específicamente para el flujo de trabajo de un
          developer moderno. Ideación, estructura y memoria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-border/50 p-8 transition-all hover:shadow-xl hover:-translate-y-1",
              feature.className,
            )}
          >
            {feature.src && (
              <>
                <div className="absolute inset-0">
                  <img
                    src={`/${feature.src}.png`}
                    alt="Features Bento"
                    className="object-cover size-full"
                  />
                </div>
                <div className="absolute inset-0 backdrop-blur-sm" />
              </>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div
                  className={cn(
                    "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm border group-hover:scale-110 transition-transform duration-300",
                    feature.iconClassName,
                  )}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3
                  className={cn(
                    "font-syne font-black mb-3",
                    feature.large ? "text-3xl md:text-4xl" : "text-2xl",
                  )}
                >
                  {feature.title}
                </h3>
                <p className="opacity-90 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>

              {feature.content}

              {/* Decoración extra para la tarjeta grande */}
              {feature.large && (
                <div className="hidden md:flex flex-row items-center gap-2 mt-8 opacity-50 select-none">
                  <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  <div className="h-1 flex-1 bg-linear-to-r from-current to-transparent rounded-full opacity-30" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
