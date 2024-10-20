import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import { NOTICE_LIST, SIGNAGE_LIST } from "../../../constants/api_constant";
import { NOTICE_BOARD } from "../../../constants/page_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";

const NoticeForm = () => {
  const [formData, setFormData] = useState({
    accountId: "",
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    deviceIds: [""],
    role: "",
  });

  const [deviceOptions, setDeviceOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(""); // 역할 상태 추가
  const navigate = useNavigate();
  const { noticeId } = useParams();

  useEffect(() => {
    const fetchDevices = async () => {
      const authority = decodeJwt().roles;
      setRole(authority); // 역할 상태 설정

      try {
        const response = await fetcher.get(SIGNAGE_LIST, {
          params: { role: authority },
        });
        setDeviceOptions(
          response.data.map((device) => ({
            value: device.deviceId,
            label: device.deviceName,
          }))
        );
      } catch (error) {
        console.error("디바이스 목록을 불러오는 중 오류 발생:", error);
        alert("디바이스 목록을 불러오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (noticeId) {
      setIsEditing(true);
      const fetchNotice = async () => {
        try {
          const response = await fetcher.get(NOTICE_LIST + `/${noticeId}`);
          const {
            accountId,
            title,
            content,
            startDate,
            endDate,
            deviceList = [],
          } = response.data;
          
          // deviceList에서 deviceId만 추출하여 deviceIds에 설정
          const selectedDeviceIds = deviceList.map((device) => device.deviceId);
  
          setFormData({
            accountId,
            title,
            content,
            startDate,
            endDate,
            deviceIds: selectedDeviceIds.length ? selectedDeviceIds : [""],
          });
        } catch (error) {
          console.error("공지글을 불러오는 중 오류 발생:", error);
          alert("공지글을 불러오는 중 오류가 발생했습니다.");
        }
      };
      fetchNotice();
    }
  }, [noticeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { accountId, title, content, startDate, endDate, deviceIds } = formData;

    // 관리자가 아닌 경우에만 노출 시작일과 종료일을 필수로 체크
    if (!title.trim() || !content.trim() || (role !== "ROLE_ADMIN" && (!startDate || !endDate))) {
      alert("제목, 내용, 노출 시작일, 종료일을 모두 입력해야 합니다.");
      return;
    }

    // 관리자가 아닌 경우에만 재생장치 선택 검사
    if (role !== "ROLE_ADMIN" && deviceIds.some((device) => !device)) {
      alert("모든 재생장치를 선택해야 합니다.");
      return;
    }

     // 사용자 확인 창 추가
  const confirmMessage = isEditing
          ? "정말 수정하시겠습니까?"
          : "정말 저장하시겠습니까?";
  const isConfirmed = window.confirm(confirmMessage);

if (!isConfirmed) {
  return; // 사용자가 취소한 경우 함수 종료
}

    try {
      const noticeData = {
        accountId,
        title,
        content,
        startDate,
        endDate,
        deviceIds: deviceIds.filter((device) => device),
      };

      const response = isEditing
        ? await fetcher.put(NOTICE_LIST + `/${noticeId}`, noticeData)
        : await fetcher.post(NOTICE_LIST, noticeData);

      if ([200, 201, 204].includes(response.status)) {
        navigate(-1);
      } else {
        alert("공지글 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("공지글 저장 중 오류 발생:", error);
      alert("공지글 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(NOTICE_BOARD);
  };

  const addDevice = () => {
    setFormData((prev) => ({ ...prev, deviceIds: [...prev.deviceIds, ""] }));
  };

  const removeDevice = (index) => {
    setFormData((prev) => ({
      ...prev,
      deviceIds: prev.deviceIds.filter((_, i) => i !== index),
    }));
  };

  const handleDeviceChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      deviceIds: prev.deviceIds.map((deviceId, i) =>
        i === index ? value : deviceId
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          {isEditing ? "공지글 수정" : "공지글 작성"}
        </h1>
      </header>
      <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                id="title"
                name="title"
                placeholder="제목을 입력하세요."
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <textarea
                id="content"
                name="content"
                placeholder="내용을 입력하세요."
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full p-5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows="4"
              />
            </div>
            {role !== "ROLE_ADMIN" && (
              <>
                <div>
                  {formData.deviceIds.map((device, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <select
                        value={device}
                        onChange={(e) => handleDeviceChange(index, e.target.value)}
                        className="mt-1 block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">재생장치를 선택하세요</option>

                        {deviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <div className="ml-2 flex items-center">
                        <button
                          type="button"
                          onClick={addDevice}
                          className="flex items-center text-blue-500"
                        >
                          <AiFillPlusCircle size={25} color="#f25165" />
                        </button>
                      </div>
                      {formData.deviceIds.length > 1 && (
                        <div className="ml-2 flex items-center">
                          <button
                            type="button"
                            onClick={() => removeDevice(index)}
                            className="flex items-center"
                          >
                            <AiFillMinusCircle size={25} color="#717273" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-2 shadow-sm bg-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="startDate"
                        className="w-2/4 block text-sm font-semibold leading-6 text-gray-900"
                      >
                        노출 시작일
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formatDate(formData.startDate)}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <span className="text-sm text-gray-500">-</span>
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="endDate"
                        className="w-2/4 block text-sm font-semibold leading-6 text-gray-900"
                      >
                        노출 종료일
                      </label>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formatDate(formData.endDate)}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-end space-x-4">
          <button
              type="submit"
              className="relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              취소
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
