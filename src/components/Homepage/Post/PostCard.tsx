"use client";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  COMMENT,
  LIKE,
  PostWithAllRelations,
} from "../../../../types/postType";
import ImageBox from "@/components/ImageBox";
import { Heart, ImageIcon, MessageCircle, Send, Trash } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Asap } from "next/font/google";

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

async function addComment(comment: COMMENT) {
  const res = await API.post("/posts/comments", comment);
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
  const postId = post.id;
  const [liked, setLiked] = useState(
    post.likes.some((like) => like.authorId == user?.id)
  );
  const [totalLikes, setTotalLikes] = useState(post._count.likes);

  const [content, setContent] = useState("");

  const { mutate: commentAdd, isPending: isCommenting } = useMutation({
    mutationFn: (content: string) => addComment({ content, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
      toast.success("Comment added");
      setContent("");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

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

  function handleComment() {
    commentAdd(content);
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
              {user?.id === post.authorId &&
                (isDeleting ? <AlertBox onClick={handleDelete} /> : "")}
            </div>
          </div>
          <div className="ps-14 mt-4 text-lg font-medium pb-4">
            {post.content}
          </div>
        </div>
        {user && (
          <div className="w-full flex justify-start items-center gap-8">
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
        )}
      </CardTitle>
      <hr />
      <CardFooter className="px-0 w-full">
        <div className="w-full">
          <div></div>
          <div className="w-full">
            <CardContent>
              <div className="flex gap-4 items-start">
                <ImageBox src={user?.image} size={40} />
                <Textarea
                  placeholder="Comment your thoughts"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-end ps-14 mt-4">
                <Button
                  variant={"secondary"}
                  onClick={() => handleComment()}
                  disabled={isCommenting}
                >
                  <Send />
                  Comment
                </Button>
                <Toaster />
              </div>
            </CardFooter>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
