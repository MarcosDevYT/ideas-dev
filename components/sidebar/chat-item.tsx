"use client";

import { useState } from "react";
import { MoreVertical, Pin, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteIdeaChatAction,
  toggleIdeaChatPinAction,
} from "@/actions/chat-actions";
import {
  deleteProjectAction,
  toggleProjectPinAction,
} from "@/actions/project-actions";
import { RenameChatDialog } from "@/components/dialogs/rename-chat-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface ChatItemProps {
  id: string;
  title: string;
  isPinned: boolean;
  type: "chat" | "project";
  isActive?: boolean;
  isSheet?: boolean;
  onDelete?: (id: string, type: "chat" | "project") => void;
}

export function ChatItem({
  id,
  title,
  isPinned,
  type,
  isActive,
  isSheet,
  onDelete,
}: ChatItemProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePin = async () => {
    const result =
      type === "chat"
        ? await toggleIdeaChatPinAction(id)
        : await toggleProjectPinAction(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${isPinned ? "Desanclado" : "Anclado"} exitosamente`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Optimistic custom update
    if (onDelete) {
      onDelete(id, type);
    }

    const result =
      type === "chat"
        ? await deleteIdeaChatAction(id)
        : await deleteProjectAction(id);

    setIsDeleting(false);

    if (result.error) {
      toast.error(result.error);
      // Here we could revert the optimistic update if we had the state,
      // but strictly speaking, if it fails, a page refresh is needed.
      // For now, the user just wants the item gone.
    } else {
      toast.success(
        `${type === "chat" ? "Chat" : "Proyecto"} eliminado exitosamente`,
      );
    }
  };

  return (
    <>
      <div
        className={`group flex ${isSheet ? "flex-row-reverse gap-1" : "gap-2"} items-center p-0 rounded-[8px] hover:bg-accent transition-colors ${
          isActive ? "bg-accent" : ""
        }`}
      >
        <Link
          href={`/chat/${type === "chat" ? "ideas" : "proyectos"}/${id}`}
          className={`flex items-center gap-2 py-2.5 flex-1 min-w-0 ${isSheet ? "pr-2" : "pl-2"}`}
        >
          <span
            className={
              isSheet
                ? "text-sm truncate flex-1 max-w-[200px]"
                : "text-sm truncate flex-1 max-w-[220px]"
            }
          >
            {title}
          </span>
          {isPinned && <Pin className="size-3 shrink-0 text-primary" />}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={
                isSheet
                  ? "size-6 shrink-0"
                  : "size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              }
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
              <Edit2 className="size-4 mr-2" />
              Renombrar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTogglePin}>
              <Pin className="size-4 mr-2" />
              {isPinned ? "Desanclar" : "Anclar"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RenameChatDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        itemId={id}
        currentTitle={title}
        type={type}
      />
    </>
  );
}
