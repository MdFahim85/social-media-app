"use client";

import { useQuery } from "@tanstack/react-query";
import Postbox from "./Post/Postbox";
import PostCard from "@/components/Homepage/Post/PostCard";
import { PostWithAllRelations } from "../../../types/types";
import { getPosts } from "@/lib/api/userApi";
import PostSkeleton from "./Post/PostSkeleton";

function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchPosts"],
    queryFn: getPosts,
  });

  if (isPending) {
    return <PostSkeleton />;
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
