import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";
import { Link } from "react-router-dom";
import { NOTICE_DTL } from "../../../constants/page_constant";
import { NOTICE_DEACTIVE_ALL, ACTIVE_NOTICE } from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const TrashNoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotices, setSelectedNotices] = useState([]);

  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {

    setLoading(true);
    fetcher
      .get(NOTICE_DEACTIVE_ALL, {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory, // 카테고리 검색에 필요한 필드
        },
      })
      .then((response) => {
        setNotices(response.data.content);
        setTotalPages(response.data.totalPages);
        setFilteredPosts(response.data);
      })
      .catch((err) => {
        setError("데이터를 가져오는 데 실패했습니다.");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, searchTerm]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notices, searchTerm]);



 // 페이지 변경 핸들러
 const handlePageChange = (event, page) => {
  setCurrentPage(page);
};

// 검색어 변경 핸들러
const handleSearch = (e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1); // 검색 시 첫 페이지로 이동
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

  const handleActivation = async () => {
    if (window.confirm("선택한 공지를 활성화하시겠습니까?")) {
      try {
        await Promise.all(selectedNotices.map((id) => fetcher.post(`${ACTIVE_NOTICE}/${id}`)));
        setNotices(notices.filter((notice) => !selectedNotices.includes(notice.noticeId)));
        setSelectedNotices([]);
        window.alert("선택한 공지를 활성화하였습니다.");
      } catch (err) {
        console.error("공지 활성화 오류:", err);
        window.alert("공지 활성화에 실패했습니다.");
      }
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          비활성화 공지글 관리
        </h1>
      </header>

             {/* 검색바 입력창 */}
 <div className="flex items-center relative flex-grow mb-4">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 mr-2 rounded-md bg-[#f39704] text-white"
        >
         <option value="title">제목</option>
          <option value="account">작성자</option>
          <option value="regTime">등록일</option>
          <option value="device">재생장치</option>
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


      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={handleActivation}
          type="button"
          className="mr-2 rounded-md bg-[#6dd7e5]
                                        px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 
                                         focus-visible:outline-blue-600"
        >
          활성화
        </button>
      </div>

      <div>
        {filteredNotices.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 w-full">
            공지글이 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
              <th className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedNotices.length === filteredNotices.length}
                  />
                </th>
                <th className="border border-gray-300 p-2">제목</th>
                <th className="border border-gray-300 p-2">작성자(아이디)</th>
                <th className="border border-gray-300 p-2">작성일</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.noticeId}>
                   <td className="text-center border border-gray-300 p-2">
                    <input
                      type="checkbox"
                      checked={selectedNotices.includes(notice.noticeId)}
                      onChange={() => handleCheckboxChange(notice.noticeId)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-blue-600 font-semibold hover:underline">
                    <Link to={`${NOTICE_DTL}/${notice.noticeIed}`}>
                      {notice.title}
                    </Link>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {notice.name}({notice.accountId})
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatDate(notice.regDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* 페이지네이션 */}
      <Stack spacing={2}
      className="mt-2" >
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

export default TrashNoticeBoard;