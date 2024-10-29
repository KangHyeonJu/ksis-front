import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";
import { Link } from "react-router-dom";
import { DEACTIVE_NOTICE_DTL } from "../../../constants/page_constant";
import {
  NOTICE_DEACTIVE_ALL,
  ACTIVE_NOTICE,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import ButtonComponentB from "../../components/ButtonComponentB";

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
    return <Loading />;
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
        await Promise.all(
          selectedNotices.map((id) => fetcher.post(`${ACTIVE_NOTICE}/${id}`))
        );
        setNotices(
          notices.filter((notice) => !selectedNotices.includes(notice.noticeId))
        );
        setSelectedNotices([]);
        window.alert("선택한 공지를 활성화하였습니다.");
      } catch (err) {
        console.error("공지 활성화 오류:", err);
        window.alert("공지 활성화에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          비활성화 공지글 관리
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
            className="w-full p-2  pr-10"
          />
        </div>
        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>
      <div className="flex justify-end space-x-2 mb-4">
        <ButtonComponentB
            onClick={handleActivation}
            defaultColor="blue-600"
            shadowColor="blue-800"
        >
          활성화
        </ButtonComponentB>
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
                <th className="w-4/12 p-2">제목</th>
                <th className="w-3/12 p-2">작성자(아이디)</th>
                <th className="w-3/12 p-2">작성일</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.noticeId}>
                  <td className="text-center p-2 border-b border-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedNotices.includes(notice.noticeId)}
                      onChange={() => handleCheckboxChange(notice.noticeId)}
                    />
                  </td>
                  <td className="p-2 text-gray-800 text-left hover:underline hover:text-[#FF9C00] border-b border-gray-300">
                    <Link to={`${DEACTIVE_NOTICE_DTL}/${notice.noticeId}`}>
                      {notice.title}
                    </Link>
                  </td>
                  <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                    {notice.name}({notice.accountId})
                  </td>
                  <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                    {formatDate(notice.regDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TrashNoticeBoard;
