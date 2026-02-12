import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 space-y-8 min-h-0">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl w-full text-center">
          {/* Greeting */}
          <Skeleton className="h-9 w-64 rounded-lg" />

          {/* Logo Area */}
          <div className="py-2">
            <Skeleton className="h-14 w-48 rounded-xl" />
          </div>

          {/* Description */}
          <div className="space-y-2 w-full max-w-lg flex flex-col items-center pt-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>

        {/* Suggestion Cards Skeleton */}
        <div className="hidden lg:grid grid-cols-3 gap-4 w-full max-w-4xl pt-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="py-3 border-border/50 bg-card/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
                <div className="pl-13 pt-1">
                  <Skeleton className="h-3 w-2/3 ml-auto opacity-50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Hint Skeleton */}
        <div className="pt-8">
          <Skeleton className="h-4 w-72 rounded-full opacity-60" />
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="w-full pb-6 pt-2 px-4 bg-background">
        <div className="mx-auto max-w-4xl relative">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
