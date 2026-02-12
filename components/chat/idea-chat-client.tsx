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
  userId,
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
      // Prepare IDs
      const assistantMsgId = `assistant-${Date.now()}`;
      const currentTimestamp = new Date();

      if (!isAutoTrigger) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content,
          timestamp: currentTimestamp,
        };

        // Optimistic update: Agregamos AMBOS mensajes de inmediato
        // El mensaje del asistente vacío activará el Skeleton en ChatMessage
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
          chatId: chatId,
          generateOnly: false,
        };

        // Fetch API
        const response = await fetch("/api/ideas/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

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
        }

        // Una vez completado el stream, actualizamos el mensaje
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: assistantContent }
              : msg,
          ),
        );
      } else {
        // Handle Auto-Trigger logic
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMsgId,
            role: "assistant",
            content: "",
            timestamp: currentTimestamp,
          },
        ]);

        const body = {
          message: content,
          chatId: chatId,
          generateOnly: true,
        };

        const response = await fetch("/api/ideas/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Error en la petición");
        if (!response.body) throw new Error("No body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          assistantContent += text;
        }

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
    } catch (error) {
      console.error(error);
      toast.error("Error generating response");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <ChatHeader
        chatId={chatId}
        initialTitle={initialTitle}
        initialIsPinned={initialIsPinned}
        userId={userId}
      />

      <div className="flex flex-col flex-1 min-h-0 pb-4">
        <ChatMessagesList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isLoading}
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
