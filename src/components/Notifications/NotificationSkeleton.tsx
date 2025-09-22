"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, UserRoundPlus } from "lucide-react";

export default function NotificationSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Card Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <Skeleton className="w-32 h-6 sm:w-40 sm:h-7 rounded" />
        <div className="flex flex-col sm:items-end gap-2">
          <Skeleton className="w-16 h-4 rounded" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="w-20 h-5 rounded" />
            <Skeleton className="w-20 h-5 rounded" />
          </div>
        </div>
      </div>

      {/* ScrollArea Skeleton */}
      <div className="h-[70vh] overflow-hidden space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Avatar */}
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />

              {/* Notification Content */}
              <div className="flex-1 space-y-2">
                {/* Notification Text */}
                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-36 h-4" />
                </div>

                {/* Timestamp */}
                <Skeleton className="w-16 h-3 ms-8" />

                {/* Post content */}
                <Skeleton className="ms-8 w-full h-12 sm:h-16 rounded-md" />
              </div>
            </div>
            <div className="border-t border-gray-700" />
          </div>
        ))}

        {/* Follower notification skeleton */}
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <Skeleton className="w-64 h-4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
