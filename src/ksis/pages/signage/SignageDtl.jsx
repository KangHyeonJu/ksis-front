import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import { SIGNAGE_LIST, SIGNAGE_UPDATE } from "../../../constants/api_constant";
import { SIGNAGE_UPDATE_FORM } from "../../../constants/page_constant";
import LocationModal from "../../components/LocationModal";
import { Switch } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import NoticeModal from "./NoticeModal";
import SignageResourceModal from "./SignageResourceModal";

const SignageDtl = () => {
  const [enabled, setEnabled] = useState(false);

  //불러오기
  const [data, setData] = useState({});
  const params = useParams();

  const loadSignageDtl = async (signageId) => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + `/${signageId}`);
      console.log(response);
      setData(response.data);

      setEnabled(response.data.isShow);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    loadSignageDtl(params.id);
  }, [params.id]);

  // Switch 상태 변경 핸들러
  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    console.log(newEnabled);

    try {
      await fetcher.put(SIGNAGE_UPDATE + `/${data.deviceId}`, {
        showNotice: newEnabled,
      });
      console.log("DB 상태 업데이트 성공");
    } catch (error) {
      console.error("DB 상태 업데이트 실패", error);
    }
  };

  // 이전 페이지로 이동
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  //위치 지도 보기
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  //공지 조회
  const [noticeModalIsOpen, setNoticeModalIsOpen] = useState(false);

  const openNoticeModal = () => setNoticeModalIsOpen(true);
  const closeNoticeModal = () => setNoticeModalIsOpen(false);

  //이미지/영상 불러오기
  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);

  const openResourceModal = () => setResourceModalIsOpen(true);
  const closeResourceModal = () => setResourceModalIsOpen(false);

  const formattedDate = data.regTime
    ? format(parseISO(data.regTime), "yyyy-MM-dd")
    : "";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 설정
      </h1>
      <div className="text-center pt-5 pb-5">
        <div className="flex items-center">
          <input
            value={data.deviceName}
            readOnly
            maxLength="50"
            name="deviceName"
            type="text"
            className="bg-[#ffe374] block w-80 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
          <button
            onClick={openNoticeModal}
            type="button"
            className="ml-2 relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            공지조회
          </button>
          <NoticeModal
            isOpen={noticeModalIsOpen}
            onRequestClose={closeNoticeModal}
            signageId={data.deviceId}
          />

          <Switch
            checked={enabled}
            onChange={handleToggle}
            className="ml-auto group relative inline-flex h-6 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 data-[checked]:bg-orange-600"
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${
                enabled ? "translate-x-10" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
            <span
              className={`absolute left-2 text-sm font-medium transition duration-200 ease-in-out ${
                enabled ? "opacity-100" : "opacity-0"
              }`}
            >
              ON
            </span>
            <span
              className={`absolute right-2 text-sm font-medium transition duration-200 ease-in-out ${
                enabled ? "opacity-0" : "opacity-100"
              }`}
            >
              OFF
            </span>
          </Switch>
        </div>

        <div className="flex items-center mt-5">
          <input
            type="text"
            value={data.location}
            readOnly
            className="flex-auto bg-[#ffe374] block w-80 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
          <button
            onClick={openModal}
            type="button"
            className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            위치 보기
          </button>
          <LocationModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            address={data.location}
          />

          <input
            type="text"
            value={formattedDate}
            readOnly
            className="flex-none bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            value={data.macAddress}
            type="text"
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
          <button
            type="button"
            className="ml-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Link to={SIGNAGE_UPDATE_FORM + `/${data.deviceId}`}>
              정보 수정
            </Link>
          </button>
        </div>

        <div className="flex items-center mt-5">
          <input
            value={data.screenSize}
            type="text"
            className="flex-none bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            value={data.resolution}
            type="text"
            className="flex-1 bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            type="text"
            value={
              data.accountList &&
              data.accountList
                .map((account) => `${account.name}(${account.accountId})`)
                .join(", ")
            }
            readOnly
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
        </div>

        <div className="flex items-center mt-5">
          <button
            onClick={openResourceModal}
            type="button"
            className="ml-2 rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            영상/이미지 불러오기
          </button>
          <SignageResourceModal
            isOpen={resourceModalIsOpen}
            onRequestClose={closeResourceModal}
          />
        </div>

        <div className="flex items-center mt-5">
          <div className="flex-auto bg-[#ffe374] ml-2 px-4 py-60"></div>
          <div className="flex-auto bg-[#ffe374] ml-2 px-4 py-60"></div>
        </div>

        <div className="flex items-center mt-5 justify-between">
          <button
            type="button"
            className="ml-2 rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={onCancel}
          >
            뒤로가기
          </button>
          <button
            type="button"
            className="rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            재생
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignageDtl;
