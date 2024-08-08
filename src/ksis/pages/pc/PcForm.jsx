import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";

const PcForm = () => {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const [data, setPData] = useState([
    // macAddress: "",
    // deviceName: "",
    // location: "",
    // screenSize: "",
    // resolution: "",
    // detailAddress: "",
    // isShow: true,
    // deviceType: "PC"
  ]);

  // const loadPage = async () => {};

  // useEffect(() => {
  //   loadPage();
  // }, []);

  const [responsibles, setResponsibles] = useState([0]); // 담당자 박스의 상태

  const addResponsible = () => {
    setResponsibles([...responsibles, responsibles.length]);
  };

  const removeResponsible = (index) => {
    setResponsibles(responsibles.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        일반 PC 등록
      </h1>
      <div className="shadow-sm ring-1 ring-gray-900/5 text-center">
        <div className="flex items-center mt-2">
          <label
            htmlFor="name"
            className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900"
          >
            PC 이름
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder=""
            className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {responsibles.map((_, index) => (
          <div className="flex items-center mt-2" key={index}>
            <label
              htmlFor={`responsible-${index}`}
              className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900"
            >
              담당자
            </label>
            <select
              id={`responsible-${index}`}
              name={`responsible-${index}`}
              className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option></option>
              <option>강현주</option>
              <option>방재혁</option>
              <option>백민규</option>
              <option>신지원</option>
              {/* 추가적인 옵션들 */}
            </select>
            {responsibles.length > 1 && (
              <>
                <button onClick={addResponsible} className="ml-2">
                  <AiFillPlusCircle size={25} color="#f25165" />
                </button>
                <button
                  onClick={() => removeResponsible(index)}
                  className="ml-2"
                >
                  <AiFillMinusCircle size={25} color="#717273" />
                </button>
              </>
            )}
            {responsibles.length === 1 && (
              <button onClick={addResponsible}>
                <AiFillPlusCircle size={25} color="#f25165" />
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center mt-2">
          <label
            htmlFor="name"
            className="w-20 ml-px block pl-4 text-sm font-semibold  leading-6 text-gray-900"
          >
            위치
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder=""
            className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            type="button"
            className=" bg-[#ffe69c] rounded-full bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-yellow-50"
          >
            주소검색
          </button>
        </div>
        <div className="flex items-center mt-2">
          <label
            htmlFor="name"
            className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900"
          >
            Mac주소
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder=""
            className="block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#ffe69c]"
          />
        </div>
      </div>
      <div className="mt-2">
        <button
          type="button"
          className="mr-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          등록하기
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

export default PcForm;
