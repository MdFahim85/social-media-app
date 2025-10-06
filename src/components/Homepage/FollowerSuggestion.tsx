"use client";

import { getSuggestedUsers } from "@/lib/api/followerApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ImageBox from "../ImageBox";
import { SuggestedUser } from "../../../types/types";
import { Button } from "../ui/button";
import { LogIn, SearchX } from "lucide-react";
import { followUser } from "@/lib/api/profileApi";
import toast from "react-hot-toast";
import FollowerSuggestionSkeleton from "./FollowSuggestionSkeleton";
import Link from "next/link";

function FollowerSuggestion() {
  const queryClient = useQueryClient();

  const { isPending, data } = useQuery({
    queryKey: ["fetchSuggestedUsers"],
    queryFn: () => getSuggestedUsers(),
  });

  const { mutate, isPending: isFollowingUser } = useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchSuggestedUsers"],
      });
    },
    onError: () => {
      toast.error("Something went wrong with the server");
    },
  });

  const handleFollow = (id: string) => {
    mutate(id);
  };

  if (isPending) {
    return <FollowerSuggestionSkeleton />;
  }

  const suggestedUsers = data?.data?.suggestedUsers;
  return (
    <div className="xl:fixed min-w-3/12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl lg:text-2xl">
            Follower Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedUsers ? (
            suggestedUsers.length ? (
              <div className="flex flex-col gap-4">
                {suggestedUsers.map((user: SuggestedUser) => (
                  <Card key={user.id} className="w-full">
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <Link href={`/profile/${user.id}`}>
                          <div className="flex items-center gap-4">
                            <ImageBox src={user.image} size={40} />
                            <div className="text-sm md:text-base">
                              <h2 className="font-medium">{user.name}</h2>
                              <p className="text-gray-500 text-xs md:text-sm">
                                {user._count.followers} followers
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="flex justify-end sm:justify-start">
                          <Button
                            variant={"secondary"}
                            onClick={() => handleFollow(user.id)}
                            disabled={isFollowingUser}
                            className="w-full sm:w-auto"
                          >
                            Follow
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="w-full mx-auto mt-8 text-center">
                <CardHeader className="flex flex-col items-center justify-center py-6">
                  <SearchX className="w-12 h-12 text-gray-200 mb-2" />
                  <CardTitle className="text-base md:text-lg font-semibold text-gray-200">
                    No user found for now
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-gray-500">
                    Check again later
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          ) : (
            <Card className="w-full mx-auto mt-8 text-center">
              <CardHeader className="flex flex-col items-center justify-center py-6">
                <LogIn className="w-12 h-12 text-gray-200 mb-2" />
                <CardTitle className="text-base md:text-lg font-semibold text-gray-200">
                  Sign Up / Sign In
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-500">
                  Sign Up / Log In to Access this feature
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FollowerSuggestion;
