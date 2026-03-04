import { CheckCircle2 } from "lucide-react";
import { Container } from "../container";

export const TargetAudience = () => {
  return (
    <Container className="w-full overflow-hidden relative">
      {/* Background Decorativo */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full -z-10 opacity-70" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-syne font-black tracking-tight">
              Diseñado para los que{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-syne font-black">
                construyen
              </span>
              .
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              Si sos developer, sabés lo difícil que es pasar de la idea al
              primer commit. IdeasDev elimina el síndrome del lienzo en blanco.
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">
                    Developers buscando Side Projects
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Validá ideas rápido y armá proyectos que destaquen en tu
                    portfolio o se vuelvan SaaS reales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">
                    Estudiantes IT & Junior Devs
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Practicá nuevas tecnologías con enfoques del mundo real,
                    guiado por una IA que entiende tu seniority.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">
                    Equipos & Startups
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Ideación ágil de nuevas features y herramientas internas
                    centralizada en un solo entorno.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Tarjeta tipo mock UI */}
            <div className="rounded-3xl border border-secondary/20 bg-card/60 backdrop-blur-3xl shadow-2xl overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-muted/40">
                <div className="h-3 w-3 rounded-full bg-destructive/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-primary/80" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  projects/collab-flow
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center font-bold text-primary text-xs">
                    ID
                  </div>
                  <div className="space-y-4 flex-1">
                    <p className="text-sm font-medium leading-relaxed">
                      Te propongo un stack completo y moderno que escala bien
                      para real-time collaboration:
                    </p>
                    {/* Mock de IdeaMessageCard */}
                    <div className="w-full rounded-xl border border-border/50 border-l-4 border-l-primary shadow-sm bg-card/90 p-5 space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full border border-border/50 bg-background/50 text-[10px] uppercase font-bold text-foreground">
                          web
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] uppercase font-bold">
                          alta
                        </span>
                      </div>
                      <h5 className="text-lg font-bold text-primary leading-tight">
                        CollabFlow - Real-time Collaborative Workspace
                      </h5>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Aplicación web tipo Google Docs + Trello donde múltiples
                        usuarios pueden editar documentos, comentar, mover
                        tarjetas y chatear en tiempo real. Incluye sistema de
                        presencia (avatares, cursores), historial de cambios y
                        permisos por rol.
                      </p>
                      <div className="pt-3 border-t border-border/50 mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded bg-background text-[10px] text-muted-foreground border border-border/50">
                          Next.js 14
                        </span>
                        <span className="px-2 py-1 rounded bg-background text-[10px] text-muted-foreground border border-border/50">
                          TypeScript
                        </span>
                        <span className="px-2 py-1 rounded bg-background text-[10px] text-muted-foreground border border-border/50">
                          Socket.io
                        </span>
                        <span className="px-2 py-1 rounded bg-background text-[10px] text-muted-foreground border border-border/50">
                          Yjs
                        </span>
                        <span className="px-2 py-1 rounded bg-background text-[10px] text-muted-foreground border border-border/50">
                          PostgreSQL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
