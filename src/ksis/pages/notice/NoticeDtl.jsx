import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NOTICE_BOARD, NOTICE_FORM } from "../../../constants/page_constant";
import { NOTICE_LIST, DEACTIVE_NOTICE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import { format, parseISO } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";
import { Input } from "../../css/input";
import { Button } from "../../css/button";
import { Textarea } from "../../css/textarea";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "../../css/alert";
import Loading from "../../components/Loading";

const NoticeDetail = () => {
  const userInfo = decodeJwt();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 알림창 상태 추가
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태 추가
  const [confirmAction, setConfirmAction] = useState(null); // 확인 버튼 동작 설정
  const { noticeId } = useParams();
  const [role, setRole] = useState(""); // 역할 상태 추가
  const navigate = useNavigate();

  const showAlert = (message, onConfirm = null) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
    setConfirmAction(() => onConfirm); // 확인 버튼을 눌렀을 때 실행할 액션
  };

  useEffect(() => {
    const fetchNotice = async () => {
      setRole(userInfo.roles); // 역할 상태 설정

      try {
        const response = await fetcher.get(NOTICE_LIST + `/${noticeId}`);
        setNotice(response.data);
        console.log(response.data);
        if (
          userInfo.roles !== "ROLE_ADMIN" &&
          !response.data.accountId !== userInfo.accountId
        ) {
          alert("접근권한이 없습니다.");
          navigate(NOTICE_BOARD);
        }
      } catch (err) {
        setError("공지사항 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  if (!notice) {
    return (
      <p className="text-center text-gray-600 mt-10 w-full">
        해당 공지는 비활성화된 상태입니다.
      </p>
    );
  }

  const handleDeActive = async () => {
    showAlert("정말로 이 공지를 비활성화하시겠습니까?", async () => {
      try {
        await fetcher.post(`${DEACTIVE_NOTICE}/${noticeId}`);
        navigate(NOTICE_BOARD);
      } catch (err) {
        setError("공지 비활성화에 실패했습니다.");
      }
    });
  };

  const handleEdit = () => {
    navigate(`${NOTICE_FORM}/${noticeId}`);
  };

  const handleCancel = () => {
    navigate(NOTICE_BOARD);
  };

  // deviceList에서 deviceName을 추출하는 함수
  const getDeviceNames = (deviceList) => {
    // 각 디바이스의 deviceName을 추출하고, 콤마로 구분하여 반환
    const deviceNames = deviceList.map((device) => device.deviceName);
    return deviceNames.join(", "); // 디바이스 이름을 콤마로 구분
  };

  const formatDate = (dateString) => {
    try {
      // parseISO 함수로 변환, 변환 실패 시 catch로 넘어감
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date"; // 오류 발생 시 처리
    }
  };

  return (
    <div className="grid place-items-center min-h-[80vh]">
      {/* Alert 컴포넌트 추가 */}
      <Alert open={isAlertOpen} onClose={() => setIsAlertOpen(false)} size="lg">
        <AlertTitle>알림창</AlertTitle>
        <AlertDescription>{alertMessage}</AlertDescription>
        <AlertActions>
          {confirmAction && (
            <Button
              onClick={() => {
                setIsAlertOpen(false);
                if (confirmAction) confirmAction();
              }}
            >
              확인
            </Button>
          )}
          <Button plain onClick={() => setIsAlertOpen(false)}>
            취소
          </Button>
        </AlertActions>
      </Alert>
      <div className="shadow-sm ring-4 ring-gray-900/5 text-center p-6 bg-white rounded-lg w-1/2 min-w-96">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          공지사항 상세
        </h1>
        <br />
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* 제목 */}
            <Input id="title" name="title" value={notice.title} readOnly />

            {/* 내용 */}
            <Textarea id="content" value={notice.content} readOnly rows="15" />

            {notice.role !== "ADMIN" && (
              <>
                {/* 재생장치 */}
                <div className="flex items-center mb-2">
                  <Input
                    id="device_id"
                    type="text"
                    value={getDeviceNames(notice.deviceList)}
                    readOnly
                  />
                </div>

                {/* 날짜 */}
                <div className="rounded-lg p-2 shadow-sm bg-white">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        노출 시작일
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formatDate(notice.startDate)}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        노출 종료일
                      </label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formatDate(notice.endDate)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 버튼들 */}
            <div className="flex justify-center space-x-4">
              {/* notice 작성자가 admin인 경우 숨기기 */}
              {notice.role === "ADMIN" && role === "ROLE_USER" ? null : (
                <>
                  <button
                    type="button"
                    color="blue"
                    className="rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
                    onClick={handleEdit}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    color="red"
                    className="mr-2 rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
                    onClick={handleDeActive}
                  >
                    비활성화
                  </button>
                </>
              )}
              <button
                type="button"
                color="zinc"
                className=" rounded-md border border-gray-600 bg-white text-gray-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-gray-600 hover:text-white hover:shadow-inner hover:shadow-gray-800 focus-visible:outline-gray-600 transition duration-200"
                onClick={handleCancel}
              >
                뒤로가기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeDetail;
