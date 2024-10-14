import React, { useEffect, useMemo, useState } from "react";
import fetcher from "../../../fetcher";
import {
  ACCOUNT_FORM,
  ACCOUNT_LIST,
} from "../../../constants/account_constant";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { decodeJwt } from "../../../decodeJwt";
import { MAIN } from "../../../constants/page_constant";

const AccountList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = decodeJwt();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("accountId");

  const postsPerPage = 8;

  const loadPage = async (page) => {
    try {
      const response = await fetcher.get(`${ACCOUNT_LIST}?page=${page}&size=${postsPerPage}&searchTerm=${searchTerm}&searchCategory=${searchCategory}`);
      if (response.data) {
        setPosts(response.data.content  || []);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {

    } finally {
      setLoading(false); // 데이터 로딩 후 로딩 상태 해제
    }
  };

  useEffect(() => {
    // 관리자가 아닌 경우 접근 차단
    if (!userInfo.roles.includes("ROLE_ADMIN")) {
      alert("관리자만 접근 가능합니다.");
      navigate(MAIN);
    } else {
      loadPage();
    }
  }, [navigate, userInfo.roles]);

  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage, searchTerm, searchCategory]);

  const handleToggleActive = async (accountId, isActive) => {
    try {
      const action = isActive ? "활성화" : "비활성화";
      const confirmation = window.confirm(`계정을 ${action}하시겠습니까?`);

      if (!confirmation) {
        return;
      }

      const response = await fetcher.put(
          `${ACCOUNT_FORM}/${accountId}/active`,
          JSON.stringify({
            isActive: isActive,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        // 로컬 상태 업데이트
        alert("비활성화 여부가 변경되었습니다.");
        await loadPage();
      } else {
        console.error("Failed to update account status:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // 검색어를 업데이트
    setCurrentPage(0); // 검색할 때 페이지를 0으로 초기화
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        계정목록
      </h1>

      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="accountId">계정 아이디</option>
          <option value="name">이름</option>
          <option value="businessTel">업무 연락처</option>
          <option value="isActive">비활성화 여부</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="검색어를 입력하세요"
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <Link to={ACCOUNT_FORM}>
          <button
            type="button"
            className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            계정 등록
          </button>
        </Link>
      </div>

      <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300">계정 아이디</th>
            <th className="border border-gray-300">이름</th>
            <th className="border border-gray-300">업무 전화번호</th>
            <th className="border border-gray-300">비활성화 여부</th>
            <th className="border border-gray-300">수정/비활성화</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.accountId}>
              <td className="border border-gray-300 p-2">{post.accountId}</td>
              <td className="border border-gray-300 p-2">{post.name}</td>
              <td className="border border-gray-300 p-2">{post.businessTel}</td>
              <td className="border border-gray-300 p-2">
                {post.isActive ? "True" : "False"}
              </td>
              <td className="border border-gray-300 p-2 flex justify-center">
                <Link
                  to={`/account/${post.accountId}`}
                  className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  수정
                </Link>
                <button
                  className={`mr-2 ${
                    post.isActive
                      ? "bg-green-500 hover:bg-green-700"
                      : "bg-red-500 hover:bg-red-700"
                  } text-white font-bold py-1 px-2 rounded`}
                  onClick={() =>
                    handleToggleActive(post.accountId, post.isActive)
                  }
                >
                  {post.isActive ? "활성화" : "비활성화"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 0 && (
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(selected) => setCurrentPage(selected.selected)}
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

export default AccountList;
