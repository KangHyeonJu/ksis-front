import React, { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BOARD, API_FORM, MAIN } from "../../../constants/page_constant"; // MAIN 상수 추가
import { API_LIST, API_NOTICE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import { decodeJwt } from "../../../decodeJwt";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ApiBoard = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("apiName");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = decodeJwt();

    if (!userInfo.roles.includes("ROLE_ADMIN")) {
      alert("관리자 계정만 접근 가능합니다.");
      navigate(MAIN); // MAIN으로 이동
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetcher.get(API_LIST, {
          params: {
            page: currentPage - 1,
            size: postsPerPage,
            searchTerm,
            searchCategory,
          },
        });
        setTotalPages(response.data.totalPages);
        setPosts(response.data.content);
      } catch (err) {
        setError(err.message || "데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchTerm]); // navigate와 accountId를 의존성으로 추가

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleCheckboxChange = (postId, event) => {
    event.stopPropagation();
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(postId)) {
        newSelectedPosts.delete(postId);
      } else {
        newSelectedPosts.add(postId);
      }
      return newSelectedPosts;
    });
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectedPosts(
      isChecked ? new Set(posts.map((post) => post.apiId)) : new Set()
    );
  };

  const handleDeletePosts = async () => {
    if (selectedPosts.size === 0) {
      alert("삭제할 게시글을 선택해주세요.");
      return;
    }
    // 삭제 확인 창 추가
    const confirmMessage = "선택한 게시글을 삭제하시겠습니까?";
    const isConfirmed = window.confirm(confirmMessage);

    if (!isConfirmed) {
      return; // 사용자가 취소한 경우 함수 종료
    }
    try {
      const deletePromises = [...selectedPosts].map((id) =>
        fetcher(API_NOTICE + `/${id}`, {
          method: "DELETE",
        })
      );
      await Promise.all(deletePromises);

      setPosts((prevPosts) =>
        prevPosts.filter((post) => !selectedPosts.has(post.apiId))
      );
      setSelectedPosts(new Set());
      alert("선택된 게시글이 삭제되었습니다.");
      navigate(API_BOARD); // navigate 수정
    } catch (err) {
      console.error("Error deleting posts:", err);
      setError("게시글 삭제 중 오류가 발생했습니다.");
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  };

  const handleApiNameClick = (apiId) => {
    navigate(`${API_FORM}/${apiId}`);
  };

  const isAllSelected =
    posts.length > 0 && posts.every((post) => selectedPosts.has(post.apiId));

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  return (
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          API 목록
        </h1>
      </header>

      <div className="flex items-center relative flex-grow mb-4 border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-gray-600 font-bold"
        >
          <option value="apiName">이름</option>
          <option value="provider">제공업체</option>
          <option value="expiryDate">만료일</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색..."
            className="w-full p-2"
          />
        </div>
        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => navigate("/apiform")}
          className="mr-2 rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
          hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
        >
          API 등록
        </button>
        <button
          onClick={handleDeletePosts}
          className="rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
          hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
        >
          삭제
        </button>
      </div>

      <div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 w-full">
            등록된 API가 없습니다.
          </p>
        ) : (
          <table className="w-full table-fixed border-collapse mt-4">
            <thead className="border-t border-b border-double border-[#FF9C00]">
              <tr>
                <th className="w-1/12 p-2 text-center text-gray-800">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th className="w-3/12 p-2 text-gray-800 text-center">
                  API 이름
                </th>
                <th className="w-4/12 p-2 text-gray-800 text-center">만료일</th>
                <th className="w-4/12 p-2 text-gray-800 text-center">
                  제공업체
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.apiId}>
                  <td className="text-center p-2 border-b border-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.apiId)}
                      onChange={(e) => handleCheckboxChange(post.apiId, e)}
                    />
                  </td>
                  <td
                    className="p-2 text-gray-800 text-center border-b border-gray-300 hover:underline hover:text-[#FF9C00] cursor-pointer"
                    onClick={() => handleApiNameClick(post.apiId)}
                  >
                    {post.apiName}
                  </td>
                  <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                    {formatDate(post.expiryDate)}
                  </td>
                  <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                    {post.provider}
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

export default ApiBoard;
