"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Menu, Pencil, Trash2, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

interface ProjectHeaderMobileProps {
  projectId: string;
  initialTitle: string;
  initialIsPinned: boolean;
  userId: string;
}

const navItems = [
  {
    name: "Chat",
    href: "",
    exact: true,
  },
  {
    name: "Resumen",
    href: "/overview",
  },
  {
    name: "Tareas",
    href: "/tasks",
  },
  {
    name: "Recursos",
    href: "/resources",
  },
];

export function ProjectHeaderMobile({
  projectId,
  initialTitle,
  initialIsPinned,
}: ProjectHeaderMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState(initialTitle);
  const [isPinned, setIsPinned] = useState(initialIsPinned);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [isDeleting, setIsDeleting] = useState(false);

  const baseUrl = `/chat/proyectos/${projectId}`;

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
      router.push("/");
    } else {
      setIsDeleting(false);
      toast.error("Error al eliminar el proyecto");
    }
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-between w-full border-b px-4 py-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-[60px] z-10">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <h1 className="text-base font-semibold truncate text-foreground">
            {title}
          </h1>
          {isPinned && (
            <Pin className="h-3 w-3 text-muted-foreground rotate-45 shrink-0" />
          )}
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Menú del proyecto</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader className="px-4">
              <SheetTitle>Proyecto</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 mt-6 px-4">
              {/* Opciones del Proyecto */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Opciones
                </h3>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsSheetOpen(false);
                    setIsRenameDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Renombrar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleTogglePin();
                    setIsSheetOpen(false);
                  }}
                >
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
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    handleDelete();
                    setIsSheetOpen(false);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>

              {/* Navegación */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Navegación
                </h3>
                {navItems.map((item) => {
                  const href = `${baseUrl}${item.href}`;
                  const isActive = item.exact
                    ? pathname === href
                    : pathname.startsWith(href);

                  return (
                    <Link
                      key={item.name}
                      href={href}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Rename Dialog */}
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
