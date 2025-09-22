"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Postbox Skeleton */}
      <div className="border rounded-lg p-6 sm:p-8 bg-neutral-950">
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="w-full h-20 rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="w-20 h-8 rounded-md" />
              <Skeleton className="w-20 h-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Posts Skeleton (repeat a few times) */}
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="border rounded-lg p-6 sm:p-8 bg-neutral-950">
          {/* Header */}
          <div className="flex justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="w-32 h-4 rounded" />
                <Skeleton className="w-24 h-3 rounded" />
              </div>
            </div>
            <Skeleton className="w-10 h-4 rounded" />
          </div>

          {/* Post Content */}
          <div className="mt-4 space-y-2">
            <Skeleton className="w-full h-5 rounded" />
            <Skeleton className="w-full h-5 rounded" />
            <Skeleton className="w-3/4 h-5 rounded" />
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-4">
            <Skeleton className="w-20 h-8 rounded-md" />
            <Skeleton className="w-20 h-8 rounded-md" />
          </div>

          {/* Comments Section */}
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, cidx) => (
              <div key={cidx} className="flex gap-3 items-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="w-32 h-3 rounded" />
                  <Skeleton className="w-full h-3 rounded" />
                </div>
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex gap-3 items-start mt-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="flex-1 h-10 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
