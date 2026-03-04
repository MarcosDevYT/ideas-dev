import { TrendingUp, History, Coins, Code2 } from "lucide-react";
import { Container } from "../container";

export const StatsSection = () => {
  return (
    <Container className="flex flex-col items-center justify-center text-center">
      <h2 className="text-xl md:text-2xl font-syne font-bold text-foreground mb-8">
        Arrancá con la mejor estructura para tu stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-muted-foreground animate-in fade-in duration-700 delay-500">
        <div className="flex flex-col items-center p-6 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors">
          <div className="p-3 bg-primary/10 rounded-2xl mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl md:text-3xl font-syne font-black text-foreground mb-2">
            IA
          </span>
          <span className="text-sm font-medium">
            Asistente Copilot para armar todo el scaffolding.
          </span>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors">
          <div className="p-3 bg-secondary/10 rounded-2xl mb-4">
            <History className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-2xl md:text-3xl font-syne font-black text-foreground mb-2">
            Memoria
          </span>
          <span className="text-sm font-medium">
            Tus proyectos vivos no pierden nunca el contexto.
          </span>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors">
          <div className="p-3 bg-green-500/10 rounded-2xl mb-4">
            <Coins className="h-6 w-6 text-green-500" />
          </div>
          <span className="text-2xl md:text-3xl font-syne font-black text-foreground mb-2">
            Créditos
          </span>
          <span className="text-sm font-medium">
            Gestión inteligente. 50 recargados gratis al mes.
          </span>
        </div>
        <div className="flex flex-col items-center p-6 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors">
          <div className="p-3 bg-purple-500/10 rounded-2xl mb-4">
            <Code2 className="h-6 w-6 text-purple-500" />
          </div>
          <span className="text-2xl md:text-3xl font-syne font-black text-foreground mb-2">
            Full Stack
          </span>
          <span className="text-sm font-medium">
            Frontend, Backend y DevOps unificados en tu proyecto.
          </span>
        </div>
      </div>
    </Container>
  );
};
