"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  renameProjectAction,
  deleteProjectAction,
  toggleProjectPinAction,
} from "@/actions/project-actions";
import { eventBus, EVENTS } from "@/lib/events";

interface ProjectChatHeaderProps {
  projectId: string;
  initialTitle: string;
  initialIsPinned: boolean;
}

export function ProjectChatHeader({
  projectId,
  initialTitle,
  initialIsPinned,
}: ProjectChatHeaderProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [isPinned, setIsPinned] = useState(initialIsPinned);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Rename
  const handleRename = async () => {
    if (!newTitle.trim()) return;

    const result = await renameProjectAction(projectId, newTitle);
    if (result.success && result.data) {
      setTitle(result.data.title);
      setIsRenameDialogOpen(false);
      toast.success("Proyecto renombrado correctamente");
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
    } else {
      toast.error("Error al renombrar el proyecto");
    }
  };

  // Handle Pin/Unpin
  const handleTogglePin = async () => {
    // Optimistic update
    const previousState = isPinned;
    setIsPinned(!previousState);

    const result = await toggleProjectPinAction(projectId);
    if (result.success && result.data) {
      toast.success(
        result.data.isPinned ? "Proyecto fijado" : "Proyecto desfijado",
      );
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
    } else {
      setIsPinned(previousState);
      toast.error("Error al actualizar el estado");
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProjectAction(projectId);

    if (result.success) {
      toast.success("Proyecto eliminado");
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      router.push("/"); // Redirect to home/dashboard
    } else {
      setIsDeleting(false);
      toast.error("Error al eliminar el proyecto");
    }
  };

  return (
    <>
      <div className="hidden md:flex items-center justify-between w-full border-b px-6 py-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <h1 className="text-lg font-semibold truncate max-w-[300px] md:max-w-md text-foreground">
            {title}
          </h1>
          {isPinned && (
            <Pin className="h-3.5 w-3.5 text-muted-foreground rotate-45" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opciones del proyecto</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePin}>
                {isPinned ? (
                  <>
                    <PinOff className="mr-2 h-4 w-4" />
                    Desfijar
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-4 w-4" />
                    Fijar
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Proyecto</DialogTitle>
            <DialogDescription>
              Elige un nuevo nombre para identificar este proyecto.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nombre del proyecto"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleRename}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
