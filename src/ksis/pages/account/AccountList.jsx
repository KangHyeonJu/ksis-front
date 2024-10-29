import React, { useEffect, useState } from "react";
import fetcher from "../../../fetcher";
import {
  ACCOUNT_FORM,
  ACCOUNT_LIST,
} from "../../../constants/account_constant";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { decodeJwt } from "../../../decodeJwt";
import { MAIN } from "../../../constants/page_constant";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import ButtonComponent from "../../components/ButtonComponent";
import ButtonComponentB from "../../components/ButtonComponentB";

const AccountList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = decodeJwt();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("accountId");

  const postsPerPage = 10;

  const loadPage = async (page) => {
    try {
      const response = await fetcher.get(ACCOUNT_LIST, {
        params: {
          page: page - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory,
        },
      });

      if (response.data) {
        setPosts(response.data.content);
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
    setSearchTerm("");
  }, [searchCategory]);

  useEffect(() => {
    // 관리자가 아닌 경우 접근 차단
    if (!userInfo.roles.includes("ROLE_ADMIN")) {
      alert("관리자만 접근 가능합니다.");
      navigate(MAIN);
    } else {
      loadPage(currentPage);
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
        await loadPage(currentPage);
      } else {
        console.error("Failed to update account status:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // 검색어를 업데이트
    setCurrentPage(1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        계정목록
      </h1>

      <div className="flex items-center relative flex-grow mb-4 border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-gray-600 font-bold"
        >
          <option value="accountId">계정 아이디</option>
          <option value="name">이름</option>
          <option value="businessTel">업무 연락처</option>
          <option value="isActive">비활성화 여부</option>
        </select>

        {searchCategory === "isActive" ? (
          <select
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="true">활성화</option>
            <option value="false">비활성화</option>
          </select>
        ) : (
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="검색어를 입력하세요"
              className="w-full p-2"
            />
            <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 mb-4">
        <ButtonComponentB to={ACCOUNT_FORM} defaultColor="[#FF9C00]" shadowColor="[#FF9C00]">
          계정 등록
        </ButtonComponentB>
      </div>

      <table className="min-w-full mt-4 table-fixed">
        <thead className="border-t border-b border-double border-[#FF9C00]">
          <tr className="text-gray-800">
            <th className="w-1/5 ">계정 아이디</th>
            <th className="w-1/5 ">이름</th>
            <th className="w-1/5 ">업무 전화번호</th>
            <th className="w-1/5 ">비활성화 여부</th>
            <th className="w-1/5 ">수정/비활성화</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.accountId}>
              <td className="text-center p-2 border-b border-gray-300">
                {post.accountId}
              </td>
              <td className="text-center p-2 border-b border-gray-300">
                {post.name}
              </td>
              <td className="text-center p-2 border-b border-gray-300">
                {post.businessTel}
              </td>
              <td className="text-center p-2 border-b border-gray-300">
                {post.isActive ? "O" : "X"}
              </td>
              <td className="text-center p-2 border-b border-gray-300 flex justify-center">
                <ButtonComponent
                    to={`/account/${post.accountId}`}
                    defaultColor="blue-600"
                    shadowColor="blue-800"
                >
                  수정
                </ButtonComponent>

                <ButtonComponent
                    onClick={() => handleToggleActive(post.accountId, post.isActive)}
                    defaultColor={post.isActive ? "green-600" : "red-600"}
                    hoverColor={post.isActive ? "green-800" : "red-800"}
                >
                  {post.isActive ? "활성화" : "비활성화"}
                </ButtonComponent>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default AccountList;
