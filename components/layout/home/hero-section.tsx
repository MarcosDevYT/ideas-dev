"use client";

import Link from "next/link";
import { FluidBackground } from "./fluid-background";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsSection } from "./stats-section";

const HeroContent = () => {
  return (
    <div className="absolute z-10 flex flex-col items-center justify-center text-center px-4">
      {/* Badge Superior */}
      <div className="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Sparkles className="mr-2 h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">
          IdeasDev IA Engine v1.0
        </span>
      </div>

      {/* Título Principal */}
      <h1 className="container text-2xl md:text-4xl xl:text-6xl font-syne font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        Tus ideas no sirven de nada. <br className="hidden md:block" />
        <span className="text-3xl md:text-5xl xl:text-7xl bg-linear-to-r from-purple-500 to-green-500 bg-clip-text text-transparent inline-block mt-2 md:mt-0 font-syne font-black">
          Hasta que las desarrollás.
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="max-w-4xl text-lg md:text-xl text-gray-400 leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        Dejá de patear tus side-projects. IdeasDev es el lugar donde los
        developers transformamos ideas sueltas en proyectos reales. Pasá de la
        nada misma a un proyecto accionable con inteligencia artificial.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
        <Link
          href="/chat"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] border border-primary/20 rounded-full px-8 h-14 text-base font-semibold",
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            Arrancá gratis
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent z-0" />
        </Link>
        <Link
          href="/credits"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full px-8 h-14 text-base font-medium border-border/50 bg-background/50 hover:bg-muted backdrop-blur-sm transition-colors",
          )}
        >
          Ver los planes
        </Link>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <>
      <section className="relative min-h-screen px-6 md:px-12 2xl:px-16 pt-32 pb-32 overflow-hidden w-full flex items-center justify-center">
        {/* Elementos de fondo decorativos */}
        <FluidBackground />

        <HeroContent />
      </section>

      <StatsSection />
    </>
  );
};
