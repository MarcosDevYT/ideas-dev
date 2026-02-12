"use client";

import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ChatMessage } from "./chat-message";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
}

export function ChatMessagesList({
  messages,
  isLoading = false,
  isStreaming = false,
}: ChatMessagesListProps) {
  const { containerRef, scrollToBottom } = useChatScroll();

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto w-full">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            isStreaming={isStreaming && index === messages.length - 1}
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
