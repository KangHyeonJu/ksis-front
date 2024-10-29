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

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

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
      const response = await fetcher.get(
        `${ACCOUNT_LIST}?page=${
          page - 1
        }&size=${postsPerPage}&searchTerm=${searchTerm}&searchCategory=${searchCategory}`
      );
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
  }, [currentPage, searchTerm]);

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

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
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

      <SearchBar
        onSearch={handleSearch}
        searchOptions={[
          { value: "accountId", label: "계정 아이디" },
          { value: "name", label: "이름" },
          { value: "businessTel", label: "업무 연락처" },
          { value: "isActive", label: "비활성화 여부" },
        ]}
        defaultCategory="accountId"
        selectOptions={{
          isActive: [
            { value: "", label: "전체" },
            { value: "true", label: "비활성화" },
            { value: "false", label: "활성화" },
          ],
        }}
      />

      <div className="flex justify-end space-x-2 mb-4">
        <Link to={ACCOUNT_FORM}>
          <button
            type="button"
            className="rounded-md border border-[#FF9C00] bg-white text-[#FF9C00] py-1 px-2 text-sm font-semibold shadow-sm 
            hover:bg-[#FF9C00] hover:text-white hover:shadow-inner hover:shadow-[#FF9C00] focus-visible:outline-[#FF9C00] transition duration-200"
          >
            계정 등록
          </button>
        </Link>
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
                <Link
                  to={`/account/${post.accountId}`}
                  className="mr-2 rounded-md border border-blue-600 bg-white text-blue-600 py-1 px-2 text-sm font-semibold shadow-sm 
            hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
                >
                  수정
                </Link>
                <button
                  className={`mr-2 w-24 ${
                    post.isActive
                      ? "text-green-600 border-green-600  hover:bg-green-600 hover:text-white  hover:shadow-green-800 focus-visible:outline-green-600 "
                      : "text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:shadow-red-800 focus-visible:outline-red-600"
                  }  font-bold py-1 px-2 rounded-md border text-sm shadow-sm hover:shadow-inner transition duration-200`}
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Stack spacing={2} className="mt-10 items-center">
          <Pagination
            shape="rounded"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color={""}
          />
        </Stack>
      )}
    </div>
  );
};

export default AccountList;
