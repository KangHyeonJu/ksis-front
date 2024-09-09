import React, { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";
import fetcher from "../../../fetcher";
import { NOTIFICATION_COUNT } from "../../../constants/api_constant";

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

  // 실시간 알림 업데이트
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/api/events");

    eventSource.onmessage = (event) => {
      // 서버에서 보낸 메시지를 처리합니다.
      const data = JSON.parse(event.data);
      if (data.unreadCount !== undefined) {
        setUnreadCount(data.unreadCount);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error occurred:", error);
      eventSource.close();
    };

    // 컴포넌트 언마운트 시 SSE 연결을 종료합니다.
    return () => {
      eventSource.close();
    };
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
