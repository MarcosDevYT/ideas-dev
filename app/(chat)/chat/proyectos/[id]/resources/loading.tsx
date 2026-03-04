import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingResources() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6 bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
            Recursos y Herramientas
          </h2>
          <p className="text-muted-foreground text-sm">
            Documentación, librerías y enlaces útiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48 rounded-full hidden sm:block" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-3 space-y-4">
          <Card className="bg-card/50 backdrop-blur border-primary/10 shadow-sm">
            <CardContent className="py-4">
              <div className="flex flex-col gap-3 items-end">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 w-[160px] rounded-md hidden sm:block" />
                  <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col p-4 rounded-lg border bg-card border-primary/10 shadow-sm h-32 justify-between"
              >
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
                <div className="space-y-2 mt-auto w-full">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
