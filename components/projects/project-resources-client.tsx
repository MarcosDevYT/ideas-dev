"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  ExternalLink,
  FileText,
  Wrench,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { eventBus, EVENTS } from "@/lib/events";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createResourceAction,
  deleteResourceAction,
} from "@/actions/projects/project-actions";

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
}

interface ProjectResourcesClientProps {
  projectId: string;
  initialResources: Resource[];
  userCredits: number;
}

export function ProjectResourcesClient({
  projectId,
  initialResources,
  userCredits,
}: ProjectResourcesClientProps) {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [credits, setCredits] = useState(userCredits);

  useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  useEffect(() => {
    setCredits(userCredits);
  }, [userCredits]);

  // States for actions
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [streamingResources, setStreamingResources] = useState<Resource[]>([]);

  // New Resource Form
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState("link");

  // AI Generation Handler
  const handleGenerateResources = async () => {
    if (credits < 1) {
      eventBus.emit(EVENTS.OUT_OF_CREDITS);
      return;
    }

    setIsGenerating(true);
    setStreamingResources([]);
    toast.info("Buscando recursos con IA...");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/resources/stream`,
        {
          method: "POST",
        },
      );

      if (response.status === 402) {
        eventBus.emit(EVENTS.OUT_OF_CREDITS);
        return;
      }
      if (!response.ok) throw new Error(response.statusText);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        fullText += text;

        // Parse for preview
        const parsed = fullText
          .split("\n")
          .filter((line) => line.trim().startsWith("- "))
          .map((line, idx) => {
            const content = line.trim().substring(2).trim();
            const linkMatch = content.match(/\[(.*?)\]\((.*?)\)/);

            let title = content;
            let url = null;
            let type = "link";

            if (linkMatch) {
              title = linkMatch[1];
              url = linkMatch[2];
              const typeMatch = content
                .replace(linkMatch[0], "")
                .match(/-\s*(\w+)$/);
              if (typeMatch) type = typeMatch[1].toLowerCase();
            } else {
              const parts = content.split(" - ");
              title = parts[0];
              if (parts.length > 1)
                type = parts[parts.length - 1].toLowerCase();
            }

            return {
              id: `streaming-${idx}`,
              title,
              type,
              url,
            };
          });
        setStreamingResources(parsed);
      }

      setCredits((prev) => Math.max(0, prev - 1));
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      toast.success("Recursos generadas exitosamente.");

      // Wait a moment for server background task to complete DB save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStreamingResources([]);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Create Resource Handler
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const result = await createResourceAction(
        projectId,
        newTitle,
        newUrl,
        newType,
      );
      if (result.success) {
        setNewTitle("");
        setNewUrl("");
        setNewType("link");
        toast.success("Recurso añadido.");
        router.refresh();
      } else {
        toast.error(result.error || "Error al añadir recurso.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado.");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete Resource Handler
  const handleDeleteResource = async (resourceId: string) => {
    // Optimistic update
    const resourceToDelete = resources.find((r) => r.id === resourceId);
    setResources((prev) => prev.filter((r) => r.id !== resourceId));

    try {
      const result = await deleteResourceAction(resourceId);
      if (!result.success) {
        if (resourceToDelete)
          setResources((prev) => [...prev, resourceToDelete]);
        toast.error("Error al eliminar recurso.");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      if (resourceToDelete) setResources((prev) => [...prev, resourceToDelete]);
      toast.error("Error al eliminar.");
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "tool":
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case "file":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <LinkIcon className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
            Recursos y Herramientas
          </h2>
          <p className="text-muted-foreground text-sm">
            Documentación, librerías y enlaces útiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="flex font-mono items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-primary/10">
            <Sparkles className="h-4 w-4 " />
            <span className="font-medium text-sm">
              Créditos disponibles: {credits}
            </span>
          </Badge>
          <Button
            onClick={handleGenerateResources}
            disabled={isGenerating || credits < 1}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Sugerir Recursos
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Resources List Column */}
        <div className="md:col-span-3 space-y-4">
          {/* Create Resource Form */}
          <Card className="bg-card/50 backdrop-blur border-primary/10 shadow-sm">
            <CardContent className="py-0">
              <form
                onSubmit={handleCreateResource}
                className="flex flex-col gap-3 items-end"
              >
                <div className="flex-1 w-full space-y-2">
                  <Input
                    placeholder="Título del recurso..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-background/50 border-primary/20"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full space-y-2">
                  <Input
                    placeholder="URL (opcional)..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-background/50 border-primary/20"
                  />

                  <div className="w-[160px]">
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger className="w-full bg-background/50 border-primary/20">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Enlace</SelectItem>
                        <SelectItem value="tool">Herramienta</SelectItem>
                        <SelectItem value="file">Archivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={isCreating || !newTitle.trim()}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resources Display */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isGenerating &&
              streamingResources.length > 0 &&
              streamingResources.map((resource) => (
                <div
                  key={resource.id}
                  className="relative flex flex-col p-4 rounded-lg border bg-primary/5 border-primary/20 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-2 opacity-70">
                    <div className="p-2 rounded-md bg-muted/50">
                      {getIconForType(resource.type)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground/80 mb-1 truncate">
                    {resource.title}
                  </h3>
                  {resource.url && (
                    <span className="text-xs text-muted-foreground mt-auto truncate opacity-70">
                      {resource.url}
                    </span>
                  )}
                </div>
              ))}
            {resources.length === 0 && !isGenerating ? (
              <div className="col-span-full text-center py-10 opacity-50">
                <div className="inline-block p-3 rounded-full bg-muted mb-2">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <p>No hay recursos guardados.</p>
              </div>
            ) : (
              resources.map((resource) => (
                <div
                  key={resource.id}
                  className="group relative flex flex-col p-4 rounded-lg border bg-card border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-md bg-muted/50">
                      {getIconForType(resource.type)}
                    </div>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-all"
                      aria-label="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    className="font-semibold text-foreground mb-1 truncate"
                    title={resource.title}
                  >
                    {resource.title}
                  </h3>

                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-auto overflow-hidden"
                    >
                      <span className="truncate">{resource.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-auto">
                      Sin URL
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
