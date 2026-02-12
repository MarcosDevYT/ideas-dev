"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UserWithDetails } from "@/types/user-types";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  user?: UserWithDetails | null;
  credits?: number;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Escribe tu mensaje...",
  maxLength = 2000,
  user,
  credits: propCredits,
}: ChatInputProps) {
  const credits = propCredits ?? user?.credits ?? 0;
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    if (!user && propCredits === undefined) {
      toast.error("Debes iniciar sesión para enviar mensajes");
      return;
    }

    if (credits < 1) {
      toast.error("No tienes créditos suficientes");
      return;
    }

    const messageToSend = message.trim();
    setMessage("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsMultiline(false);

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restaurar mensaje en caso de error
      setMessage(messageToSend);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;

    // Detectar si hay más de una línea (asumiendo altura base ~24px)
    setIsMultiline(newHeight > 24);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div
        className={cn(
          "bg-[#cfdbec] dark:bg-[#0c1118] rounded-[26px] border border-border/50",
          isMultiline ? "relative pb-10 block" : "flex items-center p-2",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Botón Plus (Izquierda) */}
        <div
          className={cn(
            "flex items-center",
            isMultiline ? "absolute left-3 bottom-2 z-10" : "",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            disabled={disabled || isLoading}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Área de Texto */}
        <div
          className={cn(
            "min-w-0",
            isMultiline ? "w-full px-4 pt-3" : "flex-1 px-2",
          )}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            rows={1}
            className={cn(
              "w-full bg-transparent dark:bg-transparent border-none focus-visible:ring-0 resize-none text-foreground placeholder:text-muted-foreground p-0 px-2 text-[15px] leading-relaxed",
              "min-h-[24px] max-h-[200px]",
            )}
            style={{ height: "auto" }}
          />
        </div>

        {/* Botones Acción (Derecha/Abajo) */}
        <div
          className={cn(
            "flex items-center gap-1.5",
            isMultiline ? "absolute right-3 bottom-2 z-10" : "pt-0.5",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            disabled={disabled || isLoading}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || isLoading}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200 shrink-0",
              message.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <ArrowUp className="h-5 w-5" strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div className="bg-background pt-2 pb-1 text-center text-[10px] text-muted-foreground">
        IdeasDev puede cometer errores. Considera verificar la información
        importante.
      </div>
    </div>
  );
}
