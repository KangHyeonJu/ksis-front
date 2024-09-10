import React, { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";
import fetcher from "../../../fetcher";
import { NOTIFICATION_COUNT } from "../../../constants/api_constant";
import { EventSourcePolyfill } from "event-source-polyfill";

const NotificationCountComponent = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetcher.get(NOTIFICATION_COUNT);
        setUnreadCount(response.data);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <div className="relative flex items-center">
      <BiBell size={24} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationCountComponent;
