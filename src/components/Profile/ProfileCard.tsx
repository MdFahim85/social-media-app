"use client";

import {
  followUser,
  getFollowInfo,
  getProfileInfo,
} from "@/lib/api/profileApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ImageBox from "../ImageBox";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import PostsTabContent from "./PostContent";
import ErrorCard from "../ErrorCard";

function ProfileCard() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const currentUser = session?.user;

  const { id } = params;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchProfileInfo", id],
    queryFn: () => getProfileInfo(id as string),
    retry: false,
  });

  const userData = data?.data;

  const {
    isPending: isFollowPending,
    isError: isFollowError,
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
    return <ProfileCardSkeleton />;
  }

  if (isError) {
    return <ErrorCard errorMessage={error.message} />;
  }

  if (isFollowError) {
    return <ErrorCard errorMessage={followError.message} />;
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
                  <ImageBox src={user.image} size={80} />
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
                  disabled={isFollowingUser}
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
            <TabsList className="bg-neutral-950 w-full flex flex-wrap mb-2">
              <TabsTrigger value="posts" className="flex-1 text-center py-4">
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="likedPosts"
                className="flex-1 text-center py-4"
              >
                Liked Posts
              </TabsTrigger>
            </TabsList>

            {/* User Posts */}
            <TabsContent value="posts">
              <PostsTabContent posts={posts} />
            </TabsContent>

            {/* Liked Posts */}
            <TabsContent value="likedPosts">
              <PostsTabContent
                posts={likedPosts}
                currentUserId={currentUser?.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
