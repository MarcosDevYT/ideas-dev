"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renameIdeaChatAction } from "@/actions/chat-actions";
import { renameProjectAction } from "@/actions/project-actions";
import { toast } from "sonner";
import { eventBus, EVENTS } from "@/lib/events";

interface RenameChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  currentTitle: string;
  type: "chat" | "project";
}

export function RenameChatDialog({
  open,
  onOpenChange,
  itemId,
  currentTitle,
  type,
}: RenameChatDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    if (!title.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    setIsLoading(true);

    const result =
      type === "chat"
        ? await renameIdeaChatAction(itemId, title)
        : await renameProjectAction(itemId, title);

    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `${type === "chat" ? "Chat" : "Proyecto"} renombrado exitosamente`,
      );
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            Renombrar {type === "chat" ? "Chat" : "Proyecto"}
          </DialogTitle>
          <DialogDescription>
            Ingresa un nuevo nombre para este{" "}
            {type === "chat" ? "chat" : "proyecto"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Ingresa el título del ${type === "chat" ? "chat" : "proyecto"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRename} disabled={isLoading}>
            {isLoading ? "Renombrando..." : "Renombrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
