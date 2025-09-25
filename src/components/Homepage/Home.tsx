"use client";

import { useQuery } from "@tanstack/react-query";
import Postbox from "./Post/Postbox";
import PostCard from "@/components/Homepage/Post/PostCard";
import { PostWithAllRelations } from "../../../types/types";
import { getPosts } from "@/lib/api/postApi";
import PostSkeleton from "./Post/PostSkeleton";
import ErrorCard from "../ErrorCard";

function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchPosts"],
    queryFn: getPosts,
  });

  if (isPending) {
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
        {data?.map((post: PostWithAllRelations) => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
