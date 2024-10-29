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
import { format } from "date-fns";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import CheckboxTable from "../../components/CheckboxTable";

const TrashNoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotices, setSelectedNotices] = useState(new Set());

  const postsPerPage = 15;
  const checked = true;

  useEffect(() => {
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
        setLoading(false);
      })
      .catch((err) => {
        setError("데이터를 가져오는 데 실패했습니다.");
        console.log(err);
      })
      .finally(() => {});
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

  const handleActivation = async () => {
    if (window.confirm("선택한 공지를 활성화하시겠습니까?")) {
      try {
        const deletePromises = [...selectedNotices].map((id) =>
          fetcher.post(`${ACTIVE_NOTICE}/${id}`)
        );
        await Promise.all(deletePromises);
        setNotices(
          notices.filter((notice) => !selectedNotices.has(notice.noticeId))
        );
        setSelectedNotices(new Set());
        window.alert("선택한 공지를 활성화하였습니다.");
      } catch (err) {
        console.error("공지 활성화 오류:", err);
        window.alert("공지 활성화에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mx-auto whitespace-nowrap py-6 px-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        비활성화 공지글 관리
      </h1>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1);
        }}
        searchOptions={[
          { value: "title", label: "제목" },
          { value: "account", label: "작성자" },
          { value: "regTime", label: "등록일" },
        ]}
        defaultCategory="title"
      />

      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={handleActivation}
          type="button"
          className="mr-2 rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
        >
          활성화
        </button>
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

export default TrashNoticeBoard;
