"use client";

import { useRouter } from "next/navigation";
import { createProjectAction } from "@/actions/project-actions";
import { eventBus, EVENTS } from "@/lib/events";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  FolderPlus,
  Copy,
  Rocket,
  Lightbulb,
} from "lucide-react";

interface Idea {
  nombre: string;
  descripcion: string;
  tipo: string;
  dificultad: string;
  funcionalidades?: { titulo: string; detalle: string }[];
  aprendizaje?: { concepto: string; explicacion: string }[];
  stack_sugerido?: Record<string, string[]>;
}

interface IdeaMessageCardProps {
  data: Idea;
}

export function IdeaMessageCard({ data }: IdeaMessageCardProps) {
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Idea copiada al portapapeles");
  };

  const handleCreateProject = async () => {
    console.log("🚀 [IdeaMessageCard] handleCreateProject - INICIO");
    console.log("📦 [IdeaMessageCard] Datos de la idea:", {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipo: data.tipo,
    });

    const toastId = toast.loading("Creando proyecto...");

    try {
      console.log("📡 [IdeaMessageCard] Llamando a createProjectAction...");
      const result = await createProjectAction(
        data.nombre,
        data.descripcion,
        data,
      );

      console.log(
        "📥 [IdeaMessageCard] Resultado de createProjectAction:",
        result,
      );

      if (result.success && result.projectId) {
        console.log("✅ [IdeaMessageCard] Proyecto creado exitosamente");
        console.log("🆔 [IdeaMessageCard] Project ID:", result.projectId);

        toast.dismiss(toastId);
        toast.success("Proyecto creado exitosamente");

        // Trigger sidebar update
        console.log("🔄 [IdeaMessageCard] Emitiendo evento REFRESH_SIDEBAR");
        eventBus.emit(EVENTS.REFRESH_SIDEBAR);

        // Navigate to project (revalidatePath in server action ensures fresh data)
        const targetUrl = `/chat/proyectos/${result.projectId}`;
        console.log("🧭 [IdeaMessageCard] Navegando a:", targetUrl);
        console.log(
          "⏰ [IdeaMessageCard] Timestamp:",
          new Date().toISOString(),
        );

        router.push(targetUrl);

        console.log("✨ [IdeaMessageCard] router.push ejecutado");
      } else {
        console.error("❌ [IdeaMessageCard] Error en el resultado:", result);
        toast.dismiss(toastId);
        toast.error("Error al crear el proyecto");
      }
    } catch (error) {
      console.error("💥 [IdeaMessageCard] Error inesperado:", error);
      toast.dismiss(toastId);
      toast.error("Error inesperado al crear el proyecto");
    }

    console.log("🏁 [IdeaMessageCard] handleCreateProject - FIN");
  };

  return (
    <Card className="w-full border-l-4 border-l-primary shadow-sm bg-card backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="capitalize px-2 py-0.5 text-xs bg-background/50"
            >
              {data.tipo}
            </Badge>
            <Badge
              variant={
                data.dificultad === "alta"
                  ? "destructive"
                  : data.dificultad === "media"
                    ? "secondary"
                    : "default"
              }
              className="capitalize px-2 py-0.5 text-xs"
            >
              {data.dificultad}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold leading-tight text-primary">
            {data.nombre}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {data.descripcion}
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Opciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleCreateProject}
              className="cursor-pointer"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              <span>Crear proyecto</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              <span>Copiar JSON</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {/* Funcionalidades */}
        {data.funcionalidades && data.funcionalidades.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-foreground/90">
              <Rocket className="h-4 w-4 text-primary" /> Funcionalidades Clave
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.funcionalidades.map((func, i) => (
                <div
                  key={i}
                  className="bg-muted/30 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
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
        {data.aprendizaje && data.aprendizaje.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-foreground/90">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> Qué aprenderás
            </h4>
            <ul className="space-y-2">
              {data.aprendizaje.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 items-start text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>
                    <strong className="font-medium text-foreground">
                      {item.concepto}:
                    </strong>{" "}
                    {item.explicacion}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stack */}
        {data.stack_sugerido && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex flex-col gap-x-6 gap-y-2 mt-2">
              {Object.entries(data.stack_sugerido).map(([category, techs]) =>
                techs && techs.length > 0 ? (
                  <div
                    key={category}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="pt-1 text-muted-foreground capitalize font-medium">
                      {category}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {techs.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="text-[10px] px-1.5 h-5 font-normal bg-background text-muted-foreground"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
