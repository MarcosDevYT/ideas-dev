"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { Sparkles, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProjectSummaryAction } from "@/actions/projects/project-actions";
import { IdeaAccordion, IdeaDetails } from "./idea-accordion";
import { Badge } from "../ui/badge";

interface ProjectOverviewClientProps {
  projectId: string;
  initialSummary: string | null;
  description: string | null;
  originalIdea?: IdeaDetails; // Recibimos el JSON de la idea
  userCredits: number;
}

export function ProjectOverviewClient({
  projectId,
  initialSummary,
  description,
  originalIdea,
  userCredits,
}: ProjectOverviewClientProps) {
  const router = useRouter();
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(userCredits);

  const handleGenerateSummary = async () => {
    if (credits < 1) {
      toast.error("No tienes suficientes créditos");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProjectSummaryAction(projectId);
      if (result.success && result.summary) {
        setSummary(result.summary);
        setCredits((prev) => prev - 1);
        toast.success("Resumen generado correctamente");
        router.refresh(); // Actualiza créditos en el layout si es necesario
      } else {
        toast.error(result.error || "Error al generar el resumen");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Resumen del Proyecto
          </h2>
          <p className="text-muted-foreground mt-1">
            Visión general, detalles de la idea y análisis por IA.
          </p>
        </div>
        <Badge className="flex font-mono items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-primary/10">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium text-sm">
            Créditos disponibles: {credits}
          </span>
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Details - Ahora usa IdeaAccordion si existe originalIdea */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de la Idea
          </h3>
          {originalIdea ? (
            <IdeaAccordion idea={originalIdea} />
          ) : (
            /* Fallback para proyectos antiguos o manuales */
            <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {description || "Sin descripción proporcionada."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Summary Card */}
        <Card className="bg-card py-0 pb-6 border-primary/20 shadow-md md:col-span-2 overflow-hidden relative group">
          <CardHeader className="bg-muted/20 py-4 pt-8 border-b border-border/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Análisis de IA</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Resumen ejecutivo y recomendaciones
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating || credits < 1}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {summary ? "Regenerar Resumen" : "Generar Resumen"} (1
                    crédito)
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 min-h-[200px]">
            {summary ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                <MarkdownRenderer content={summary} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-4 opacity-70">
                <div className="p-4 rounded-full bg-secondary/50">
                  <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="max-w-md">
                  <p className="text-muted-foreground font-medium">
                    Aún no hay un resumen generado.
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Utiliza la IA para generar un análisis detallado, estructura
                    y próximos pasos sugeridos para tu proyecto.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
