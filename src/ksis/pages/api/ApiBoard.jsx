import React, { useState, useEffect, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BOARD, API_FORM, MAIN } from "../../../constants/page_constant"; // MAIN 상수 추가
import { API_LIST, API_NOTICE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher"; 
import { decodeJwt } from "../../../decodeJwt";

const ApiBoard = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("apiName");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postsPerPage = 5;
  const navigate = useNavigate();
  const accountId = decodeJwt().accountId; // accountId 정의

  useEffect(() => {
    const userInfo = decodeJwt();

    if (!userInfo.roles.includes("ROLE_ADMIN")) {
      alert("관리자 계정만 접근 가능합니다.");
      navigate(MAIN); // MAIN으로 이동
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetcher.get(API_LIST);
        setPosts(response.data);
      } catch (err) {
        setError(err.message || "데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate, accountId]); // navigate와 accountId를 의존성으로 추가

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
      isChecked ? new Set(paginatedPosts.map((post) => post.apiId)) : new Set()
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

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const value = post[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      }),
    [posts, searchTerm, searchCategory]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleApiNameClick = (apiId) => {
    navigate(`${API_FORM}/${apiId}`);
  };

  const isAllSelected =
    paginatedPosts.length > 0 &&
    paginatedPosts.every((post) => selectedPosts.has(post.apiId));

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          API 목록
        </h1>
      </header>
      <div className="mb-6 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-4 p-2 border border-gray-300 rounded-md"
        >
          <option value="apiName">API 이름</option>
          <option value="expiryDate">만료일</option>
          <option value="provider">제공업체</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => navigate("/apiform")}
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          API 등록
        </button>
        <button
          onClick={handleDeletePosts}
          className="relative inline-flex items-center rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          삭제
        </button>
      </div>

      <div>
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 w-full">
            등록된 API가 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th className="border border-gray-300 p-2">API 이름</th>
                <th className="border border-gray-300 p-2">만료일</th>
                <th className="border border-gray-300 p-2">제공업체</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post.apiId}>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.apiId)}
                      onChange={(e) => handleCheckboxChange(post.apiId, e)}
                    />
                  </td>
                  <td
                    className="border border-gray-300 p-2 text-black cursor-pointer"
                    onClick={() => handleApiNameClick(post.apiId)}
                  >
                    {post.apiName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatDate(post.expiryDate)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {post.provider}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredPosts.length > postsPerPage && (
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center mt-4"}
          pageClassName={"mx-1"}
          pageLinkClassName={
            "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          }
          previousClassName={"mx-1"}
          previousLinkClassName={
            "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          }
          nextClassName={"mx-1"}
          nextLinkClassName={
            "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          }
          breakClassName={"mx-1"}
          breakLinkClassName={
            "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          }
          activeClassName={"bg-blue-500 text-white"}
        />
      )}
    </div>
  );
};

export default ApiBoard;
