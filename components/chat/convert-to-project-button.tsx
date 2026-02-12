"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConvertToProjectButtonProps {
  chatId: string;
  onConvert?: (projectId: string) => void;
}

export default function ConvertToProjectButton({
  chatId,
  onConvert,
}: ConvertToProjectButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/projects/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaChatId: chatId,
          deleteOriginalChat: false, // No eliminar el chat original
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        if (res.status === 403) {
          toast.error("Has alcanzado el límite de 10 proyectos");
        } else {
          toast.error(data.error || "Error al convertir a proyecto");
        }
        return;
      }

      const data = await res.json();
      toast.success("¡Idea convertida a proyecto!");

      // Navegar al proyecto o ejecutar callback
      if (onConvert) {
        onConvert(data.project.id);
      } else {
        router.push(`/project/${data.project.id}`);
      }
    } catch (error) {
      console.error("Error converting to project:", error);
      toast.error("Error al convertir a proyecto");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        Convertir a Proyecto
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir Idea a Proyecto</DialogTitle>
            <DialogDescription>
              Esta acción creará un nuevo proyecto basado en esta idea. El chat
              original se mantendrá disponible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>El proyecto incluirá:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>El título de la idea</li>
              <li>La descripción generada por la IA</li>
              <li>El stack sugerido (si está disponible)</li>
              <li>El contexto de la conversación</li>
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConvert} disabled={isLoading}>
              {isLoading ? "Convirtiendo..." : "Convertir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
