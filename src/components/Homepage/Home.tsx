"use client";

import { useQuery } from "@tanstack/react-query";
import Postbox from "./Post/Postbox";
import API from "@/app/api/axios";
import PostCard from "./Post/PostCard";
import { PostWithAllRelations } from "../../../types/postType";

const getPosts = async () => {
  try {
    const res = await API.get("/posts");
    return res.data;
  } catch (error) {
    console.log("error fetching posts");
  }
};

function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchPosts"],
    queryFn: getPosts,
  });

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
