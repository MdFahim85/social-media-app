"use client";

import ErrorCard from "@/components/ErrorCard";
import PostCard from "@/components/Homepage/Post/PostCard";
import PostSkeleton from "@/components/Homepage/Post/PostSkeleton";
import { getSinglePost } from "@/lib/api/postApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function SinglePost() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { id } = params;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchSinglePost", id],
    queryFn: () => getSinglePost(id as string),
  });

  if (isPending) {
    return <PostSkeleton />;
  }

  if (isError) {
    return <ErrorCard errorMessage={error.message} />;
  }

  const post = data && data;

  return (
    <div>
      <PostCard post={post} />
    </div>
  );
}
