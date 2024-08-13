import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetcher from "../../../fetcher";
import { PC_LIST } from "../../../constants/api_constant";
import { PC_UPDATE_FORM } from "../../../constants/page_constant";
import LocationModal from "../../components/LocationModal";
import { Switch } from "@headlessui/react";
const SignageDtl = () => {
  const [enabled, setEnabled] = useState(false);

  //불러오기
  const [data, setData] = useState({});
  const params = useParams();

  const loadPcDtl = async (pcId) => {
    try {
      const response = await fetcher.get(PC_LIST + `/${pcId}`);
      const { ...rest } = response.data;
      setData(rest);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    loadPcDtl(params.id);
  }, [params.id]);

  // 이전 페이지로 이동
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  //위치 지도 보기
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
            type="button"
            className="ml-2 relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            공지조회
          </button>

          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group relative inline-flex h-6 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-orange-600"
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
            value={data.regDate}
            readOnly
            className="bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
          <input
            type="text"
            // value={data.accountList
            //   .map((account) => `${account.name}(${account.accountId})`)
            //   .join(", ")}
            readOnly
            className="bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <button
            type="button"
            className="ml-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Link to={PC_UPDATE_FORM + `/${data.deviceId}`}>정보 수정</Link>
          </button>
        </div>

        <div className="flex items-center mt-5">
          <input
            value={data.screenSize}
            type="text"
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            value={data.resolution}
            type="text"
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />

          <input
            value={data.macAddress}
            type="text"
            className="flex-auto bg-[#ffe374] block w-40 ml-2 px-4 py-1.5 text-gray-900 text-center"
          />
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          className="mr-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Link to={PC_UPDATE_FORM + `/${data.deviceId}`}>수정하기</Link>
        </button>
        <button
          type="button"
          className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          onClick={onCancel}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default SignageDtl;
