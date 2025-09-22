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
      queryClient.invalidateQueries({
        queryKey: ["fetchPosts", "fetchNotifications"],
      });
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
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] });
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
    <Card className="px-4 sm:px-6 py-6 sm:py-8 mb-4">
      <CardTitle>
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <ImageBox src={post.author.image} size={40} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h2 className="text-gray-300 text-base sm:text-lg font-medium">
                  {post.author.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 hidden md:block">
                  {post.author.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <p className="text-gray-500">{postedDate} ago</p>
              {user?.id === post.authorId && (
                <AlertBox onClick={handlePostDelete} />
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="ps-12 sm:ps-14 mt-3 sm:mt-4 text-sm sm:text-lg font-medium pb-4">
            {post.content}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-wrap justify-start items-center gap-6 sm:gap-8">
          {user && (
            <Button
              variant="ghost"
              onClick={() => toggleLike()}
              disabled={isLiked}
              className="flex items-center gap-2"
            >
              <Heart
                fill={liked ? "red" : "transparent"}
                stroke={liked ? "red" : "white"}
                strokeWidth={1}
                className="size-5 sm:size-6"
              />
              <span className="text-sm sm:text-base">{totalLikes}</span>
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <MessageCircle
              fill={showComment ? "#0097f5" : "transparent"}
              stroke={showComment ? "#0097f5" : "white"}
              strokeWidth={1}
              className="size-5 sm:size-6"
            />
            <span className="text-sm sm:text-base">{post._count.comments}</span>
          </Button>
        </div>
      </CardTitle>

      {/* Comments Section */}
      {showComment && (
        <>
          <hr className="my-3 sm:my-4" />
          <CardFooter className="px-0 w-full">
            <div className="w-full">
              {/* Existing Comments */}
              <div>
                {post.comments.map((comment) => (
                  <div className="mb-6 sm:mb-8" key={comment.id}>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <ImageBox src={comment.author.image} size={36} />
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                          <h2 className="text-sm sm:text-base">
                            {comment.author.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                            ago
                          </p>
                        </div>
                        {user?.id === comment.authorId && (
                          <Button
                            variant="secondary"
                            onClick={() => handleCommentDelete(comment.id)}
                            disabled={isDeletingComment}
                            className="mt-2 sm:mt-0 w-full sm:w-auto"
                          >
                            <Trash stroke="red" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="ms-10 sm:ms-14 mt-1 text-sm sm:text-base">
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              {user && !commented && (
                <div className="w-full mt-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                    <ImageBox src={user?.image} size={36} />
                    <Textarea
                      placeholder="Comment your thoughts"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-sm sm:text-base min-h-[60px]"
                    />
                  </div>
                  <div className="flex w-full justify-end ps-10 sm:ps-14 mt-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleComment()}
                      disabled={isCommenting}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Comment</span>
                    </Button>
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
