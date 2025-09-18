"use client";
import Loading from "@/components/Homepage/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getNotifications, getPosts } from "@/lib/api/userApi";
import { useQuery } from "@tanstack/react-query";
import { Notifications } from "../../../types/postType";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle } from "lucide-react";

function NotificationCards() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchNotifications"],
    queryFn: getNotifications,
  });

  const notifications = data?.data.notifications;

  const unreadNotificationsCount = notifications
    ? notifications.filter(
        (notification: Notifications) => notification.read === false
      ).length
    : 0;

  const handleUnreadNotifications = () => {
    notifications.map((notification: Notifications) => {
      console.log(notification.read);
    });
  };

  if (isPending) {
    return <Loading />;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h1 className="font-bold dark:text-gray-300">Notifications</h1>
          <div className="flex flex-col items-end">
            <p className="text-sm">{unreadNotificationsCount} unread</p>

            <Button
              variant={"link"}
              className="px-0 py-2 text-xs"
              onClick={() => handleUnreadNotifications()}
              disabled={!unreadNotificationsCount}
            >
              {unreadNotificationsCount !== 0
                ? "Mark all as read"
                : "Marked all as read"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-4/5 w-full">
          {notifications ? (
            notifications.map((notification: Notifications) => (
              <div>
                <div key={notification.id}>
                  <div className="flex gap-4 items-center">
                    <div>
                      <ImageBox src={notification.creator.image} size={40} />
                    </div>
                    {notification.type === "COMMENT" ||
                    notification.type === "LIKE" ? (
                      <div className="flex gap-2">
                        {notification.type == "LIKE" ? (
                          <Heart />
                        ) : (
                          <MessageCircle />
                        )}{" "}
                        {notification.creator.name} has{" "}
                        {notification.type == "LIKE" ? "liked" : "commented"} on
                        your post{" "}
                        {notification.comment
                          ? `"${notification.comment.content}"`
                          : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mx-16 m-4 p-4 bg-gray-100 dark:bg-neutral-800 rounded-md">
                    {notification.post?.content}
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-xl text-center h-27">
              {data?.data.message}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default NotificationCards;
