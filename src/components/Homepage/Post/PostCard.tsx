"use client";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { PostWithAllRelations } from "../../../../types/types";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle, Send, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import AlertBox from "@/components/AlertBox";
import { Textarea } from "@/components/ui/textarea";
import {
  addComment,
  deleteComment,
  deletePost,
  likeUnlike,
} from "@/lib/api/userApi";

type PostCardProps = { post: PostWithAllRelations };

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
  const [showComment, setShowComment] = useState(false);
  const [commented, setCommented] = useState(
    post.comments.some((comment) => comment.authorId === user?.id)
  );

  const { mutate: commentAdd, isPending: isCommenting } = useMutation({
    mutationFn: (content: string) => addComment({ content, postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
      toast.success("Comment added");
      setCommented((prev) => !prev);
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

  const { mutate: deletedPost } = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletedComment, isPending: isDeletingComment } = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      setCommented((prev) => !prev);
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function toggleLike() {
    mutate(post.id);
  }

  function handlePostDelete() {
    deletedPost(post.id);
  }

  function handleComment() {
    commentAdd(content);
  }

  function handleCommentDelete(id: string) {
    deletedComment(id);
  }

  return (
    <Card className="px-6 py-8 mb-4">
      <CardTitle>
        <div>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <ImageBox src={post.author.image} size={40} />
              <h2 className="text-gray-300">{post.author.name}</h2>
              <p className="text-sm text-gray-500 hidden md:block">
                {post.author.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{postedDate} ago </p>
              {user?.id === post.authorId ? (
                <AlertBox onClick={handlePostDelete} />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="ps-14 mt-4 text-lg font-medium pb-4">
            {post.content}
          </div>
        </div>

        <div className="w-full flex justify-start items-center gap-8">
          <div className="flex items-center gap-2">
            {user && (
              <>
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
                  {totalLikes}
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              onClick={() => setShowComment((prev) => !prev)}
            >
              <MessageCircle
                fill={showComment ? "blue" : ""}
                stroke={showComment ? "blue" : "white"}
                className="size-6"
              />

              {post._count.comments}
            </Button>
          </div>
        </div>
      </CardTitle>
      {showComment && (
        <>
          <hr />
          <CardFooter className="px-0 w-full">
            <div className="w-full">
              <div>
                {post.comments.map((comment) => (
                  <div className="mb-8" key={comment.id}>
                    <div className="flex gap-4 items-center">
                      <ImageBox src={comment.author.image} size={40} />
                      <div className="w-full flex justify-between items-center">
                        <div className="flex gap-6 items-center">
                          <h2>{comment.author.name}</h2>
                          <p className="text-sm text-gray-500 hidden md:block">
                            {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                            ago
                          </p>
                        </div>
                        {user?.id === comment.authorId && (
                          <div>
                            <Button
                              variant={"secondary"}
                              onClick={() => handleCommentDelete(comment.id)}
                              disabled={isDeletingComment}
                            >
                              <Trash stroke="red" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ms-14">{comment.content}</div>
                  </div>
                ))}
              </div>
              {user && !commented && (
                <div className="w-full">
                  <div>
                    <div className="flex gap-4 items-start">
                      <ImageBox src={user?.image} size={40} />
                      <Textarea
                        placeholder="Comment your thoughts"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex w-full justify-end ps-14 mt-4">
                      <Button
                        variant={"secondary"}
                        onClick={() => handleComment()}
                        disabled={isCommenting}
                      >
                        <Send />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default PostCard;
