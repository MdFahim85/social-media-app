"use client";

import { getSuggestedUsers } from "@/lib/api/followerApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "./LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ImageBox from "../ImageBox";
import { SuggestedUser } from "../../../types/types";
import { Button } from "../ui/button";

function FollowerSuggestion() {
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["fetchSuggestedUsers"],
    queryFn: () => getSuggestedUsers(),
  });
  if (isPending) {
    return <Loading />;
  }
  const suggestedUsers = data?.data.suggestedUsers;
  console.log(suggestedUsers);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Follower Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedUsers.map((user: SuggestedUser) => (
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
                    <Button variant={"secondary"}>Follow</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default FollowerSuggestion;
