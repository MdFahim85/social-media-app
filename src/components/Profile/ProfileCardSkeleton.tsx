"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle } from "lucide-react";

export default function ProfileCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-pulse">
      {/* Profile Sidebar Skeleton */}
      <div className="md:col-span-4 flex justify-center">
        <div className="w-full space-y-4">
          <Skeleton className="w-24 h-24 rounded-full mx-auto" />
          <Skeleton className="w-32 h-6 mx-auto" />
          <Skeleton className="w-40 h-4 mx-auto" />
          <div className="flex justify-between mt-4 px-6">
            <Skeleton className="w-12 h-6" />
            <Skeleton className="w-12 h-6" />
            <Skeleton className="w-12 h-6" />
          </div>
          <Skeleton className="w-full h-10 mt-4 rounded-md" />
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="md:col-span-8 space-y-4">
        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="w-24 h-8 rounded" />
          <Skeleton className="w-32 h-8 rounded" />
        </div>

        {/* Post Skeletons */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-6 border rounded-md bg-neutral-950"
          >
            {/* Post Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-3 items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-24 h-4 mb-1" />
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
              <Skeleton className="w-16 h-3" />
            </div>

            {/* Post Content */}
            <div className="mt-4 space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
            </div>

            {/* Post Actions */}
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-400" />
                <Skeleton className="w-6 h-3" />
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <Skeleton className="w-6 h-3" />
              </div>
            </div>

            {/* Comments Skeleton */}
            {Array.from({ length: 2 }).map((_, cidx) => (
              <div key={cidx} className="flex gap-3 mt-4 items-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="w-32 h-3" />
                  <Skeleton className="w-full h-3" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
