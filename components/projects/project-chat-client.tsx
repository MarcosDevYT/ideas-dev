"use client";

import { useState, useEffect } from "react";
import { ChatMessagesList } from "@/components/chat/chat-messages-list";
import { ChatInput } from "@/components/chat/chat-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { eventBus, EVENTS } from "@/lib/events";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ProjectChatClientProps {
  initialMessages: Message[];
  projectId: string;
  userCredits?: number;
}

export const ProjectChatClient = ({
  initialMessages,
  projectId,
  userCredits,
}: ProjectChatClientProps) => {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(userCredits);

  // Escuchar actualizaciones de créditos
  useEffect(() => {
    // Si userCredits cambia desde las props (ej: server action revalidate), lo actualizamos
    setCredits(userCredits);
  }, [userCredits]);

  const handleGenerateResponse = async (content: string) => {
    setIsLoading(true);

    try {
      // Prepare IDs
      const assistantMsgId = `assistant-${Date.now()}`;
      const currentTimestamp = new Date();

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: currentTimestamp,
      };

      // Optimistic update
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          timestamp: currentTimestamp,
        },
      ]);

      // Prepare request body
      const body = {
        message: content,
        projectId: projectId,
      };

      // Fetch API
      const response = await fetch("/api/projects/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 403) {
        toast.error("No tienes suficientes créditos");
        // Remover los mensajes optimistas si falla por créditos
        setMessages((prev) =>
          prev.filter(
            (msg) => msg.id !== userMessage.id && msg.id !== assistantMsgId,
          ),
        );
        return;
      }

      if (!response.ok) throw new Error("Error en la petición");
      if (!response.body) throw new Error("No body");

      // Prepare streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantContent += text;

        // Actualizar mensaje del asistente en tiempo real
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: assistantContent }
              : msg,
          ),
        );
      }

      // Emit event to update credits and sidebar
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      // Actualizar créditos locales (optimista o esperar revalidate)
      if (credits !== undefined) {
        setCredits(credits - 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generando respuesta");
    } finally {
      setIsLoading(false);
      router.refresh(); // Refrescar para obtener datos actualizados del servidor si es necesario
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="flex flex-col flex-1 pb-8 overflow-y-auto pt-56 md:pt-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 space-y-6">
            <div className="flex flex-col items-center space-y-3 text-center max-w-2xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                ¡Comienza a desarrollar tu proyecto!
              </h2>
              <p className="text-muted-foreground text-base">
                Aquí puedes resolver dudas, plantear problemas o consultar
                cualquier aspecto de tu proyecto. La IA te ayudará en cada paso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl mt-4">
              <button
                onClick={() =>
                  handleGenerateResponse(
                    "¿Cómo debería estructurar mi proyecto?",
                  )
                }
                disabled={isLoading || (credits !== undefined && credits <= 0)}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all text-left space-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  📁 Estructura del proyecto
                </div>
                <div className="text-xs text-muted-foreground">
                  Obtén recomendaciones sobre cómo organizar tu código
                </div>
              </button>

              <button
                onClick={() =>
                  handleGenerateResponse(
                    "¿Qué tecnologías me recomiendas para este proyecto?",
                  )
                }
                disabled={isLoading || (credits !== undefined && credits <= 0)}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all text-left space-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  🛠️ Stack tecnológico
                </div>
                <div className="text-xs text-muted-foreground">
                  Descubre las mejores herramientas para tu proyecto
                </div>
              </button>

              <button
                onClick={() =>
                  handleGenerateResponse(
                    "¿Cuáles son los primeros pasos que debería seguir?",
                  )
                }
                disabled={isLoading || (credits !== undefined && credits <= 0)}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all text-left space-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  🚀 Primeros pasos
                </div>
                <div className="text-xs text-muted-foreground">
                  Guía para comenzar tu desarrollo paso a paso
                </div>
              </button>

              <button
                onClick={() =>
                  handleGenerateResponse(
                    "¿Qué desafíos técnicos podría enfrentar?",
                  )
                }
                disabled={isLoading || (credits !== undefined && credits <= 0)}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all text-left space-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm group-hover:text-primary transition-colors">
                  ⚠️ Desafíos técnicos
                </div>
                <div className="text-xs text-muted-foreground">
                  Anticipa y prepárate para posibles obstáculos
                </div>
              </button>
            </div>
          </div>
        ) : (
          <ChatMessagesList
            messages={messages}
            isLoading={isLoading}
            isStreaming={isLoading}
          />
        )}
      </div>

      <div className="w-full">
        <ChatInput
          onSendMessage={handleGenerateResponse}
          disabled={isLoading || (credits !== undefined && credits <= 0)}
          credits={credits}
          placeholder="Describe tu proyecto o pide ayuda..."
        />
      </div>
    </div>
  );
};
