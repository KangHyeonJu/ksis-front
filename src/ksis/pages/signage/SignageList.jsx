import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import fetcher from "../../../fetcher";
import { SIGNAGE_DELETE, SIGNAGE_LIST } from "../../../constants/api_constant";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_GRID,
} from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";
import { ToggleSwitch } from "../../css/switch";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const SignageList = () => {
  const userInfo = decodeJwt();

  const [signages, setSignages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);

  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 10; // 한 페이지 10개 데이터

  const loadPage = async () => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + "/all", {
        params: {
          role: userInfo.roles,
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory,
        },
      });
      console.log(response);
      if (response.data) {
        setSignages(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.response?.data || "Unknown error occurred");
    }
  };

  useEffect(() => {
    loadPage();
  }, [currentPage, searchTerm]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleCheckboxChange = (signageId) => {
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(signageId)) {
        let newCheckedRowId = checkedRowId.filter((e) => e !== signageId);
        setCheckedRowId(newCheckedRowId);

        newSelectedPosts.delete(signageId);
      } else {
        setCheckedRowId([...checkedRowId, signageId]);
        newSelectedPosts.add(signageId);
      }
      return newSelectedPosts;
    });
  };

  // const filteredPosts = useMemo(
  //   () =>
  //     signages.filter((signage) => {
  //       const value = signage[searchCategory]?.toLowerCase() || "";
  //       return value.includes(searchTerm.toLowerCase());
  //     }),
  //   [signages, searchTerm, searchCategory]
  // );

  //signage 삭제
  const deleteSignage = async (e) => {
    try {
      if (checkedRowId.length === 0) {
        alert("삭제할 재생장치를 선택해주세요.");
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const queryString = checkedRowId.join(",");

          const response = await fetcher.delete(
            SIGNAGE_DELETE + "?signageIds=" + queryString
          );

          console.log(response.data);
          setSignages((prevSignageList) =>
            prevSignageList.filter(
              (signage) => !checkedRowId.includes(signage.deviceId)
            )
          );
          alert("재생장치가 정상적으로 삭제되었습니다.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 관리
      </h1>

      <div className="flex items-center relative flex-grow mb-4 border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-gray-600 font-bold"
        >
          <option value="deviceName">재생장치명</option>

          {userInfo.roles === "ROLE_ADMIN" ? (
            <option value="account">담당자</option>
          ) : null}
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
            className="w-full p-2  pr-10"
          />
         </div>
         <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>
      <div className="flex justify-between">
        <div>
          <ToggleSwitch />
        </div>
        {userInfo.roles === "ROLE_ADMIN" ? (
          <div className="flex justify-end space-x-2 mb-4">
            <Link to={SIGNAGE_FORM}>
              <button
                type="button"
                className=" rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
          hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
         >
                재생장치 등록
              </button>
            </Link>
            <button
              onClick={deleteSignage}
              type="button"
              className="rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
              hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
>
              삭제
            </button>
          </div>
        ) : null}
      </div>
      <table className="w-full table-fixed border-collapse">
        <thead className="border-t border-b border-double border-[#FF9C00]">
          <tr>
          <th className="w-1/12 p-2 text-center text-gray-800">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedPosts(
                    isChecked
                      ? new Set(signages.map((post) => post.deviceId))
                      : new Set()
                  );
                }}
              />
            </th>
            <th className="w-4/12 p-2 text-gray-800 text-center">재생장치명</th>
            <th className="w-4/12 p-2 text-gray-800 text-center">담당자(아이디)</th>
            <th className="w-3/12 p-2 text-gray-800 text-center">등록일</th>
          </tr>
        </thead>
        <tbody>
          {signages.map((signage) => (
            <tr key={signage.deviceId}>
              <td className="text-center p-2 border-b border-gray-300">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(signage.deviceId)}
                  onChange={() => handleCheckboxChange(signage.deviceId)}
                />
              </td>

              <td className="p-2 text-gray-800 text-center hover:underline hover:text-[#FF9C00] border-b border-gray-300">
                <Link to={SIGNAGE_DTL + `/${signage.deviceId}`}>
                  {signage.deviceName}
                </Link>
              </td>

              <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                {signage.accountList
                  .map((account) => `${account.name}(${account.accountId})`)
                  .join(", ")}
              </td>
              <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                {format(signage.regDate, "yyyy-MM-dd")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {/* 페이지네이션 */}
    {totalPages > 1 && (
  <Stack spacing={2} className="mt-2">
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      color={"primary"}
    />
  </Stack>
)}
    </div>
  );
};

export default SignageList;
