import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { UPLOADLOG_LIST } from "../../../constants/api_constant";
import { FaSearch } from "react-icons/fa";
import {
  ACCESSLOG_INVENTORY,
  ACTIVITYLOG_INVENTORY,
  UPLOADLOG_INVENTORY,
  MAIN,
} from "../../../constants/page_constant";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import CheckboxTable from "../../components/CheckboxTable";

const UploadLogBoard = () => {
  const [loading, setLoading] = useState(true);
  const [logList, setLogList] = useState([]); // 현재 페이지 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [startTime, setStartTime] = useState(); // 검색 시작기간
  const [endTime, setEndTime] = useState(); // 검색 시작기간
  const [searchCategory, setSearchCategory] = useState("account"); // 검색 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 15; // 한 페이지 10개 데이터
  const checked = false;

  const userInfo = decodeJwt();
  const navigate = useNavigate();
  const location = useLocation();

  const loadPage = async () => {
    if (userInfo.roles !== "ROLE_ADMIN") {
      alert("접근권한이 없습니다.");
      navigate(MAIN);
    }

    // 데이터베이스 현제페이지 데이터 들고오기
    try {
      const response = await fetcher.get(UPLOADLOG_LIST, {
        params: {
          page: currentPage - 1, // 서버에서 페이지 번호가 0부터 시작할 수 있으므로
          size: postsPerPage,
          searchTerm,
          searchCategory,
          startTime,
          endTime,
        },
      });
      if (response.data) {
        setLogList(response.data.content); // 현재 페이지 데이터
        setTotalPages(response.data.totalPages); // 전체 페이지 수
      } else {
        console.error("No data property in response");
      }

      setLoading(false);
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

  // 로그 카테고리 이동 함수
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

  // 로그 카테고리 선택 시 value 값
  const getCurrentValue = () => {
    if (location.pathname === ACCESSLOG_INVENTORY) {
      return "access";
    } else if (location.pathname === ACTIVITYLOG_INVENTORY) {
      return "activity";
    } else if (location.pathname === UPLOADLOG_INVENTORY) {
      return "upload";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto whitespace-nowrap py-6 px-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        업로드 로그
      </h1>

      <div className="mb-4 flex items-center border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 text-gray-600 font-bold"
        >
          <option value="account">아이디</option>
          <option value="detail">내용</option>
        </select>
        <div className="flex items-center space-x-2 mx-2">
          <input type="date" onChange={handleStartTime} className="p-2 " />
          <spna>~</spna>
          <input type="date" onChange={handleEndTime} className="p-2 " />
        </div>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
            className="w-full p-2 pr-10"
          />
          <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mb-4">
        <select
          className="mr-1 p-2 text-gray-600"
          onChange={handleSelectChange}
          value={getCurrentValue()}
        >
          <option value="access">접근 로그</option>
          <option value="activity">활동 로그</option>
          <option value="upload">업로드 로그</option>
        </select>
      </div>

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center px-8 py-10 bg-white rounded-sm h-170">
        <CheckboxTable
          headers={["접근일시", "이름(아이디)", "내용"]}
          data={logList}
          dataKeys={[
            {
              content: (item) =>
                format(new Date(item.dateTime), "yyyy-MM-dd HH:mm:ss"),
              className:
                "p-2 text-gray-800 text-center border-b border-gray-300",
            },
            {
              content: (item) =>
                item.account.name + "(" + item.account.accountId + ")",
              className:
                "p-2 text-gray-800 text-center border-b border-gray-300",
            },
            {
              content: (item) => item.detail,
              className:
                "p-2 text-gray-800 text-center border-b border-gray-300",
            },
          ]}
          uniqueKey="logId"
          check={checked}
        />
      </div>
      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Stack spacing={2} className="mt-10 items-center">
          <Pagination
            shape="rounded"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </div>
  );
};

export default UploadLogBoard;
