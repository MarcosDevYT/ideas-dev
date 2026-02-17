import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Lightbulb, Layers } from "lucide-react";

export interface IdeaDetails {
  nombre: string;
  descripcion: string;
  tipo: string;
  dificultad: string;
  funcionalidades?: { titulo: string; detalle: string }[];
  aprendizaje?: { concepto: string; explicacion: string }[];
  stack_sugerido?: Record<string, string[]>;
}

interface IdeaAccordionProps {
  idea: IdeaDetails;
}

export function IdeaAccordion({ idea }: IdeaAccordionProps) {
  return (
    <Card className="bg-card border-primary/20 shadow-md overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="idea-details" className="border-none px-6">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-4 text-left">
              <span className="font-bold text-lg text-primary">
                {idea.nombre}
              </span>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize text-xs">
                  {idea.tipo}
                </Badge>
                <Badge
                  variant={
                    idea.dificultad === "alta"
                      ? "destructive"
                      : idea.dificultad === "media"
                        ? "secondary"
                        : "default"
                  }
                  className="capitalize text-xs"
                >
                  {idea.dificultad}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {idea.descripcion}
            </p>

            {/* Funcionalidades */}
            {idea.funcionalidades && idea.funcionalidades.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-foreground/90">
                  <Rocket className="h-4 w-4 text-primary" /> Funcionalidades
                  Clave
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {idea.funcionalidades.map((func, i) => (
                    <div
                      key={i}
                      className="bg-muted/30 p-3 rounded-lg border border-border/50"
                    >
                      <span className="font-medium block mb-1 text-foreground">
                        {func.titulo}
                      </span>
                      <span className="text-xs text-muted-foreground leading-snug block">
                        {func.detalle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aprendizaje */}
            {idea.aprendizaje && idea.aprendizaje.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-foreground/90">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Qué
                  aprenderás
                </h4>
                <ul className="space-y-2">
                  {idea.aprendizaje.map((item, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-foreground">
                        {item.concepto}:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.explicacion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack */}
            {idea.stack_sugerido && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-foreground/90">
                  <Layers className="h-4 w-4 text-blue-500" /> Stack Sugerido
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(idea.stack_sugerido).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50"
                    >
                      <span className="text-xs font-semibold text-foreground/80 capitalize">
                        {key.replace("_", " ")}:
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
