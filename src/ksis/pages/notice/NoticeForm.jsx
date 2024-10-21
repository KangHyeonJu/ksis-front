import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import { NOTICE_LIST, SIGNAGE_LIST } from "../../../constants/api_constant";
import { NOTICE_BOARD } from "../../../constants/page_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";
import { Input } from "../../css/input"; // 추가
import { Button } from "../../css/button"; // 추가
import { Textarea } from "../../css/textarea";
import { Select } from "../../css/select";

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

    const { accountId, title, content, startDate, endDate, deviceIds } =
      formData;

    // 관리자가 아닌 경우에만 노출 시작일과 종료일을 필수로 체크
    if (
      !title.trim() ||
      !content.trim() ||
      (role !== "ROLE_ADMIN" && (!startDate || !endDate))
    ) {
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
    <div className="grid place-items-center min-h-screen">
      <div className="shadow-sm ring-4 ring-gray-900/5 text-center p-6 bg-white rounded-lg w-1/3 min-w-96 scale-125">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          {isEditing ? "공지글 수정" : "공지글 작성"}
        </h1>
        <br />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              id="title"
              name="title"
              placeholder="제목을 입력하세요."
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              id="content"
              name="content"
              placeholder="내용을 입력하세요."
              value={formData.content}
              onChange={handleChange}
              rows="15"
              required
            />

            {role !== "ROLE_ADMIN" && (
              <>
                <div>
                  {formData.deviceIds.map((device, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Select
                        value={device}
                        onChange={(e) =>
                          handleDeviceChange(index, e.target.value)
                        }
                      >
                        <option value="">재생장치를 선택하세요</option>

                        {deviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>

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
                        name="startDate"
                        type="date"
                        value={formatDate(formData.startDate)}
                        onChange={handleChange}
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
                        name="endDate"
                        type="date"
                        value={formatDate(formData.endDate)}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-center space-x-4">
              <Button type="submit" color="blue">
                저장
              </Button>
              <Button type="button" color="red" onClick={handleCancel}>
                취소
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
