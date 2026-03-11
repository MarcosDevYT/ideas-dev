"use client";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";
import { IdeaMessageCard } from "./idea-message-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { sanitizeAndParseJson } from "@/lib/json-sanitizer";

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

  // State derived from parsed AI response
  let ideaData: unknown[] | null = null;
  let displayMessage: string | null = null;
  let errorMessage: string | null = null;
  let isGeneratingJson = false;

  if (!isUser) {
    if (isStreaming && !content.trim()) {
      isGeneratingJson = true;
    } else {
      // Use the robust sanitizer – handles code fences, mismatched brackets,
      // trailing commas, single quotes and more in up to 4 repair passes.
      const result = sanitizeAndParseJson(content);

      if (result) {
        const parsed = result.parsed as Record<string, unknown>;

        // --- Case A: Mixed response { message: string, ideas: [] } (primary format) ---
        if (
          !Array.isArray(parsed) &&
          typeof parsed.message === "string" &&
          Array.isArray(parsed.ideas)
        ) {
          displayMessage = parsed.message || null;
          if ((parsed.ideas as unknown[]).length > 0) {
            ideaData = parsed.ideas as unknown[];
          }
        }
        // --- Case B: Plain array of ideas (legacy) ---
        else if (Array.isArray(parsed)) {
          const arr = parsed as Record<string, unknown>[];
          if (arr.length > 0 && arr[0].error && arr[0].mensaje) {
            errorMessage = arr[0].mensaje as string;
          } else if (arr.length > 0 && arr[0].nombre) {
            ideaData = arr;
          }
        }
        // --- Case C: Single idea object (legacy) ---
        else if (parsed && typeof parsed === "object") {
          if (parsed.nombre) {
            ideaData = [parsed];
          } else if (parsed.error && parsed.mensaje) {
            errorMessage = parsed.mensaje as string;
          }
        }
      } else {
        // Could not parse at all – during streaming treat as loading, otherwise show raw text
        if (isStreaming) {
          isGeneratingJson = true;
        }
        // If not streaming, displayMessage falls through to the raw content below.
      }
    }
  }

  // Final display text: prefer the extracted `message` field; fall back to raw content
  // for non-JSON assistant responses (plain text, markdown, etc.).
  const displayText: string | null = isUser
    ? content
    : (displayMessage ??
      // Only show raw content when there are no parsed ideas (legacy pure-array case)
      (ideaData ? null : content));

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
                  <IdeaMessageCard key={idx} data={idea as Parameters<typeof IdeaMessageCard>[0]["data"]} />
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
