import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  NOTIFICATION_LIST,
  NOTIFICATION_ISREAD,
} from "../../../constants/api_constant";
import fetcher from "../../../fetcher";

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  // 읽지 않은 알림 개수를 계산하는 함수
  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.isRead).length;
  };

  // 데이터베이스에서 알림 데이터 요청
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetcher.get(NOTIFICATION_LIST);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // 마우스를 올려놓으면 알림 읽음표시로 바꾸는 함수
  const handleMouseOver = async (index, notificationId) => {
    try {
      // 클라이언트에서 상태 업데이트
      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications];
        updatedNotifications[index].isRead = true;
        return updatedNotifications;
      });

      // 서버에 업데이트 요청
      await fetcher.post(`${NOTIFICATION_ISREAD}/${notificationId}`);
    } catch (error) {
      console.error("Error updating notification: ", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // 모달 바깥 클릭 시 모달 닫기
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않게
      >
        <h2 className="text-xl font-semibold mb-4">알림({getUnreadCount()})</h2>

        {/* 알림 목록을 테이블로 표시 */}
        <table className="w-full table-auto">
          <tbody>
            {notifications === 0 ? (
              <tr>
                <td className="py-2 px-4 text-center" colSpan="2">
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              notifications.map((notification, index) => (
                <tr
                  key={index}
                  className={`border-2 border-gray-200 
                    ${
                      notification.isRead ? "bg-white" : "bg-orange-100"
                    } hover:bg-gray-100`}
                  onMouseEnter={() =>
                    handleMouseOver(index, notification.notificationId)
                  }
                >
                  <td className="py-2 px-4">{notification.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notification;
