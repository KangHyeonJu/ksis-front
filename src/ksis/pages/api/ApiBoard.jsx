import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BOARD, API_FORM, MAIN } from "../../../constants/page_constant"; // MAIN 상수 추가
import { API_LIST, API_NOTICE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import { decodeJwt } from "../../../decodeJwt";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import ButtonComponentB from "../../components/ButtonComponentB";
import SearchBar from "../../components/SearchBar";
import CheckboxTable from "../../components/CheckboxTable";

const ApiBoard = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("apiName");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postsPerPage = 15;
  const checked = true;
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  return (
    <div className="mx-auto whitespace-nowrap py-6 px-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        API 목록
      </h1>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1);
        }}
        searchOptions={[
          { value: "apiName", label: "이름" },
          { value: "provider", label: "제공업체" },
          { value: "expiryDate", label: "만료일" },
        ]}
        defaultCategory="apiName"
      />

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center px-8 py-10 bg-white rounded-sm h-170">
        {posts.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 w-full">
            등록된 API가 없습니다.
          </p>
        ) : (
          <CheckboxTable
            headers={["API 이름", "제공업체", "만료일"]}
            data={posts}
            dataKeys={[
              {
                content: (item) => (
                  <Link to={API_FORM + `/${item.apiId}`}>{item.apiName}</Link>
                ),
                className:
                  "p-2 text-center border-b border-gray-300 text-[#444444] font-semibold hover:underline",
              },
              {
                content: (item) => item.provider,
                className:
                  "p-2 text-gray-800 text-center border-b border-gray-300",
              },
              {
                content: (item) => format(item.expiryDate, "yyyy-MM-dd"),
                className:
                  "p-2 text-gray-800 text-center border-b border-gray-300",
              },
            ]}
            uniqueKey="apiId"
            selectedItems={selectedPosts}
            setSelectedItems={setSelectedPosts}
            check={checked}
          />
        )}
      </div>

      <div className="flex justify-end space-x-2 my-10">
        <ButtonComponentB
          onClick={() => navigate("/apiform")}
          defaultColor="blue-600"
          shadowColor="blue-800"
        >
          API 등록
        </ButtonComponentB>

        <ButtonComponentB
          onClick={handleDeletePosts}
          defaultColor="red-600"
          shadowColor="red-800"
        >
          삭제
        </ButtonComponentB>
      </div>

      {/* 페이지네이션 */}
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

export default ApiBoard;
