import React, { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import fetcher from "../../../fetcher";
import { SIGNAGE_DELETE, SIGNAGE_LIST } from "../../../constants/api_constant";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_GRID,
} from "../../../constants/page_constant";
import { decodeJwt } from "../../../decodeJwt";
import { ToggleSwitch } from "../../css/switch";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

const SignageList = () => {
  const userInfo = decodeJwt();

  const [signages, setSignages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 15;

  const loadPage = async () => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + "/all", {
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
        setSignages(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.response?.data || "Unknown error occurred");
    } finally {
      setLoading(false);
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

  const handleCheckboxChange = (signageId) => {
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(signageId)) {
        let newCheckedRowId = checkedRowId.filter((e) => e !== signageId);
        setCheckedRowId(newCheckedRowId);

        newSelectedPosts.delete(signageId);
      } else {
        setCheckedRowId([...checkedRowId, signageId]);
        newSelectedPosts.add(signageId);
      }
      return newSelectedPosts;
    });
  };

  // const filteredPosts = useMemo(
  //   () =>
  //     signages.filter((signage) => {
  //       const value = signage[searchCategory]?.toLowerCase() || "";
  //       return value.includes(searchTerm.toLowerCase());
  //     }),
  //   [signages, searchTerm, searchCategory]
  // );

  //signage 삭제
  const deleteSignage = async (e) => {
    try {
      if (checkedRowId.length === 0) {
        alert("삭제할 재생장치를 선택해주세요.");
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const queryString = checkedRowId.join(",");

          const response = await fetcher.delete(
            SIGNAGE_DELETE + "?signageIds=" + queryString
          );

          console.log(response.data);
          setSignages((prevSignageList) =>
            prevSignageList.filter(
              (signage) => !checkedRowId.includes(signage.deviceId)
            )
          );
          alert("재생장치가 정상적으로 삭제되었습니다.");
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
        재생장치 관리
      </h1>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1);
        }}
        searchOptions={[
          { value: "deviceName", label: "재생장치명" },
          ...(userInfo.roles === "ROLE_ADMIN"
            ? [{ value: "account", label: "담당자" }]
            : []),
        ]}
        defaultCategory="deviceName"
      />

      <div className="flex justify-between my-4">
        <div className="inline-flex items-center">
          <ToggleSwitch />
        </div>
      </div>

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center p-8 bg-white rounded-sm h-160">
        <table className="w-full table-fixed">
          <thead className="border-t-2 border-[#FF9C00] bg-[#FFF9F2]">
            <tr>
              <th className="w-1/12 p-2 text-center text-gray-800 border-b border-gray-30">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedPosts(
                      isChecked
                        ? new Set(signages.map((post) => post.deviceId))
                        : new Set()
                    );
                  }}
                />
              </th>
              <th className="w-4/12 p-2 text-gray-800 text-center border-b border-gray-300">
                재생장치명
              </th>
              <th className="w-4/12 p-2 text-gray-800 text-center border-b border-gray-300">
                담당자(아이디)
              </th>
              <th className="w-3/12 p-2 text-gray-800 text-center border-b border-gray-300">
                등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {signages.map((signage) => (
              <tr key={signage.deviceId} className="hover:bg-gray-100">
                <td className="text-center p-2 border-b border-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(signage.deviceId)}
                    onChange={() => handleCheckboxChange(signage.deviceId)}
                  />
                </td>

                <td className="p-2 text-center border-b border-gray-300 text-[#444444] font-semibold hover:underline">
                  <Link to={SIGNAGE_DTL + `/${signage.deviceId}`}>
                    {signage.deviceName}
                  </Link>
                </td>

                <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                  {signage.accountList
                    .map((account) => `${account.name}(${account.accountId})`)
                    .join(", ")}
                </td>
                <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                  {format(signage.regDate, "yyyy-MM-dd")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userInfo.roles === "ROLE_ADMIN" ? (
        <div className="flex justify-end space-x-2 my-10">
          <Link to={SIGNAGE_FORM}>
            <button
              type="button"
              className="rounded-smd border border-[#FF9C00] bg-[#FF9C00] text-white px-3 py-2 text-sm font-semibold shadow-sm 
              hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-[#FF9C00] transition duration-200"
            >
              재생장치 등록
            </button>
          </Link>
          <button
            onClick={deleteSignage}
            type="button"
            className="rounded-smd border border-[#444444] bg-[#444444] text-white px-3 py-2 text-sm font-semibold shadow-sm 
            hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
          >
            삭제
          </button>
        </div>
      ) : null}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Stack spacing={2} className="mt-10">
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

export default SignageList;
