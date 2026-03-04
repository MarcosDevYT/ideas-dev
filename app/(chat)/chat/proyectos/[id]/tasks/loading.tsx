import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingTasks() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6 bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Plan de Acción
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona las tareas necesarias para construir tu proyecto.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48 rounded-full hidden sm:block" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Skeleton className="h-11 flex-1 rounded-md" />
        <Skeleton className="h-11 w-32 rounded-md" />
      </div>

      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="shadow-sm border-border/50">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-6 w-6 rounded-md shrink-0" />
                <Skeleton className="h-5 w-3/4 sm:w-1/2" />
              </div>
              <div className="flex items-center gap-4 self-end sm:self-auto ml-10 sm:ml-0">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
