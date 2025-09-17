"use client";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { LIKE, PostWithAllRelations } from "../../../../types/postType";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import API from "@/app/api/axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import Loading from "../LoadingSkeleton";
import AlertBtn from "@/components/AlertBox";
import AlertBox from "@/components/AlertBox";

type PostCardProps = { post: PostWithAllRelations };

async function likeUnlike(like: LIKE) {
  const res = await API.post("/posts/likes", like);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

async function deletePost(id: any) {
  const res = await API.delete("/posts", { data: { id } });
  console.log(res);
  if (res.data.status == 401 || res.data.status == 404) {
    const error = res.data;
    throw new Error(error.message);
  }
  return res;
}

function PostCard({ post }: PostCardProps) {
  const postedDate = formatDistanceToNow(new Date(post.createdAt));
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;
  const [liked, setLiked] = useState(
    post.likes.some((like) => like.authorId == user?.id)
  );
  const [totalLikes, setTotalLikes] = useState(post._count.likes);
  const { mutate, isPending: isLiked } = useMutation({
    mutationFn: (postId: string) => likeUnlike({ authorId: user?.id, postId }),
    onSuccess: () => {
      setLiked((prev) => !prev);
      setTotalLikes((prev) => prev + (liked ? -1 : 1));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletedPost, isPending: isDeleting } = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function toggleLike() {
    mutate(post.id);
  }

  function handleDelete() {
    deletedPost(post.id);
  }

  return (
    <Card className="px-6 py-8 mb-4">
      <CardTitle>
        <div>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <ImageBox src={post.author.image} size={40} />
              <h2>{post.author.name}</h2>
              <p className="text-sm text-gray-500 hidden md:block">
                {post.author.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{postedDate} ago </p>
              {user?.id === post.authorId && (
                <AlertBox onClick={handleDelete} />
              )}
            </div>
          </div>
          <div className="ps-14 mt-4 text-lg font-medium pb-4">
            {post.content}
          </div>
        </div>
      </CardTitle>
      {user && (
        <>
          <hr />
          <CardFooter>
            <div className="w-full flex justify-between items-center ">
              <div className="flex items-center gap-2">
                <Button
                  variant={"ghost"}
                  onClick={() => toggleLike()}
                  disabled={isLiked}
                >
                  <Heart
                    fill={liked ? "red" : ""}
                    stroke={liked ? "red" : "white"}
                    className="size-6"
                  />
                </Button>
                <Toaster />
                {totalLikes}
              </div>
              <div className="flex items-center gap-2">
                <Button variant={"ghost"}>
                  <MessageCircle className="size-6" />
                </Button>
                {post._count.comments}
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default PostCard;
