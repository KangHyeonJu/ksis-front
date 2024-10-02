import React, { useEffect, useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
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

const SignageList = () => {
  const userInfo = decodeJwt();

  const [signages, setSignages] = useState([]);

  const loadPage = async () => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST, {
        params: { role: userInfo.roles },
      });
      console.log(response);
      if (response.data) {
        setSignages(response.data);
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
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);

  const postsPerPage = 5;

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

  useEffect(() => {
    console.log(checkedRowId);
  }, [checkedRowId]);

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

  const filteredPosts = useMemo(
    () =>
      signages.filter((signage) => {
        const value = signage[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      }),
    [signages, searchTerm, searchCategory]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        재생장치 관리
      </h1>

      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="deviceName">재생장치명</option>
          <option value="account">담당자</option>
          <option value="regDate">등록일</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <ToggleSwitch />
        </div>
        {userInfo.roles === "ROLE_ADMIN" ? (
          <div className="flex justify-end space-x-2 mb-4">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <Link to={SIGNAGE_FORM}>재생장치 등록</Link>
            </button>
            <button
              onClick={deleteSignage}
              type="button"
              className="relative inline-flex items-center rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              삭제
            </button>
          </div>
        ) : null}
      </div>
      <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedPosts(
                    isChecked
                      ? new Set(filteredPosts.map((post) => post.deviceId))
                      : new Set()
                  );
                }}
              />
            </th>
            <th className="border border-gray-300">재생장치명</th>
            <th className="border border-gray-300">담당자(아이디)</th>
            <th className="border border-gray-300">등록일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((signage) => (
            <tr key={signage.deviceId} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(signage.deviceId)}
                  onChange={() => handleCheckboxChange(signage.deviceId)}
                />
              </td>

              <td className="border border-gray-300 p-2 text-blue-600 font-semibold hover:underline">
                <Link to={SIGNAGE_DTL + `/${signage.deviceId}`}>
                  {signage.deviceName}
                </Link>
              </td>

              <td className="border border-gray-300 p-2">
                {signage.accountList
                  .map((account) => `${account.name}(${account.accountId})`)
                  .join(", ")}
              </td>
              <td className="border border-gray-300 p-2">
                {format(signage.regDate, "yyyy-MM-dd")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default SignageList;
