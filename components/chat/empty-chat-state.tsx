import { LogoComponent } from "@/components/LogoComponent";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Rocket, Sparkles } from "lucide-react";

interface EmptyChatStateProps {
  userName?: string | null;
  onSuggestionClick?: (prompt: string) => void;
}

export function EmptyChatState({
  userName,
  onSuggestionClick,
}: EmptyChatStateProps) {
  const suggestions = [
    {
      icon: Lightbulb,
      title: "Generar ideas de proyectos",
      description: "Crea ideas innovadoras para tu próximo proyecto",
      prompt: "Dame 3 ideas de proyectos web innovadores",
    },
    {
      icon: Rocket,
      title: "Explorar tecnologías",
      description: "Descubre nuevas herramientas y frameworks",
      prompt: "Qué tecnologías debería aprender para backend moderno",
    },
    {
      icon: Sparkles,
      title: "Optimización Pro",
      description: "Refactoriza y mejora tu código existente",
      prompt: "Ayúdame a optimizar este código: [pega tu código aquí]",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-bold">
            {userName ? `Hola, ${userName}` : "Bienvenido a"}
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
              onClick={() => onSuggestionClick?.(suggestion.prompt)}
              className="py-3 group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
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
  );
}
