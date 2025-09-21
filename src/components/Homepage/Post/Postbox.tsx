"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageBox from "@/components/ImageBox";
import { addPost } from "@/lib/api/userApi";

function Postbox() {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const { mutate, isPending: isPosting } = useMutation({
    mutationFn: (content: string) => addPost({ authorId: user?.id, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchPosts"] });
      toast.success("New post added");
      setContent("");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!user) {
      toast.error("Log In to post content");
      return;
    }
    if (!content) {
      toast.error("Post Cannot be Empty");
      return;
    }
    mutate(content);
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full mb-4 py-8">
      <CardTitle>
        <h1 className="text-lg text-center">Create a post</h1>
      </CardTitle>
      <CardContent>
        <div className="flex gap-4 items-start">
          <ImageBox src={user?.image} size={40} />
          <Textarea
            placeholder="Whats On Your Mind ?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between ps-14">
          <Button variant={"secondary"}>
            <ImageIcon />
          </Button>
          <Button
            variant={"secondary"}
            onClick={handleSubmit}
            disabled={isPosting}
          >
            <Send />
            Post
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Postbox;
