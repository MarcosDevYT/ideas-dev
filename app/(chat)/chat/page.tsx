import { ChatLayout } from "@/components/layout/chat-layout";
import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Tu asistente de IA para desarrolladores. Genera y gestiona ideas y proyectos tecnológicos con memoria continua.",
  robots: { index: false, follow: false }, // Página autenticada
  openGraph: {
    title: "IdeasDev Chat",
    description: "Tu asistente de IA para desarrolladores.",
    images: [
      {
        url: "/chat-opengraph.png",
        width: 1200,
        height: 630,
        alt: "IdeasDev Chat",
      },
    ],
  },
};

async function ChatDataWrapper() {
  const session = await auth();
  const user = session?.user;
  return <ChatLayout user={user as UserWithDetails} />;
}

function LoadingChat() {
  return (
    <section className="flex flex-col h-full items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-muted-foreground">Preparando tu entorno...</p>
    </section>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingChat />}>
      <ChatDataWrapper />
    </Suspense>
  );
}
