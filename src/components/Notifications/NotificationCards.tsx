"use client";
import Loading from "@/components/Homepage/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "@/lib/api/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notifications } from "../../../types/postType";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ImageBox from "@/components/ImageBox";
import { Check, CheckCheck, Heart, MessageCircle, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

function NotificationCards() {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["fetchNotifications"],
    queryFn: getNotifications,
  });

  const { mutate: readNotif, isPending: isReading } = useMutation({
    mutationFn: (userId: string) => readNotification(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchNotifications"],
      }),
        toast.success("Notifications updated");
    },
  });

  const { mutate: deleteNotif, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchNotifications"],
      }),
        toast.success("Notifications deleted");
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
    return <Loading />;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h1 className="font-bold dark:text-gray-300">Notifications</h1>
          <div className="flex flex-col items-end">
            <p className="text-sm">{unreadNotificationsCount} unread</p>

            <div className="flex gap-2">
              <Button
                variant={"link"}
                className="px-0 py-2 text-xs"
                onClick={() => handleUnreadNotifications()}
                disabled={!unreadNotificationsCount || isReading}
              >
                {unreadNotificationsCount !== 0
                  ? "Mark all as read"
                  : "Marked all as read"}
              </Button>
              <Button
                variant={"link"}
                className="px-0 py-2 text-xs"
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
        <ScrollArea className="h-4/5 w-full">
          {notifications ? (
            notifications.map((notification: Notifications) => (
              <div key={notification.id}>
                <div>
                  <div className="flex gap-4 items-start">
                    <div>
                      <ImageBox src={notification.creator.image} size={40} />
                    </div>
                    {notification.type === "COMMENT" ||
                    notification.type === "LIKE" ? (
                      <div className="w-full">
                        <div className="flex gap-2">
                          {notification.type == "LIKE" ? (
                            <Heart />
                          ) : (
                            <MessageCircle />
                          )}{" "}
                          {notification.creator.name} has{" "}
                          {notification.type == "LIKE" ? "liked" : "commented"}{" "}
                          on your post{" "}
                          {notification.comment
                            ? `"${notification.comment.content}"`
                            : ""}
                        </div>

                        <p className="ms-8 pt-2 text-sm text-zinc-400">
                          {formatDistanceToNow(
                            new Date(notification.createdAt)
                          )}{" "}
                          ago
                        </p>
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
