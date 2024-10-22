import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";
import { NOTICE_FORM, NOTICE_DTL } from "../../../constants/page_constant";
import { NOTICE_ALL, DEACTIVE_NOTICE } from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const NoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title"); // "fileTitle" 대신 "title"로 수정
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotices, setSelectedNotices] = useState([]);

  const postsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const response = await fetcher.get(NOTICE_ALL, {
          params: {
            page: currentPage - 1,
            size: postsPerPage,
            searchTerm,
            searchCategory,
          },
        });
        setNotices(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("데이터를 가져오는 데 실패했습니다.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage, searchTerm, searchCategory]); // searchCategory 추가

  const filteredNotices = useMemo(() => {
    return notices
      .filter((notice) =>
        notice[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
        if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
        return 0;
      });
  }, [notices, searchTerm, searchCategory]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleRegisterClick = () => {
    navigate(NOTICE_FORM); // 공지글 등록 페이지로 이동
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return "날짜 없음";
    }
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  const getDeviceNames = (deviceList) => {
    if (!deviceList || deviceList.length === 0) {
      return "";
    }
    const deviceNames = deviceList.map((device) => device.deviceName);
    return deviceNames.join(", ");
  };

  const handleCheckboxChange = (id) => {
    setSelectedNotices((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((noticeId) => noticeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNotices(filteredNotices.map((notice) => notice.noticeId));
    } else {
      setSelectedNotices([]);
    }
  };

  const handleDectivation = async () => {
    if (window.confirm("선택한 공지를 비활성화하시겠습니까?")) {
      try {
        await Promise.all(
          selectedNotices.map((id) => fetcher.post(`${DEACTIVE_NOTICE}/${id}`))
        );
        setNotices(
          notices.filter((notice) => !selectedNotices.includes(notice.noticeId))
        );
        setSelectedNotices([]);
        window.alert("선택한 공지를 비활성화하였습니다.");
      } catch (err) {
        console.error("공지 비활성화 오류:", err);
        window.alert("공지 비활성화에 실패했습니다.");
      }
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          공지글 관리
        </h1>
      </header>

      {/* 검색바 입력창 */}
      <div className="flex items-center relative flex-grow mb-4 border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-gray-600 font-bold"
        >
          <option value="title">제목</option>
          <option value="account">작성자</option>
          <option value="regTime">등록일</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
             className="w-full p-2"
          />
        </div>
        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleRegisterClick}
          className="relative inline-flex items-center mx-3 rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          공지글 등록
        </button>
        <button
          onClick={handleDectivation}
          type="button"
          className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          비활성화
        </button>
      </div>
      
          <div>
            {filteredNotices.length === 0 ? (
              <p className="text-center text-gray-600 mt-10 w-full">
                공지글이 없습니다.
              </p>
            ) : (
              <table className="w-full table-fixed border-collapse mt-4">
                <thead className="border-t border-b border-double border-[#FF9C00]">
                  <tr>
                    <th className="w-1/12 p-2 text-center text-gray-800">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedNotices.length === filteredNotices.length}
                      />
                    </th>
                    <th className="w-5/12 p-2 text-gray-800 text-center">제목</th>
                    <th className="w-2/12 p-2 text-gray-800 text-center">작성자(아이디)</th>
                    <th className="w-2/12 p-2 text-gray-800 text-center">작성일</th>
                    <th className="w-2/12 p-2 text-gray-800 text-center">재생장치</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotices.map((notice) => (
                    <tr
                      key={notice.noticeId}
                      className={`${notice.role === "ADMIN" ? "font-bold bg-gray-50" : ""} border-b border-gray-300`}
                    >
                      <td className="text-center p-2 border-b border-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedNotices.includes(notice.noticeId)}
                          onChange={() => handleCheckboxChange(notice.noticeId)}
                        />
                      </td>
                      <td className="p-2 text-gray-800 text-left hover:underline hover:text-[#FF9C00] border-b border-gray-300">
                        {notice.role === "ADMIN" ? "📢 " : ""}
                        <Link to={`${NOTICE_DTL}/${notice.noticeId}`}>
                          {notice.title}
                        </Link>
                      </td>
                      <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                        {notice.name} ({notice.accountId})
                      </td>
                      <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                        {formatDate(notice.regDate)}
                      </td>
                      <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                        {getDeviceNames(notice.deviceList)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            )}
          </div>

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

export default NoticeBoard;
