"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { PostWithAllRelations } from "../../../../types/postType";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type PostCardProps = { post: PostWithAllRelations };

function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
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
          <hr />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={"ghost"}
                onClick={() => setLiked((prev) => !prev)}
              >
                <Heart
                  fill={liked ? "red" : ""}
                  stroke={liked ? "red" : "white"}
                  className="size-6"
                />
              </Button>
              {post._count.likes}
            </div>
            <div className="flex items-center gap-2">
              <Button variant={"ghost"}>
                <MessageCircle className="size-6" />
              </Button>
              {post._count.likes}
            </div>
          </div>
        </div>
      </CardTitle>
    </Card>
  );
}

export default PostCard;
