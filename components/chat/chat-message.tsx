"use client";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { IdeaMessageCard } from "./idea-message-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
  chatContext?: "idea" | "project";
}

export function ChatMessage({
  role,
  content,
  timestamp,
  isStreaming = false,
  chatContext = "idea",
}: ChatMessageProps) {
  const isUser = role === "user";

  // Lógica para detectar y parsear JSON
  let ideaData: unknown[] | null = null;
  let errorMessage: string | null = null;
  let isGeneratingJson = false;

  if (!isUser) {
    // Si está haciendo streaming y no hay contenido, asumimos que está generando
    if (isStreaming && !content.trim()) {
      isGeneratingJson = true;
    }

    // 1. Limpieza robusta del contenido
    // Eliminamos bloques de código markdown (```json ... ```) y espacios en blanco extra
    let cleanContent = content.trim();
    cleanContent = cleanContent
      .replace(/^```json\s*/i, "") // Elimina ```json al inicio (case insensitive) y salto de linea
      .replace(/^```\s*/, "") // Elimina ``` genérico al inicio
      .replace(/\s*```$/, "") // Elimina ``` al final
      .trim(); // Trim final para asegurar limpieza

    // 2. Detección de intención JSON
    const startsWithJson =
      cleanContent.startsWith("{") || cleanContent.startsWith("[");

    if (startsWithJson) {
      try {
        const parsed = JSON.parse(cleanContent);

        // NUEVA LÓGICA: Detección de estructura mixta { message, ideas }
        if (
          !Array.isArray(parsed) &&
          parsed.message &&
          Array.isArray(parsed.ideas)
        ) {
          // Caso 0: Respuesta mixta (Texto + Ideas)
          if (parsed.ideas.length > 0) {
            ideaData = parsed.ideas;
          }
          // El mensaje de texto se renderizará siempre si existe
          // Reemplazamos el contenido original con el mensaje parseado para el renderizado de texto
          // Pero guardamos las ideas para renderizarlas después
          // UN PROBLEMILLA: content es prop, no state.
          // Solución: Usaremos una variable local para el texto a mostrar.
        } else if (Array.isArray(parsed)) {
          // Caso 1: Array de errores (Legacy o fallback)
          if (parsed.length > 0 && parsed[0].error && parsed[0].mensaje) {
            errorMessage = parsed[0].mensaje;
          }
          // Caso 2: Array de ideas válido (Legacy)
          else if (parsed.length > 0 && parsed[0].nombre) {
            ideaData = parsed;
          }
        } else if (typeof parsed === "object" && parsed !== null) {
          // Caso 3: Objeto único (legacy o error simple)
          if (parsed.nombre) {
            ideaData = [parsed];
          } else if (parsed.error && parsed.mensaje) {
            errorMessage = parsed.mensaje;
          }
        }
      } catch {
        // Parseo fallido
        if (isStreaming) {
          isGeneratingJson = true;
        }
      }
    }
  }

  // Helper para extraer el mensaje de texto si es un JSON mixto
  const getDisplayText = () => {
    if (isUser) return content;
    try {
      const clean = content
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
      if (clean.startsWith("{")) {
        const parsed = JSON.parse(clean);
        if (parsed.message) return parsed.message;
      }
    } catch {
      // Si falla parseo, retornamos content original (streaming o texto)
    }
    // Si hay ideas y no es mixto (legacy array), no mostramos texto, solo cards.
    // Pero si estamos testeando el nuevo formato, asumimos que si hay ideaData (legacy), el texto es el JSON raw, que no queremos mostrar.
    // Si ideaData existe Y NO es mixto, devolvemos null?
    if (ideaData && !content.includes('"message":')) return null;

    return content;
  };

  const displayText = getDisplayText();

  return (
    <div
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[95%] md:max-w-[85%]", // Más ancho para las cards
          isUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Container */}
        <div
          className={cn(
            "rounded-2xl transition-all duration-200",
            isUser
              ? "bg-accent text-accent-foreground rounded-tr-sm px-5 py-3 shadow-sm"
              : ideaData
                ? "bg-transparent p-0 w-full shadow-none border-none"
                : isGeneratingJson
                  ? "bg-transparent p-0 w-full shadow-none border-none"
                  : errorMessage
                    ? "bg-destructive/10 border border-destructive/20 rounded-tl-sm px-5 py-3 shadow-sm text-destructive"
                    : "bg-accent/80 dark:bg-accent/30 text-foreground border border-border/10 rounded-tl-sm px-5 py-3 shadow-sm",
          )}
        >
          {/* Metadata */}
          {!ideaData && !isGeneratingJson && !errorMessage && (
            <div
              className={cn(
                "flex items-center gap-2 mb-1.5 text-sm opacity-70",
                isUser
                  ? "justify-end text-primary"
                  : "justify-start text-secondary",
              )}
            >
              <span className="font-medium">
                {isUser ? "Tú" : "IdeasDev AI"}
              </span>
              {timestamp && (
                <span>
                  {timestamp.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <div className="text-sm leading-relaxed overflow-hidden space-y-4">
            {/* Texto (Usuario o Asistente Message) */}
            {displayText &&
              (isUser ? (
                <p className="whitespace-pre-wrap">{displayText}</p>
              ) : (
                <div
                  className={cn(
                    // "prose" classes removed here, handled by MarkdownRenderer
                    "max-w-none",
                    // Si hay ideas, le damos estilo de "mensaje introductorio"
                    ideaData
                      ? "bg-accent/30 p-4 rounded-xl mb-4 border border-border/10"
                      : "",
                  )}
                >
                  <MarkdownRenderer content={displayText} />
                  {isStreaming && !ideaData && (
                    <span className="inline-block w-2 h-4 ml-1 bg-primary/50 animate-pulse align-middle" />
                  )}
                </div>
              ))}

            {/* Tarjetas de Ideas (Si existen) */}
            {ideaData && (
              <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
                {ideaData.map((idea, idx) => (
                  <IdeaMessageCard key={idx} data={idea as any} />
                ))}
              </div>
            )}

            {/* Mensaje de Error */}
            {errorMessage ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="font-medium">{errorMessage}</p>
              </div>
            ) : null}

            {/* Estado Loading (Skeleton) - Solo si NO hay datos aun */}
            {isGeneratingJson && !ideaData && !displayText && (
              <>
                {chatContext === "idea" ? (
                  // Estado de carga "Generando Idea" (Card Skeleton)
                  <div className="w-full max-w-2xl space-y-4 p-4 border rounded-xl bg-card/50 backdrop-blur-sm border-primary/20 animate-pulse">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20 rounded-full bg-primary/20" />
                        <Skeleton className="h-5 w-24 rounded-full bg-secondary/20" />
                      </div>
                      <Skeleton className="h-8 w-3/4 bg-primary/10" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      <span className="text-xs font-medium text-primary">
                        Generando Idea...
                      </span>
                    </div>
                  </div>
                ) : (
                  // Estado de carga "Escribiendo..." (Text Skeleton)
                  <div className="flex items-center space-x-2 p-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs font-medium text-muted-foreground animate-pulse">
                      Generando Respuesta...
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
