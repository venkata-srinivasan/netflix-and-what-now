import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="flex flex-1">
        <div className="w-72 border-r border-border p-3 hidden md:block space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
          <div className="space-y-2 mt-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
    </div>
  );
}
