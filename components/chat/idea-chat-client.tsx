"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessagesList } from "@/components/chat/chat-messages-list";
import { ChatInput } from "@/components/chat/chat-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

import { generateIdeaResponseAction } from "@/actions/ideas/chat-actions";

import { ChatHeader } from "./chat-header";

import { eventBus, EVENTS } from "@/lib/events";

interface IdeaChatClientProps {
  initialMessages: Message[];
  chatId: string;
  userCredits?: number;
  initialTitle: string;
  initialIsPinned: boolean;
  userId: string;
}

export const IdeaChatClient = ({
  initialMessages,
  chatId,
  userCredits,
  initialTitle,
  initialIsPinned,
}: IdeaChatClientProps) => {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  const initializedRef = useRef(false);

  // Auto-generate response on mount if last message is from user
  useEffect(() => {
    if (initializedRef.current) return;

    const lastMessage = initialMessages[initialMessages.length - 1];
    if (lastMessage?.role === "user" && !isLoading) {
      initializedRef.current = true;
      handleGenerateResponse(lastMessage.content, true);
    }
  }, []);

  const handleGenerateResponse = async (
    content: string,
    isAutoTrigger: boolean = false,
  ) => {
    setIsLoading(true);

    try {
      const assistantMsgId = `assistant-${Date.now()}`;
      const currentTimestamp = new Date();

      // Si NO es autotrigger (es decir, el usuario acaba de escribir),
      // agregamos optimísticamente su mensaje y el placeholder del asistente.
      if (!isAutoTrigger) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content,
          timestamp: currentTimestamp,
        };

        setMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: assistantMsgId,
            role: "assistant", // "assistant"
            content: "", // Placeholder para loading state
            timestamp: currentTimestamp,
          },
        ]);
      } else {
        // Si ES autotrigger, solo agregamos el placeholder del asistente
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: currentTimestamp,
          },
        ]);
      }

      // Llamada al Server Action (NO STREAMING)
      const result = await generateIdeaResponseAction({
        message: content,
        chatId,
        generateOnly: isAutoTrigger,
      });

      if (result.error) {
        toast.error(result.error);
        // Podríamos eliminar el mensaje optimista aquí si falla
        return;
      }

      const assistantContent = result.response || "";

      // Actualizamos el mensaje del asistente con la respuesta completa
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, content: assistantContent }
            : msg,
        ),
      );

      // Emit event to update credits and sidebar
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
    } catch (error) {
      console.error(error);
      toast.error("Error generating response");
    } finally {
      setIsLoading(false);
      router.refresh(); // Actualiza datos del servidor (créditos, etc.)
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <ChatHeader
        chatId={chatId}
        initialTitle={initialTitle}
        initialIsPinned={initialIsPinned}
      />

      <div className="flex flex-col flex-1 min-h-0 pb-4">
        <ChatMessagesList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isLoading}
          chatContext="idea"
        />
      </div>

      <div className="w-full">
        <ChatInput
          onSendMessage={(msg) => handleGenerateResponse(msg, false)}
          disabled={isLoading}
          credits={userCredits}
          placeholder="Escribe tu mensaje..."
        />
      </div>
    </div>
  );
};
