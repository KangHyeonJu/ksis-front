import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import fetcher from "../../../fetcher";
import {
  SIGNAGE_ADD,
  SIGNAGE_ACCOUNT,
  RESOLUTION,
} from "../../../constants/api_constant";
import { SIGNAGE_INVENTORY } from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";

const SignageForm = () => {
  //가로세로크기
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [accounts, setAccounts] = useState([]);
  const [resolutions, setResolution] = useState([]);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const navigate = useNavigate();
  const userInfo = decodeJwt();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //해상도
  const [selectedValue, setSelectedValue] = useState();
  const handleChange = (e) => {
    setSelectedValue(e.currentTarget.value);
  };

  //주소불러오기
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // 주소 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        //주소 정보를 해당 필드에 넣는다.
        setAddress(addr);
        document.getElementById("detailAddress").focus();
        setTimeout(() => {
          const detailAddressInput = document.getElementById("detailAddress");
          if (detailAddressInput) {
            detailAddressInput.focus();
          }
        }, 0);
      },
      left: window.screen.width / 2 - 500 / 2,
      top: window.screen.height / 2 - 600 / 2,
    }).open();
  };

  //전체 user불러오기, 해상도 불러오기
  const loadPage = async () => {
    try {
      if (userInfo.roles !== "ROLE_ADMIN") {
        alert("접근권한이 없습니다.");
        navigate(SIGNAGE_INVENTORY);
      }
      const [responseAccount, responseResolution] = await Promise.all([
        fetcher.get(SIGNAGE_ACCOUNT),
        fetcher.get(RESOLUTION),
      ]);
      if (responseAccount.data && responseResolution.data) {
        setAccounts(responseAccount.data);
        setResolution(responseResolution.data);
      } else {
        console.error("No data property in response");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.response?.data || "Unknown error occurred");
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  // 이전 페이지로 이동
  const onCancel = () => {
    navigate(-1);
  };

  //post
  const [data, setData] = useState({
    ipAddress: "",
    deviceName: "",
    location: "",
    detailAddress: "",
    deviceType: "SIGNAGE",
    resolution: "",
    screenSize: "",
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      location: address,
      resolution: selectedValue,
      screenSize: width + " x " + height,
    }));
  }, [address, selectedValue, width, height]);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e) => {
    try {
      e.preventDefault();

      if (address === "") {
        setAddressError("위치를 입력하세요.");
        document.getElementById("address").focus();
        return false;
      }

      const ipRegex =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

      if (data.ipAddress === "" || !ipRegex.test(data.ipAddress)) {
        setError("유효한 IP주소를 입력하세요.");
        document.getElementById("ipAddress").focus();
        return false;
      }

      const formData = new FormData();
      formData.append(
        "signageFormDto",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      const accountIds = responsibles.map((responsible) => {
        const selectElement = document.getElementById(
          `responsible-${responsible.id}`
        );
        return selectElement ? selectElement.value : "";
      });

      formData.append(
        "accountList",
        new Blob([JSON.stringify(accountIds)], { type: "application/json" })
      );

      if (window.confirm("등록하시겠습니까?")) {
        const response = await fetcher.post(SIGNAGE_ADD, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);

        if (response.status === 200) {
          alert("재생장치가 정상적으로 등록되었습니다.");
          navigate(SIGNAGE_INVENTORY);
        } else {
          alert("재생장치 등록을 실패했습니다.");
          return;
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //담당자 +, - 버튼
  const [responsibles, setResponsibles] = useState([{ id: 0, accountId: "" }]);

  const addResponsible = () => {
    setResponsibles((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 0, accountId: "" },
    ]);
  };

  const removeResponsible = (id) => {
    setResponsibles((prev) =>
      prev.filter((responsible) => responsible.id !== id)
    );
  };

  const handleResponsibleChange = (e, index) => {
    const { value } = e.target;
    const newResponsibles = [...responsibles];
    newResponsibles[index].accountId = value;
    setResponsibles(newResponsibles);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 등록
      </h1>
      <form
        onSubmit={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="shadow-sm ring-1 ring-gray-900/5 text-center pt-5 pb-5">
          <div className="flex items-center">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              재생장치 이름
            </label>
            <input
              required
              minLength="2"
              maxlength="10"
              value={data.deviceName}
              onChange={(e) => {
                onChangeHandler(e);
              }}
              name="deviceName"
              type="text"
              className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {responsibles.map((responsible, index) => (
            <div className="flex items-center mt-5" key={responsible.id}>
              <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                담당자
              </label>
              <select
                required
                id={`responsible-${responsible.id}`}
                onChange={(e) => handleResponsibleChange(e, index)}
                className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">담당자 선택</option>
                {accounts.map((account) => (
                  <option value={account.accountId} key={account.accountId}>
                    {account.name}({account.accountId})
                  </option>
                ))}
              </select>
              {responsibles.length > 1 && (
                <>
                  <button onClick={addResponsible} className="ml-2">
                    <AiFillPlusCircle size={25} color="#f25165" />
                  </button>
                  <button
                    onClick={() => removeResponsible(responsible.id)}
                    className="ml-2"
                  >
                    <AiFillMinusCircle size={25} color="#717273" />
                  </button>
                </>
              )}
              {responsibles.length === 1 && (
                <button onClick={addResponsible} className="ml-2">
                  <AiFillPlusCircle size={25} color="#f25165" />
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold  leading-6 text-gray-900">
              위치
            </label>
            <input
              id="address"
              type="text"
              value={address}
              readOnly
              className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="ml-2 bg-[#ffe69c] rounded-full px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-yellow-50"
              onClick={execDaumPostcode}
            >
              주소검색
            </button>
            {addressError && (
              <p className="text-red-500 text-sm ml-2">{addressError}</p>
            )}
          </div>
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold  leading-6 text-gray-900"></label>
            <input
              required
              placeholder=" 상세주소"
              id="detailAddress"
              value={data.detailAddress}
              onChange={onChangeHandler}
              name="detailAddress"
              className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              IP주소
            </label>
            <input
              required
              id="ipAddress"
              onChange={onChangeHandler}
              value={data.ipAddress}
              type="text"
              name="ipAddress"
              className="block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#ffe69c]"
            />
            {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
          </div>
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              해상도
            </label>
            <select
              required
              onChange={handleChange}
              value={selectedValue}
              className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">해상도 선택</option>
              {resolutions.map((resolution) => (
                <option
                  value={`${resolution.name} (${resolution.width} x ${resolution.height})`}
                  key={resolution.resolutionId}
                >
                  {resolution.name}({resolution.width} x {resolution.height})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              너비(W)
            </label>
            <input
              required
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
              className="bg-[#ffe69c] block w-40 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="ml-2">(cm 기준)</p>
          </div>
          <div className="flex items-center mt-5">
            <label className="w-40 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              높이(H)
            </label>
            <input
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              className="bg-[#ffe69c] block w-40 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <p className="ml-2">(cm 기준)</p>
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
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
      </form>
    </div>
  );
};

export default SignageForm;
