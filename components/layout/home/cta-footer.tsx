import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "../container";

export const CtaFooter = () => {
  return (
    <Container className="overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-2xl text-center py-20 px-6">
          <div className="absolute inset-0">
            <img
              src="/bg-hero.png"
              className="size-full object-cover"
              alt="bg-hero"
            />
          </div>

          <div className="absolute inset-0 backdrop-blur-md" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-syne font-black tracking-tight mb-6 max-w-5xl mx-auto">
              Dejá de perder el tiempo con ideas en la cabeza.
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Arrancá hoy gratis con 100 créditos renovables mes a mes. Probá
              IdeasDev y mirá cómo tus ideas se convierten en tu próximo gran
              proyecto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/chat"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group rounded-full px-8 h-14 text-base font-semibold w-full sm:w-auto",
                )}
              >
                Comenzá tu primer proyecto
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="mt-6 text-sm text-primary opacity-80">
              No se requiere tarjeta de crédito para empezar.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};
