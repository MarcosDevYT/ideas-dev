import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full flex-col bg-background animate-in fade-in duration-500">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6 my-4 space-y-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left/Top Content */}
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            {/* Right/Bottom Content */}
            <div className="w-full md:w-1/3 space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
