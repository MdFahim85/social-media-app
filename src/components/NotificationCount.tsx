"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api/postApi";
import { Badge } from "./ui/badge";
import { Notifications } from "../../types/types";

function NotificationCount() {
  const { data } = useQuery({
    queryKey: ["fetchNotifications"],
    queryFn: getNotifications,
  });
  const notifications = data?.data.notifications;

  const unreadNotificationsCount = notifications
    ? notifications.filter(
        (notification: Notifications) => notification.read === false
      ).length
    : 0;
  return (
    <div className="flex gap-2">
      <p>Notifications</p>
      {unreadNotificationsCount ? (
        <Badge variant="outline">{unreadNotificationsCount}</Badge>
      ) : (
        ""
      )}
    </div>
  );
}

export default NotificationCount;
