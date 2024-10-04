import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NOTIFICATION_PAGE,
  NOTIFICATION_ISREAD,
} from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  IMAGE_FILE_BOARD,
  IMAGE_RESOURCE_BOARD,
  VIDEO_FILE_BOARD,
  VIDEO_RESOURCE_BOARD,
} from "../../../constants/page_constant";

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]); // 알림 데이터
  const [page, setPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [pageSize] = useState(10); // 페이지당 알림 개수
  const navigate = useNavigate();

  // 데이터베이스에서 알림 데이터 요청
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetcher.get(
          `${NOTIFICATION_PAGE}?page=${page}&size=${pageSize}`
        );
        setNotifications(response.data.content); // 현재 페이지 알림 데이터
        setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(page); // 컴포넌트가 마운트되면 현재 페이지의 알림을 요청
  }, [page]); // 페이지 변경 시 데이터 다시 요청

  // 알림 눌렀을때 타입에 따라 페이지 이동 메서드
  const handleNavigate = (resourceType, message) => {
    if (resourceType === "IMAGE") {
      if (message.includes("인코딩")) {
        navigate(IMAGE_FILE_BOARD);
      } else {
        navigate(IMAGE_RESOURCE_BOARD);
      }

      onClose();
    } else if (resourceType === "VIDEO") {
      if (message.includes("인코딩")) {
        navigate(VIDEO_FILE_BOARD);
      } else {
        navigate(VIDEO_RESOURCE_BOARD);
      }
      onClose();
    }
  };

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

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value); // 선택된 페이지로 상태 업데이트
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // 모달 바깥 클릭 시 모달 닫기
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않게
      >
        <h2 className="text-xl font-semibold mb-4">알림</h2>
        <div className="overflow-auto">
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
                    onClick={() =>
                      handleNavigate(
                        notification.resourceType,
                        notification.message
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td className="py-2 px-4">{notification.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <br />
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color={"primary"}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Notification;
