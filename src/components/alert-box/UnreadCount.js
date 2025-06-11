//// this is 10/6
import React from "react";
import { useNotifications } from "@/hooks/useNotifications";

export function UnreadCount({ userId }) {
  const { unreadCount } = useNotifications(userId);

  return (
    <div className="flex items-center justify-center">
      <span className="text-xs text-red-700 font-extrabold">{unreadCount}</span>
    </div>
  );
}


