"use client";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { LIKE, PostWithAllRelations } from "../../../../types/postType";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "@/app/api/axios";
import { useSession } from "next-auth/react";

type PostCardProps = { post: PostWithAllRelations };

async function likeUnlike(like: LIKE) {
  try {
    const res = await API.post("/posts/likes", like);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

function PostCard({ post }: PostCardProps) {
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
  });

  function toggleLike() {
    mutate(post.id);
  }
  return (
    <Card className="px-6 py-8 mt-4">
      <CardTitle>
        <div>
          <div className="flex gap-4 items-center">
            <ImageBox src={post.author.image} size={40} />
            <h2>{post.author.name}</h2>
            <p className="text-sm text-gray-500">{post.author.email}</p>
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
