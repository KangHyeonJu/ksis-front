import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NOTICE_BOARD, NOTICE_FORM } from "../../../constants/page_constant";
import { NOTICE_LIST } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import { format, parseISO } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";

const NoticeDetail = () => {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { noticeId } = useParams();
  const [role, setRole] = useState(""); // 역할 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      const authority = decodeJwt().roles;
      setRole(authority); // 역할 상태 설정

      try {
        const response = await fetcher.get(NOTICE_LIST + `/${noticeId}`);
        console.log("데이터 : ", response.data);
        setNotice(response.data);
      } catch (err) {
        setError("공지사항 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  if (!notice) {
    return <p>공지사항이 존재하지 않습니다.</p>;
  }

  const handleDelete = async () => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await fetcher.delete(`${NOTICE_LIST}/${noticeId}`);
        navigate(NOTICE_BOARD);
      } catch (err) {
        setError("공지사항 삭제에 실패했습니다.");
      }
    }
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
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          공지사항 상세
        </h1>
      </header>
      <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c]">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* notice 작성자가 admin인 경우 숨기기 */}
            {notice.role === "ADMIN" ? null : (
              <div className="flex gap-4">
                {/* 재생장치 */}
                <div className="flex-1 flex items-center">
                  <label
                    htmlFor="device_id"
                    className="text-sm font-semibold leading-6 text-gray-900 bg-[#fcc310] rounded-md text-center w-1/3 h-full flex items-center justify-center"
                  >
                    재생장치
                  </label>
                  <input
                    id="device_id"
                    type="text"
                    value={getDeviceNames(notice.deviceList)}
                    readOnly
                    className="ml-0 flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                  />
                </div>
                {/* 작성일 */}
                <div className="flex-1 flex items-center">
                  <label
                    htmlFor="regTime"
                    className="text-sm font-semibold leading-6 text-gray-900 bg-[#fcc310] rounded-md text-center w-1/3 h-full flex items-center justify-center"
                  >
                    작성일
                  </label>
                  <input
                    id="regTime"
                    type="text"
                    value={formatDate(notice.regDate)}
                    readOnly
                    className="ml-0 flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="title"></label>
              <input
                id="title"
                type="text"
                value={notice.title}
                readOnly
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white"
              />
            </div>
            <div>
              <label htmlFor="content"></label>
              <textarea
                id="content"
                value={notice.content}
                readOnly
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white whitespace-pre-line"
                rows="4"
              />
            </div>

            {notice.role !== "ADMIN" && (
              <div className="rounded-lg p-2 shadow-sm bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 flex items-center">
                    <label
                      htmlFor="startDate"
                      className="w-2/4 block text-sm font-semibold leading-6 text-gray-900"
                    >
                      노출 시작일
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={formatDate(notice.startDate)}
                      readOnly
                      className="ml-0 block w-full border border-gray-300 rounded-md shadow-sm bg-white"
                    />
                  </div>
                  <span className="text-lg font-semibold">~</span>
                  <div className="flex-1 flex items-center">
                    <label
                      htmlFor="endDate"
                      className="w-1/4 block text-sm font-semibold leading-6 text-gray-900"
                    >
                      종료일
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={formatDate(notice.endDate)}
                      readOnly
                      className="ml-0 block w-full border border-gray-300 rounded-md shadow-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between gap-4 mt-2">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md bg-[#ffc107] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#f9a301] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9a301]"
              >
                뒤로가기
              </button>
            </div>
            <div className="flex gap-2 items-center">
              {/* notice 작성자가 admin인 경우 숨기기 */}
              {notice.role === "ADMIN" && role === "ROLE_USER" ? null : (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    삭제하기
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeDetail;
