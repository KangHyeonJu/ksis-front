import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import fetcher from "../../../fetcher";
import { PC_ACCOUNT, PC_LIST } from "../../../constants/api_constant";
import { PC_INVENTORY } from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";

const PcUpdateForm = () => {
  //불러오기
  const [data, setData] = useState({});
  const params = useParams();
  const [responsibles, setResponsibles] = useState([{ id: 0, accountId: "" }]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const userInfo = decodeJwt();
  const [loading, setLoading] = useState(true);

  const loadPcDtl = async (pcId) => {
    try {
      const response = await fetcher.get(PC_LIST + `/${pcId}`);

      if (
        userInfo.roles !== "ROLE_ADMIN" &&
        !response.data.accountList.some(
          (i) => i.accountId === userInfo.accountId
        )
      ) {
        alert("접근권한이 없습니다.");
        navigate(PC_INVENTORY);
      }

      const { accountList, location, macAddress, ...rest } = response.data;
      setData(rest);
      setAddress(location);
      setMacAddress(macAddress);

      setResponsibles(
        accountList.map((account, index) => ({
          id: index,
          accountId: account.accountId,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    loadPcDtl(params.id);
  }, [params.id]);

  //mac 주소 검증
  const [macAddress, setMacAddress] = useState("");
  const [error, setError] = useState("");

  const handleMacAddressChange = (e) => {
    let value = e.target.value;

    value = value.replace(/:/g, "");

    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    value = value.match(/.{1,2}/g)?.join(":") || "";

    setMacAddress(value);
  };

  //주소불러오기
  const [address, setAddress] = useState("");

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

  //전체 user불러오기
  const [accounts, setAccounts] = useState([]);

  const accountGet = async () => {
    try {
      const response = await fetcher.get(PC_ACCOUNT);
      console.log(response);
      if (response.data) {
        setAccounts(response.data);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.response?.data || "Unknown error occurred");
    }
  };

  useEffect(() => {
    accountGet();
  }, []);

  // 이전 페이지로 이동
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  //patch
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      macAddress: macAddress,
      location: address,
    }));
  }, [macAddress, address]);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e) => {
    try {
      e.preventDefault();

      setIsDisabled(false);
      setIsReadOnly(false);

      const macRegex = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;

      if (macAddress === "" || !macRegex.test(macAddress)) {
        setError("유효한 mac주소를 입력하세요.");
        document.getElementById("macAddress").focus();
        return false;
      }

      const formData = new FormData();
      formData.append(
        "pcFormDto",
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

      if (window.confirm("수정하시겠습니까?")) {
        const response = await fetcher.patch(PC_LIST, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);

        if (response.status === 200) {
          alert("PC가 정상적으로 수정되었습니다.");
          setIsDisabled(true);
          setIsReadOnly(true);
          navigate(PC_INVENTORY);
        } else if (response.status === 202) {
          alert("이미 등록된 MAC주소입니다.");
          return;
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  //담당자 +, - 버튼

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
        일반 PC 수정
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
            <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              PC 이름
            </label>
            <input
              required
              value={data.deviceName}
              onChange={(e) => {
                onChangeHandler(e);
              }}
              maxLength="50"
              name="deviceName"
              type="text"
              className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            />
          </div>
          {responsibles.map((responsible, index) => (
            <div className="flex items-center mt-5" key={responsible.id}>
              <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
                담당자
              </label>
              {userInfo.roles === "ROLE_ADMIN" ? (
                <>
                  <select
                    required
                    value={responsible.accountId}
                    id={`responsible-${responsible.id}`}
                    onChange={(e) => handleResponsibleChange(e, index)}
                    className="bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
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
                </>
              ) : (
                <>
                  <select
                    disabled={isDisabled}
                    value={responsible.accountId}
                    id={`responsible-${responsible.id}`}
                    onChange={(e) => handleResponsibleChange(e, index)}
                    className="bg-[#e7d8ac] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                  >
                    <option>담당자 선택</option>
                    {accounts.map((account) => (
                      <option value={account.accountId} key={account.accountId}>
                        {account.name}({account.accountId})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          ))}

          <div className="flex items-center mt-5">
            <label className="w-20 ml-px block pl-4 text-sm font-semibold  leading-6 text-gray-900">
              위치
            </label>
            <input
              type="text"
              value={address}
              readOnly
              className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              className="ml-2 bg-[#ffe69c] rounded-full px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-yellow-50"
              onClick={execDaumPostcode}
            >
              주소검색
            </button>
          </div>
          <div className="flex items-center mt-5">
            <label className="w-20 ml-px block pl-4 text-sm font-semibold  leading-6 text-gray-900"></label>
            <input
              required
              placeholder=" 상세주소"
              type="text"
              id="detailAddress"
              value={data.detailAddress}
              onChange={onChangeHandler}
              name="detailAddress"
              className=" bg-[#ffe69c] block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="flex items-center mt-5">
            <label className="w-20 ml-px block pl-4 text-sm font-semibold leading-6 text-gray-900">
              Mac주소
            </label>
            {userInfo.roles === "ROLE_ADMIN" ? (
              <input
                required
                id="macAddress"
                onChange={handleMacAddressChange}
                value={macAddress}
                type="text"
                className="block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-[#ffe69c]"
              />
            ) : (
              <input
                readOnly={isReadOnly}
                value={macAddress}
                type="text"
                className="block w-80 ml-2 rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-[#e7d8ac]"
              />
            )}
            {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="mr-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            수정하기
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

export default PcUpdateForm;
