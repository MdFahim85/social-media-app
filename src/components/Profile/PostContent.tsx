"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { PostWithAllRelations } from "../../../types/types";

import PostCard from "../Homepage/Post/PostCard";
import { FileText } from "lucide-react";

type PostsTabContentProps = {
  posts: PostWithAllRelations[];
  currentUserId?: string;
};

export default function PostsTabContent({ posts }: PostsTabContentProps) {
  if (!posts.length) {
    return (
      <Card className="w-full mx-auto text-center">
        <CardHeader className="flex flex-col items-center justify-center py-6">
          <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-gray-200 mb-2" />
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-200">
            No Content Found
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm sm:text-base">
            There is nothing to display here yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  );
}
