"use client";

import { getSuggestedUsers } from "@/lib/api/followerApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./LoadingSkeleton";
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
    return <Loading />;
  }

  const suggestedUsers = data?.data?.suggestedUsers;
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Follower Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedUsers ? (
            suggestedUsers.length ? (
              suggestedUsers.map((user: SuggestedUser) => (
                <Card key={user.id}>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <ImageBox src={user.image} size={40} />
                        <div>
                          <h2>{user.name}</h2>
                          <p className="text-gray-500">{user.email}</p>
                          <p className="text-gray-500">
                            {user._count.followers} followers
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant={"secondary"}
                          onClick={() => handleFollow(user.id)}
                          disabled={isFollowingUser}
                        >
                          Follow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="w-full  mx-auto mt-8  text-center">
                <CardHeader className="flex flex-col items-center justify-center py-6">
                  <SearchX className="w-12 h-12 text-gray-200 mb-2" />
                  <CardTitle className="text-lg font-semibold text-gray-200">
                    No user found
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Check again later
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          ) : (
            <Card className="w-full  mx-auto mt-8  text-center">
              <CardHeader className="flex flex-col items-center justify-center py-6">
                <LogIn className="w-12 h-12 text-gray-200 mb-2" />
                <CardTitle className="text-lg font-semibold text-gray-200">
                  Sign Up / Sign In
                </CardTitle>
                <CardDescription className="text-gray-500">
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
