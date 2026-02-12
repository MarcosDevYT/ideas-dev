import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto min-h-0 pt-6 pb-4">
        <div className="mx-auto max-w-4xl w-full px-4 py-8 space-y-8">
          {/* Mensaje Simulado del Asistente (Skeleton) */}
          <div className="flex w-full justify-end">
            <div className="flex max-w-[85%] w-full flex-row">
              <div className="bg-accent/30 rounded-tl-sm px-5 py-3 shadow-sm rounded-2xl w-full border border-border/10">
                {/* Metadata Skeleton */}
                <div className="flex items-center gap-2 mb-3 opacity-70">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
                {/* Content Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <div className="h-2"></div>
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Input (Skeleton) */}
      <div className="w-full pb-6 pt-2 px-4 bg-background">
        <div className="mx-auto max-w-4xl relative">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
