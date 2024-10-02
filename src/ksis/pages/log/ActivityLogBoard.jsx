import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { ACTIVITYLOG_LIST } from "../../../constants/api_constant";
import { FaSearch } from "react-icons/fa";
import {
  ACCESSLOG_INVENTORY,
  ACTIVITYLOG_INVENTORY,
  UPLOADLOG_INVENTORY,
  MAIN,
} from "../../../constants/page_constant";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ActivityLogBoard = () => {
  const [logList, setLogList] = useState([]); // 현재 페이지 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [startTime, setStartTime] = useState(); // 검색 시작기간
  const [endTime, setEndTime] = useState(); // 검색 시작기간
  const [searchCategory, setSearchCategory] = useState("account"); // 검색 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 10; // 한 페이지 10개 데이터

  const navigate = useNavigate();
  const location = useLocation();

  const authority = localStorage.getItem("authority");

  const loadPage = async () => {
    if (authority !== "ROLE_ADMIN") {
      alert("접근권한이 없습니다.");
      navigate(MAIN);
    }

    try {
      const response = await fetcher.get(ACTIVITYLOG_LIST, {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory,
          startTime,
          endTime,
        },
      });
      if (response.data) {
        setLogList(response.data.content);
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
  }, [currentPage, searchTerm, startTime, endTime]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 검색 시작기간 핸들러
  const handleStartTime = (e) => {
    setStartTime(e.target.value);
    setCurrentPage(1);
  };

  // 검색 종료기간 핸들러
  const handleEndTime = (e) => {
    setEndTime(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "access") {
      navigate(ACCESSLOG_INVENTORY);
    } else if (selectedValue === "activity") {
      navigate(ACTIVITYLOG_INVENTORY);
    } else if (selectedValue === "upload") {
      navigate(UPLOADLOG_INVENTORY);
    }
  };

  const getCurrentValue = () => {
    if (location.pathname === ACCESSLOG_INVENTORY) {
      return "access";
    } else if (location.pathname === ACTIVITYLOG_INVENTORY) {
      return "activity";
    } else if (location.pathname === UPLOADLOG_INVENTORY) {
      return "upload";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        활동 로그
      </h1>

      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="account">아이디</option>
          <option value="detail">내용</option>
        </select>
        <div className="flex items-center space-x-2 mx-2">
          <input
            type="date"
            onChange={handleStartTime}
            className="p-2 border border-gray-300 rounded-md"
          />
          <spna>~</spna>
          <input
            type="date"
            onChange={handleEndTime}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
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
      <div className="flex justify-end space-x-2 mb-4">
        <select
          className="mr-1 p-2 border bg-[#ffb246] rounded-md"
          onChange={handleSelectChange}
          value={getCurrentValue()}
        >
          <option value="access">접근 로그</option>
          <option value="activity">활동 로그</option>
          <option value="upload">업로드 로그</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300">접근일시</th>
            <th className="border border-gray-300">이름(아이디)</th>
            <th className="border border-gray-300">내용</th>
          </tr>
        </thead>
        <tbody>
          {logList.map((log) => (
            <tr key={log.logId}>
              <td className="border border-gray-300 p-2">
                {format(new Date(log.dateTime), "yyyy-MM-dd HH:mm:ss")}
              </td>
              <td className="border border-gray-300 p-2">
                {log.account.name}({log.account.accountId})
              </td>
              <td className="border border-gray-300 p-2">{log.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Stack spacing={2}>
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

export default ActivityLogBoard;
