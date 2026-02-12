import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { IdeaChatClient } from "@/components/chat/idea-chat-client";
import { getUserCredits } from "@/lib/credits";

export default async function ChatPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const chat = await prisma.ideaChat.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) {
    notFound();
  }

  // Map messages to client interface
  const initialMessages = chat.messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    timestamp: msg.createdAt,
  }));

  // Get credits
  const creditsRaw = await getUserCredits(session.user.id);
  const credits = creditsRaw === Infinity ? 999999 : creditsRaw;

  return (
    <IdeaChatClient
      initialMessages={initialMessages}
      chatId={chat.id}
      userCredits={credits}
      initialTitle={chat.title}
      initialIsPinned={chat.isPinned}
      userId={session.user.id}
    />
  );
}
