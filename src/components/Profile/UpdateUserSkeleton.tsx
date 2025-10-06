"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateUserSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-4 animate-pulse">
      {/* Profile Picture */}
      <div className="flex justify-center">
        <Skeleton className="h-24 w-24 rounded-full border-2 border-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Banner */}
        <div className="space-y-4">
          <div className="h-7 w-32 bg-muted rounded-md" />
          <div className="relative w-full h-40 md:h-54 bg-muted rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        </div>

        {/* Right: User details */}
        <div className="space-y-4">
          <div className="h-7 w-32 bg-muted rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="flex flex-col space-y-2">
            <div className="h-5 w-24 bg-muted rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
