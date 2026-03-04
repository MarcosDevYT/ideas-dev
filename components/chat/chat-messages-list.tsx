"use client";

import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ChatMessage } from "./chat-message";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatMessagesListProps {
  messages: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  chatContext?: "idea" | "project";
}

export function ChatMessagesList({
  messages,
  isLoading = false,
  isStreaming = false,
  chatContext = "idea",
}: ChatMessagesListProps) {
  const { containerRef, scrollToBottom } = useChatScroll();
  const [visibleCount, setVisibleCount] = useState(4);
  const prevLengthRef = useRef(messages.length);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      const diff = messages.length - prevLengthRef.current;
      setVisibleCount((prev) => prev + diff);
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (isInitialMount.current) {
      if (messages.length > 0) {
        scrollToBottom(false);
        // Pequeño delay para evitar que se dispare onScroll al renderizar de golpe
        setTimeout(() => {
          isInitialMount.current = false;
        }, 100);
      }
    } else {
      scrollToBottom(true);
    }
  }, [messages, scrollToBottom]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  const visibleMessages = messages.slice(-visibleCount);
  const hasMore = visibleCount < messages.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isInitialMount.current) return;

    const target = e.currentTarget;
    if (target.scrollTop < 10 && hasMore) {
      const previousScrollHeight = target.scrollHeight;

      setVisibleCount((prev) => Math.min(prev + 10, messages.length));

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop =
            containerRef.current.scrollHeight - previousScrollHeight;
        }
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto w-full"
      onScroll={handleScroll}
    >
      <div className="mx-auto max-w-4xl px-4 py-8">
        {hasMore && (
          <div className="flex justify-center mb-4">
            <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full shadow-sm">
              Desplázate hacia arriba para ver mensajes anteriores
            </span>
          </div>
        )}
        {visibleMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            isStreaming={isStreaming && index === visibleMessages.length - 1}
            chatContext={chatContext}
          />
        ))}

        {isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
