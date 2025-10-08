"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Postbox from "./Post/Postbox";
import PostCard from "@/components/Homepage/Post/PostCard";
import { PostWithAllRelations } from "../../../types/types";
import { getPosts } from "@/lib/api/postApi";
import PostSkeleton from "./Post/PostSkeleton";
import ErrorCard from "../ErrorCard";
import React, { Fragment, useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";

function Home() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isError,
  } = useInfiniteQuery({
    queryKey: ["fetchPosts"],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return <PostSkeleton />;
  }
  if (isError) {
    return <ErrorCard errorMessage={error.message} />;
  }

  return (
    <div>
      <div>
        <Postbox />
      </div>
      <div>
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.posts.map((post: PostWithAllRelations) => (
              <PostCard post={post} key={post.id} />
            ))}{" "}
          </Fragment>
        ))}{" "}
        <div ref={loadMoreRef} className="flex justify-center items-center">
          {isFetchingNextPage ? (
            <div className="border rounded-lg p-6 sm:p-8 bg-neutral-950 w-full">
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
          ) : !hasNextPage ? (
            <p className="text-muted-foreground mb-4">End of feed 🎉</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
