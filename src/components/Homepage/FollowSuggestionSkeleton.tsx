"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FollowerSuggestionSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-4">
      {/* Card Header Skeleton */}
      <div className="w-full mb-4">
        <Skeleton className="w-40 h-6 md:w-60 md:h-8 rounded" />
      </div>

      {/* Suggested Users Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            {/* Avatar */}
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-24 h-3 rounded" />
              <Skeleton className="w-20 h-3 rounded" />
            </div>

            {/* Follow Button */}
            <Skeleton className="w-full sm:w-24 h-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
