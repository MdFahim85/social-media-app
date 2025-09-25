"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "@/lib/api/postApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notifications } from "../../../types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ImageBox from "@/components/ImageBox";
import { Heart, MessageCircle, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import NotificationSkeleton from "./NotificationSkeleton";

function NotificationCards() {
  const queryClient = useQueryClient();

  const { isPending, data } = useQuery({
    queryKey: ["fetchNotifications"],
    queryFn: getNotifications,
  });

  const { mutate: readNotif, isPending: isReading } = useMutation({
    mutationFn: (userId: string) => readNotification(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchNotifications"] });
    },
  });

  const { mutate: deleteNotif, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchNotifications"],
      });
    },
  });

  const notifications = data?.data.notifications;

  const unreadNotificationsCount = notifications
    ? notifications.filter(
        (notification: Notifications) => notification.read === false
      ).length
    : 0;

  const handleUnreadNotifications = () => {
    notifications.map((notification: Notifications) => {
      readNotif(notification.userId);
    });
  };

  const handleDeleteNotifications = () => {
    notifications.map((notification: Notifications) => {
      deleteNotif(notification.id);
    });
  };

  if (isPending) {
    return <NotificationSkeleton />;
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <h1 className="font-bold dark:text-gray-300 text-lg sm:text-xl">
            Notifications
          </h1>
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-sm">{unreadNotificationsCount} unread</p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={"link"}
                className="px-0 py-2 text-xs sm:text-sm"
                onClick={() => handleUnreadNotifications()}
                disabled={!unreadNotificationsCount || isReading}
              >
                {unreadNotificationsCount !== 0
                  ? "Mark all as read"
                  : "Marked all as read"}
              </Button>
              <Button
                variant={"link"}
                className="px-0 py-2 text-xs sm:text-sm"
                onClick={() => handleDeleteNotifications()}
                disabled={!notifications?.length || isDeleting}
              >
                Clear all
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh] w-full">
          {notifications ? (
            notifications.map((notification: Notifications) => (
              <div key={notification.id}>
                <div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div>
                      <ImageBox src={notification.creator.image} size={40} />
                    </div>
                    {notification.type === "COMMENT" ||
                    notification.type === "LIKE" ? (
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                          {notification.type == "LIKE" ? (
                            <Heart className="shrink-0" />
                          ) : (
                            <MessageCircle className="shrink-0" />
                          )}
                          <span className="font-medium">
                            {notification.creator.name}
                          </span>{" "}
                          has{" "}
                          {notification.type == "LIKE" ? "liked" : "commented"}{" "}
                          on your post{" "}
                          {notification.comment
                            ? `"${notification.comment.content}"`
                            : ""}
                        </div>

                        <p className="ms-8 pt-2 text-xs sm:text-sm text-zinc-400">
                          {formatDistanceToNow(
                            new Date(notification.createdAt)
                          )}{" "}
                          ago
                        </p>
                        <div className="m-2 sm:m-4 p-3 sm:p-4 bg-gray-100 dark:bg-neutral-800 rounded-md text-sm sm:text-base break-words">
                          {notification.post?.content}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-sm sm:text-base">
                        <UserRoundPlus className="shrink-0" />
                        <span className="font-medium">
                          {notification.creator.name}
                        </span>{" "}
                        has started following you
                      </div>
                    )}
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-base sm:text-lg text-center h-28">
              {data?.data.message}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default NotificationCards;
