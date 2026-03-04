import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Sparkles, FileText } from "lucide-react";

export default function LoadingOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Resumen del Proyecto
          </h2>
          <p className="text-muted-foreground mt-1">
            Visión general, detalles de la idea y análisis por IA.
          </p>
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de la Idea
          </h3>
          <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card py-0 pb-6 border-primary/20 shadow-md md:col-span-2 overflow-hidden relative group">
          <CardHeader className="bg-muted/20 py-4 pt-8 border-b border-border/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-40 rounded-md hidden sm:block" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 min-h-[200px] space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
