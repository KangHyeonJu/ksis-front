import React, { useEffect, useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import fetcher from "../../../fetcher";
import { SIGNAGE_LIST } from "../../../constants/api_constant";
import { Link } from "react-router-dom";
import {
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_INVENTORY,
} from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";
import { ToggleSwitch } from "../../css/switch";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const SignageGrid = () => {
  const userInfo = decodeJwt();
  const [signages, setSignages] = useState([]);

  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 8; // 한 페이지 8개 데이터

  const loadPage = async () => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + `/grid`, {
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 관리
      </h1>

      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 border border-gray-300 rounded-md"
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
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
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
                className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                재생장치 등록
              </button>
            </Link>
          </div>
        ) : null}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
        {signages.map((signage) => (
          <div
            key={signage.deviceId}
            className="group relative border-2 border-[#fcc310] rounded-md p-3"
          >
            <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
              <img
                alt={signage.deviceName}
                src={signage.thumbNail}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-2 text-gray-700 text-center w-full border-2 border-[#fcc310] rounded-md p-1">
              재생장치 : {signage.deviceName}
            </div>
            <Link to={SIGNAGE_DTL + `/${signage.deviceId}`}>
              <button
                type="button"
                className="mt-2 bg-[#fad96e] w-full rounded-md p-1"
              >
                상세보기
              </button>
            </Link>
          </div>
        ))}
      </div>

      <Stack spacing={2} className="mt-5">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color={"primary"}
        />
      </Stack>
    </div>
  );
};

export default SignageGrid;
