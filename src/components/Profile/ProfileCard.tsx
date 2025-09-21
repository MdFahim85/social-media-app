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
import { PostWithAllRelations } from "../../../types/postType";
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
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <div className="mb-8 w-full flex justify-center">
          <Card className="w-full text-sm">
            <CardHeader>
              <CardTitle>
                <div className="w-full flex justify-center">
                  <ImageBox src={user.image} size={40} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex items-center flex-col">
              <div>{user.name}</div>
              <div>{user.email}</div>
            </CardContent>
            <CardContent className="flex justify-between gap-2 text-gray-100 font-medium mt-4">
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.followers}</div>
                <div className="text-gray-500">Followers </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.following}</div>
                <div className="text-gray-500">Following </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.posts}</div>
                <div className="text-gray-500">Posts </div>
              </div>
            </CardContent>
            <CardFooter>
              {user.id !== currentUser?.id ? (
                <Button
                  className="w-full"
                  onClick={() => handleFollow(user.id)}
                  disabled={isFollowingUser}
                >
                  Follow
                </Button>
              ) : (
                ""
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="col-span-8">
        <div className="w-full">
          <div className="mb-4">
            <Tabs defaultValue="posts">
              <TabsList className="bg-neutral-950">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="likedPosts">Liked Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                {posts.length ? (
                  posts.map((post: PostWithAllRelations) => (
                    <Card className="px-6 py-8 mb-4" key={post.id}>
                      <CardTitle>
                        <div>
                          <div className="flex gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                              <ImageBox src={post.author.image} size={40} />
                              <h2 className="text-gray-300">
                                {post.author.name}
                              </h2>
                              <p className="text-sm text-gray-500 hidden md:block">
                                {post.author.email}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(post.createdAt))}{" "}
                              ago
                            </p>
                          </div>
                          <div className="ps-14 mt-4 text-lg font-medium pb-4">
                            {post.content}
                          </div>
                        </div>

                        <div className="w-full flex justify-start items-center gap-8">
                          <div className="flex items-center gap-2">
                            {user && (
                              <>
                                <Heart className="size-6" />
                                {post._count.likes}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={"ghost"}
                              onClick={() => setShowComment((prev) => !prev)}
                            >
                              <MessageCircle className="size-6" />
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
                                      <ImageBox
                                        src={comment.author.image}
                                        size={40}
                                      />
                                      <div className="w-full flex justify-between items-center">
                                        <div className="flex gap-6 items-center">
                                          <h2>{comment.author.name}</h2>
                                          <p className="text-sm text-gray-500 hidden md:block">
                                            {formatDistanceToNow(
                                              new Date(comment.createdAt)
                                            )}{" "}
                                            ago
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ms-14">
                                      {comment.content}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="w-full  mx-auto mt-8  text-center">
                    <CardHeader className="flex flex-col items-center justify-center py-6">
                      <FileText className="w-12 h-12 text-gray-200 mb-2" />
                      <CardTitle className="text-lg font-semibold text-gray-200">
                        No Content Found
                      </CardTitle>
                      <CardDescription className="text-gray-500">
                        There is nothing to display here yet.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="likedPosts">
                {likedPosts.length ? (
                  likedPosts.map((post: PostWithAllRelations) => (
                    <Card className="px-6 py-8 mb-4" key={post.id}>
                      <CardTitle>
                        <div>
                          <div className="flex gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                              <ImageBox src={post.author.image} size={40} />
                              <h2 className="text-gray-300">
                                {post.author.name}
                              </h2>
                              <p className="text-sm text-gray-500 hidden md:block">
                                {post.author.email}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(post.createdAt))}{" "}
                              ago
                            </p>
                          </div>
                          <div className="ps-14 mt-4 text-lg font-medium pb-4">
                            {post.content}
                          </div>
                        </div>

                        <div className="w-full flex justify-start items-center gap-8">
                          <div className="flex items-center gap-2">
                            {user && (
                              <>
                                <Heart className="size-6" />
                                {post._count.likes}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={"ghost"}
                              onClick={() => setShowComment((prev) => !prev)}
                            >
                              <MessageCircle className="size-6" />
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
                                      <ImageBox
                                        src={comment.author.image}
                                        size={40}
                                      />
                                      <div className="w-full flex justify-between items-center">
                                        <div className="flex gap-6 items-center">
                                          <h2>{comment.author.name}</h2>
                                          <p className="text-sm text-gray-500 hidden md:block">
                                            {formatDistanceToNow(
                                              new Date(comment.createdAt)
                                            )}{" "}
                                            ago
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ms-14">
                                      {comment.content}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="w-full  mx-auto mt-8  text-center">
                    <CardHeader className="flex flex-col items-center justify-center py-6">
                      <FileText className="w-12 h-12 text-gray-200 mb-2" />
                      <CardTitle className="text-lg font-semibold text-gray-200">
                        No Content Found
                      </CardTitle>
                      <CardDescription className="text-gray-500">
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
    </div>
  );
}

export default ProfileCard;
