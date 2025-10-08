"use client";

import {
  followUser,
  getFollowInfo,
  getProfileInfo,
} from "@/lib/api/profileApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
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
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { FollowerType } from "../../../types/types";
import { Cake, Edit, MapPin } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

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

  const [follow, setFollow] = useState(false);

  useEffect(() => {
    if (userData && currentUser) {
      const isFollowing = userData.user.followers.some(
        (f: FollowerType) => f.follower.id === currentUser.id
      );
      setFollow(isFollowing);
    }
  }, [userData, currentUser]);

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
      queryClient.invalidateQueries({
        queryKey: ["fetchFollowInfo"],
      });
      setFollow((prev) => !prev);
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
      <div className="md:col-span-4">
        <div className="mb-6 w-full flex justify-center">
          <Card className="w-full text-sm p-0">
            <CardHeader className="px-0">
              <CardTitle>
                <div className="w-full flex justify-center relative">
                  <Image
                    src={
                      user.banner ||
                      "https://plus.unsplash.com/premium_photo-1672201106204-58e9af7a2888?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt="profile"
                    fill
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <div className="p-8 z-40">
                    <ImageBox src={user.image} size={80} />
                  </div>
                  <Button
                    variant={"ghost"}
                    className="hover:cursor-pointer absolute right-0 top-0 m-4"
                    onClick={() => redirect(`/profile/${user.id}/update`)}
                  >
                    <Edit />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex items-center flex-col text-center">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold  mb-2">
                  {user.name}
                </h1>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
                    {user.bio}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                  {user.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.birthday && (
                    <div className="flex items-center gap-1.5">
                      <Cake className="w-4 h-4" />
                      <span>{format(user.birthday, "PPP")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardContent className="flex justify-between gap-2 text-gray-100 font-medium mt-4">
              <Modal user={user} type="followers" />
              <div className="flex flex-col items-center">
                <div className="text-lg">{user._count.posts}</div>
                <div className="text-gray-500 text-sm">Posts</div>
              </div>
              <Modal user={user} type="following" />
            </CardContent>
            <CardFooter>
              {user.id !== currentUser?.id && (
                <Button
                  className="w-full  mb-4"
                  onClick={() => handleFollow(user.id)}
                  disabled={isFollowingUser}
                >
                  {follow ? "Unfollow" : "Follow"}
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
