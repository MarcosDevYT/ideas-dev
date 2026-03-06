"use client";

import { useState } from "react";
import { Lightbulb, Rocket, Sparkles } from "lucide-react";
import { LogoComponent } from "../LogoComponent";
import { Card, CardContent } from "../ui/card";
import { ChatInput } from "../chat/chat-input";
import { UserWithDetails } from "@/types/user-types";
import { useRouter } from "next/navigation";
import { createIdeaChatAction } from "@/actions/ideas/chat-actions";
import { toast } from "sonner";

const suggestions = [
  {
    icon: Lightbulb,
    title: "Idea de Proyecto",
    description: "Genera una idea de SaaS innovadora",
    prompt: "Dame una idea para un SaaS B2B en el nicho de productividad",
  },
  {
    icon: Rocket,
    title: "Stack Tecnológico",
    description: "Recomendación de tecnologías",
    prompt: "Recomiéndame un stack para una app de real-time collaboration",
  },
  {
    icon: Sparkles,
    title: "Plan de Aprendizaje",
    description: "Ruta para aprender una tecnología",
    prompt: "Crea un plan de estudio para aprender Next.js en 2 semanas",
  },
];

export const ChatLayout = ({ user }: { user: UserWithDetails | null }) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para usar el chat");
      return;
    }

    setIsPending(true);

    try {
      const result = await createIdeaChatAction({
        userId: user.id,
        title: message.slice(0, 50),
        initialMessage: message,
      });

      if (result.success && result.data) {
        router.push(`/chat/ideas/${result.data.id}`);
      } else {
        toast.error("Error al crear el chat");
        setIsPending(false);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error inesperado al crear el chat");
      setIsPending(false);
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">
              {user?.name ? `Hola, ${user.name}` : "Bienvenido a"}
            </h1>
          </div>

          <LogoComponent className="text-5xl justify-center" />
          <p className="text-lg text-muted-foreground">
            Tu asistente de IA para generar y desarrollar ideas de proyectos
            tecnológicos. Inicia una conversación para comenzar.
          </p>
        </div>

        {/* Suggestion Cards */}
        <div className="hidden lg:grid grid-cols-3 gap-4 w-full max-w-4xl">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Card
                key={index}
                className={`py-3 group transition-all hover:shadow-lg hover:border-primary/50 ${isPending ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                onClick={() =>
                  !isPending && handleSendMessage(suggestion.prompt)
                }
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-sm">
                        {suggestion.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <div className="pl-11">
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      &ldquo;{suggestion.prompt}&rdquo;
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p>
            💡 <strong>Tip:</strong> Puedes personalizar tus respuestas
            configurando tu stack tecnológico y rol en tu perfil.
          </p>
        </div>
      </div>

      <div className="w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder={
            isPending
              ? "Preparando tu chat..."
              : "Escribe tu mensaje para comenzar..."
          }
          credits={user?.credits}
          disabled={isPending}
        />
      </div>
    </section>
  );
};
