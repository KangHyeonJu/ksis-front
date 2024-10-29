import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { ACCESSLOG_LIST } from "../../../constants/api_constant";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ACCESSLOG_INVENTORY,
  ACTIVITYLOG_INVENTORY,
  MAIN,
  UPLOADLOG_INVENTORY,
} from "../../../constants/page_constant";
import { format } from "date-fns";
import { decodeJwt } from "../../../decodeJwt";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

const AccessLogBoard = () => {
  const [logList, setLogList] = useState([]); // 현재 페이지 데이터
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [startTime, setStartTime] = useState(); // 검색 시작기간
  const [endTime, setEndTime] = useState(); // 검색 시작기간
  const [searchCategory, setSearchCategory] = useState("account"); // 검색 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 10; // 한 페이지 10개 데이터
  const [loading, setLoading] = useState(true);

  const userInfo = decodeJwt();
  const navigate = useNavigate();
  const location = useLocation();

  const loadPage = async () => {
    if (userInfo.roles !== "ROLE_ADMIN") {
      alert("접근권한이 없습니다.");
      navigate(MAIN);
    }

    try {
      const response = await fetcher.get(ACCESSLOG_LIST, {
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
    } finally {
      setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        접근 로그
      </h1>

      {/* SearchBar 컴포넌트 사용 */}
      <SearchBar
        onSearch={(term, category, start, end) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setStartTime(start);
          setEndTime(end);
          setCurrentPage(1); // 검색 시 첫 페이지로 이동
        }}
        searchOptions={[
          { value: "account", label: "아이디" },
          { value: "detail", label: "내용" },
        ]}
        defaultCategory="account"
        useDate={true} // 날짜 옵션 활성화
        selectOptions={{
          detail: [
            { value: "ACCOUNT_INFO", label: "ACCOUNT_INFO" },
            { value: "NOTIFICATION", label: "NOTIFICATION" },
            { value: "MAIN", label: "MAIN" },
            { value: "ACCOUNT_LIST", label: "ACCOUNT_LIST" },
            { value: "LOG", label: "LOG" },
            { value: "IMAGE", label: "IMAGE" },
            { value: "VIDEO", label: "VIDEO" },
            { value: "NOTICE", label: "NOTICE" },
            { value: "SIGNAGE", label: "SIGNAGE" },
            { value: "PC", label: "PC" },
            { value: "API", label: "API" },
            { value: "FILE_SIZE", label: "FILE_SIZE" },
            { value: "LOGIN", label: "LOGIN" },
            { value: "LOGOUT", label: "LOGOUT" },
            { value: "UPLOAD", label: "UPLOAD" },
            { value: "UPLOAD_PROGRESS", label: "UPLOAD_PROGRESS" },
          ],
        }}
      />

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

      <table className="min-w-full mt-4 table-fixed">
        <thead className=" border-t border-b  border-double border-[#FF9C00]">
          <tr className="text-gray-800">
            <th className="w-1/5">접근일시</th>
            <th className="w-1/5">이름(아이디)</th>
            <th className="w-3/5">내용</th>
          </tr>
        </thead>
        <tbody>
          {logList.map((log) => (
            <tr key={log.logId}>
              <td className="text-center p-2 border-b border-gray-300">
                {format(new Date(log.dateTime), "yyyy-MM-dd HH:mm:ss")}
              </td>
              <td className="text-center p-2 border-b border-gray-300">
                {log.account.name}({log.account.accountId})
              </td>
              <td className="p-2 border-b border-gray-300">{log.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Stack spacing={2} className="mt-10">
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

export default AccessLogBoard;
