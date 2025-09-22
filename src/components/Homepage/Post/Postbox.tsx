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
    <Card className="w-full mb-4 py-6 sm:py-8">
      <CardTitle>
        <h1 className="text-base md:text-lg text-center font-semibold">
          Create a post
        </h1>
      </CardTitle>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <ImageBox src={user?.image} size={40} />
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[80px] text-sm md:text-base"
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row w-full justify-between gap-3 sm:gap-0 ps-0 sm:ps-14">
          <Button variant={"secondary"} className="w-full sm:w-auto">
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button
            variant={"secondary"}
            onClick={handleSubmit}
            disabled={isPosting}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span>Post</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Postbox;
