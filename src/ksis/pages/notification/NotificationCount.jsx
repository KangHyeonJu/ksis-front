import React, { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";
import fetcher from "../../../fetcher";
import { EventSourcePolyfill } from "event-source-polyfill";
import { NOTIFICATION_COUNT } from "../../../constants/api_constant";

const NotificationCountComponent = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [unreadCount, setUnreadCount] = useState(0);

  // 알림 개수를 서버로부터 가져오는 함수
  const fetchUnreadCount = async () => {
    try {
      const response = await fetcher.get(NOTIFICATION_COUNT);
      setUnreadCount(response.data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const initSSE = () => {};

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 가져오기
    const eventSource = new EventSourcePolyfill(
      // "http://localhost:8080/sse/events",
      API_BASE_URL + "/sse/events",
      {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
        },
      }
    );

    // 서버로부터 이벤트를 받으면 알림 개수를 업데이트 하는 함수를 호출
    eventSource.onmessage = () => {
      fetchUnreadCount(); // 알림 개수 다시 가져오기
    };

    // eventSource.onerror = (error) => {
    //   console.error("EventSource failed:", error);
    //   eventSource.close(); // 에러 시 이벤트 소스 닫기
    // };

    // 컴포넌트가 언마운트될 때 이벤트 소스 닫기
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    fetchUnreadCount(); // 컴포넌트 마운트 시 처음으로 알림 개수를 가져옴
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
