"use client";

import {
  followUser,
  getFollowInfo,
  getProfileInfo,
} from "@/lib/api/profileApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Loading from "../Homepage/LoadingSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ImageBox from "../ImageBox";
import { FileText, Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { PostWithAllRelations } from "../../../types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

function ProfileCard() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currentUser = session?.user;

  const { id } = params;

  const [showComment, setShowComment] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchProfileInfo", id],
    queryFn: () => getProfileInfo(id as string),
  });

  const userData = data?.data;

  const {
    isPending: isFollowPending,
    isError: isFollowError,
    data: followData,
    error: followError,
  } = useQuery({
    queryKey: ["fetchFollowInfo", id],
    queryFn: () => getFollowInfo(id as string),
    enabled: !!userData,
  });

  const { mutate, isPending: isFollowingUser } = useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchProfileInfo"],
      });
    },
    onError: () => {
      toast.error("Something went wrong with the server");
    },
  });

  const handleFollow = (id: string) => {
    mutate(id);
  };

  if (isPending || isFollowPending) {
    return <Loading />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isFollowError) {
    return <div>{followError.message}</div>;
  }

  const { likedPosts, posts, user } = userData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Profile Sidebar */}
      <div className="md:col-span-4">
        <div className="mb-6 w-full flex justify-center">
          <Card className="w-full text-sm">
            <CardHeader>
              <CardTitle>
                <div className="w-full flex justify-center">
                  <ImageBox src={user.image} size={40} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex items-center flex-col text-center">
              <div className="font-semibold">{user.name}</div>
              <div className="break-words">{user.email}</div>
            </CardContent>
            <CardContent className="flex justify-between gap-2 text-gray-100 font-medium mt-4">
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.followers}</div>
                <div className="text-gray-500 text-sm">Followers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.following}</div>
                <div className="text-gray-500 text-sm">Following</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.posts}</div>
                <div className="text-gray-500 text-sm">Posts</div>
              </div>
            </CardContent>
            <CardFooter>
              {user.id !== currentUser?.id && (
                <Button
                  className="w-full"
                  onClick={() => handleFollow(user.id)}
                >
                  Follow
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Posts Section */}
      <div className="md:col-span-8">
        <div className="w-full">
          <Tabs defaultValue="posts">
            <TabsList className="bg-neutral-950 w-full flex flex-wrap">
              <TabsTrigger value="posts" className="flex-1 text-center">
                Posts
              </TabsTrigger>
              <TabsTrigger value="likedPosts" className="flex-1 text-center">
                Liked Posts
              </TabsTrigger>
            </TabsList>

            {/* User Posts */}
            <TabsContent value="posts">
              {posts.length ? (
                posts.map((post: PostWithAllRelations) => (
                  <Card
                    className="px-4 sm:px-6 py-6 sm:py-8 mb-4"
                    key={post.id}
                  >
                    <CardTitle>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 items-start sm:items-center">
                          <div className="flex gap-3 sm:gap-4 items-center">
                            <ImageBox src={post.author.image} size={40} />
                            <div>
                              <h2 className="text-gray-300 font-medium">
                                {post.author.name}
                              </h2>
                              <p className="text-xs sm:text-sm text-gray-500 break-all">
                                {post.author.email}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                          </p>
                        </div>

                        <div className="sm:ps-14 mt-3 sm:mt-4 text-base sm:text-lg font-medium pb-4">
                          {post.content}
                        </div>
                      </div>

                      <div className="w-full flex justify-start items-center gap-6 sm:gap-8 flex-wrap">
                        <div className="flex items-center gap-2">
                          {user && (
                            <>
                              <Heart className="size-5 sm:size-6" />
                              {post._count.likes}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"ghost"}
                            size="sm"
                            onClick={() => setShowComment((prev) => !prev)}
                          >
                            <MessageCircle className="size-5 sm:size-6" />
                            {post._count.comments}
                          </Button>
                        </div>
                      </div>
                    </CardTitle>

                    {/* Comments */}
                    {showComment && (
                      <>
                        <hr className="my-4" />
                        <CardFooter className="px-0 w-full">
                          <div className="w-full">
                            {post.comments.map((comment) => (
                              <div className="mb-6 sm:mb-8" key={comment.id}>
                                <div className="flex gap-3 sm:gap-4 items-center">
                                  <ImageBox
                                    src={comment.author.image}
                                    size={40}
                                  />
                                  <div className="w-full flex flex-col sm:flex-row sm:justify-between">
                                    <div className="flex gap-3 sm:gap-6 items-center">
                                      <h2 className="font-medium">
                                        {comment.author.name}
                                      </h2>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        {formatDistanceToNow(
                                          new Date(comment.createdAt)
                                        )}{" "}
                                        ago
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-12 sm:ms-14 mt-2 text-sm sm:text-base">
                                  {comment.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="w-full mx-auto mt-6 sm:mt-8 text-center">
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
              )}
            </TabsContent>

            {/* Liked Posts */}
            <TabsContent value="likedPosts">
              {likedPosts.length ? (
                likedPosts.map((post: PostWithAllRelations) => (
                  <Card
                    className="px-4 sm:px-6 py-6 sm:py-8 mb-4"
                    key={post.id}
                  >
                    <CardTitle>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 items-start sm:items-center">
                          <div className="flex gap-3 sm:gap-4 items-center">
                            <ImageBox src={post.author.image} size={40} />
                            <div>
                              <h2 className="text-gray-300 font-medium">
                                {post.author.name}
                              </h2>
                              <p className="text-xs sm:text-sm text-gray-500 break-all">
                                {post.author.email}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                          </p>
                        </div>

                        <div className="sm:ps-14 mt-3 sm:mt-4 text-base sm:text-lg font-medium pb-4">
                          {post.content}
                        </div>
                      </div>

                      <div className="w-full flex justify-start items-center gap-6 sm:gap-8 flex-wrap">
                        <div className="flex items-center gap-2">
                          {user && (
                            <>
                              <Heart className="size-5 sm:size-6" />
                              {post._count.likes}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"ghost"}
                            size="sm"
                            onClick={() => setShowComment((prev) => !prev)}
                          >
                            <MessageCircle className="size-5 sm:size-6" />
                            {post._count.comments}
                          </Button>
                        </div>
                      </div>
                    </CardTitle>

                    {/* Comments */}
                    {showComment && (
                      <>
                        <hr className="my-4" />
                        <CardFooter className="px-0 w-full">
                          <div className="w-full">
                            {post.comments.map((comment) => (
                              <div className="mb-6 sm:mb-8" key={comment.id}>
                                <div className="flex gap-3 sm:gap-4 items-center">
                                  <ImageBox
                                    src={comment.author.image}
                                    size={40}
                                  />
                                  <div className="w-full flex flex-col sm:flex-row sm:justify-between">
                                    <div className="flex gap-3 sm:gap-6 items-center">
                                      <h2 className="font-medium">
                                        {comment.author.name}
                                      </h2>
                                      <p className="text-xs sm:text-sm text-gray-500">
                                        {formatDistanceToNow(
                                          new Date(comment.createdAt)
                                        )}{" "}
                                        ago
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-12 sm:ms-14 mt-2 text-sm sm:text-base">
                                  {comment.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="w-full mx-auto mt-6 sm:mt-8 text-center">
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
