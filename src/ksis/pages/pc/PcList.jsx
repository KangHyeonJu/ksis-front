import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import fetcher from "../../../fetcher";
import { PC_DELETE, PC_LIST } from "../../../constants/api_constant";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { PC_UPDATE_FORM, PC_FORM } from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ButtonGroup } from "@mui/material";
import Loading from "../../components/Loading";

const PcList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);
  const userInfo = decodeJwt();

  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 10; // 한 페이지 10개 데이터

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  const loadPage = async () => {
    try {
      const response = await fetcher.get(PC_LIST, {
        params: {
          role: userInfo.roles,
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory,
        },
      });
      console.log(response);
      if (response.data) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);

        setLoading(false);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.response?.data || "Unknown error occurred");
    }
  };

  useEffect(() => {
    loadPage();
  }, [currentPage, searchTerm]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleCheckboxChange = (postId) => {
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(postId)) {
        let newCheckedRowId = checkedRowId.filter((e) => e !== postId);
        setCheckedRowId(newCheckedRowId);

        newSelectedPosts.delete(postId);
      } else {
        setCheckedRowId([...checkedRowId, postId]);
        newSelectedPosts.add(postId);
      }
      return newSelectedPosts;
    });
  };

  //pc 삭제
  const deletePc = async (e) => {
    try {
      if (checkedRowId.length === 0) {
        alert("삭제할 PC를 선택해주세요.");
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const queryString = checkedRowId.join(",");

          const response = await fetcher.delete(
            PC_DELETE + "?pcIds=" + queryString
          );

          console.log(response.data);
          setPosts((prevPcList) =>
            prevPcList.filter((pc) => !checkedRowId.includes(pc.deviceId))
          );
          alert("PC가 정상적으로 삭제되었습니다.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto whitespace-nowrap py-6 px-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 mb-4">
        일반 PC 관리
      </h1>

      <div className="flex items-center relative flex-grow border-y border-gray-300 my-10">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-[#444444] font-bold border-x border-gray-300"
        >
          <option value="deviceName">PC명</option>

          {userInfo.roles === "ROLE_ADMIN" ? (
            <option value="account">담당자</option>
          ) : null}
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
        <div className="bg-[#FF9C00] border-x border-[#FF9C00] text-white h-10 w-10 inline-flex items-center text-center">
          <FaSearch className=" w-full" />
        </div>
      </div>

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center p-8 bg-white rounded-sm h-160">
        <table className="w-full table-fixed">
          <thead className="border-t-2 border-[#FF9C00] bg-[#FFF9F2]">
            <tr>
              <th className="w-1/12 p-2 text-center text-gray-800 border-b border-gray-300">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedPosts(
                      isChecked
                        ? new Set(posts.map((post) => post.deviceId))
                        : new Set()
                    );
                  }}
                />
              </th>
              <th className="w-3/12 p-2 text-gray-800 text-center border-b border-gray-300">
                PC명
              </th>
              <th className="w-3/12 p-2 text-gray-800 text-center border-b border-gray-300">
                담당자(아이디)
              </th>
              <th className="w-3/12 p-2 text-gray-800 text-center border-b border-gray-300">
                등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.deviceId} className="hover:bg-gray-100">
                <td className="text-center p-2 border-b border-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post.deviceId)}
                    onChange={() => handleCheckboxChange(post.deviceId)}
                  />
                </td>

                <td className="p-2 text-center border-b border-gray-300 text-[#444444] font-semibold hover:underline">
                  <Link to={PC_UPDATE_FORM + `/${post.deviceId}`}>
                    {post.deviceName}
                  </Link>
                </td>

                <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                  {post.accountList
                    .map((account) => `${account.name}(${account.accountId})`)
                    .join(", ")}
                </td>
                <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                  {format(post.regDate, "yyyy-MM-dd")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userInfo.roles === "ROLE_ADMIN" ? (
        <div className="flex justify-end space-x-2 my-10">
          <Link to={PC_FORM}>
            <button
              type="button"
              className="rounded-smd border border-[#FF9C00] bg-[#FF9C00] text-white px-3 py-2 text-sm font-semibold shadow-sm 
              hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-[#FF9C00] transition duration-200"
            >
              일반 PC 등록
            </button>
          </Link>
          <button
            onClick={deletePc}
            type="button"
            className="rounded-smd border border-[#444444] bg-[#444444] text-white px-3 py-2 text-sm font-semibold shadow-sm 
            hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
          >
            삭제
          </button>
        </div>
      ) : null}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
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

export default PcList;
