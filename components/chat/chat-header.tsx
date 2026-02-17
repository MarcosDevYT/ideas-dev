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
  renameIdeaChatAction,
  deleteIdeaChatAction,
  toggleIdeaChatPinAction,
} from "@/actions/ideas/chat-actions";
import { eventBus, EVENTS } from "@/lib/events";

interface ChatHeaderProps {
  chatId: string;
  initialTitle: string;
  initialIsPinned: boolean;
}

export function ChatHeader({
  chatId,
  initialTitle,
  initialIsPinned,
}: ChatHeaderProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [isPinned, setIsPinned] = useState(initialIsPinned);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Rename
  const handleRename = async () => {
    if (!newTitle.trim()) return;

    const result = await renameIdeaChatAction(chatId, newTitle);
    if (result.success) {
      setTitle(newTitle);
      setIsRenameDialogOpen(false);
      toast.success("Chat renombrado correctamente");
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
    } else {
      toast.error("Error al renombrar el chat");
    }
  };

  // Handle Pin/Unpin
  const handleTogglePin = async () => {
    // Optimistic update
    const previousState = isPinned;
    setIsPinned(!previousState);

    const result = await toggleIdeaChatPinAction(chatId);
    if (result.success) {
      toast.success(result.data?.isPinned ? "Chat fijado" : "Chat desfijado");
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
    } else {
      setIsPinned(previousState);
      toast.error("Error al actualizar el estado");
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteIdeaChatAction(chatId);

    if (result.success) {
      toast.success("Chat eliminado");
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      router.push("/"); // Redirect to home/dashboard
    } else {
      setIsDeleting(false);
      toast.error("Error al eliminar el chat");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full border-b px-6 py-3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <h1 className="text-lg font-semibold truncate max-w-[300px] md:max-w-md">
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
                <span className="sr-only">Opciones del chat</span>
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
                    Desfijar chat
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-4 w-4" />
                    Fijar chat
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
                Eliminar chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar Chat</DialogTitle>
            <DialogDescription>
              Elige un nuevo nombre para identificar este chat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nombre del chat"
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
