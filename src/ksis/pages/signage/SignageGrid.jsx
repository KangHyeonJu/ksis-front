import React, { useEffect, useState, useMemo } from "react";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import fetcher from "../../../fetcher";
import { SIGNAGE_LIST } from "../../../constants/api_constant";
import { Link } from "react-router-dom";
import {
  SIGNAGE_DTL,
  SIGNAGE_FORM,
  SIGNAGE_INVENTORY,
} from "../../../constants/page_constant";

const SignageGrid = () => {
  const authority = localStorage.getItem("authority");
  const [signages, setSignages] = useState([]);

  const loadPage = async () => {
    try {
      const response = await fetcher.get(SIGNAGE_LIST + `/grid`);
      console.log(response);
      if (response.data) {
        setSignages(response.data);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("deviceName");
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 4;

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
      <div className="flex justify-end space-x-2 mb-4">
        <button>
          <Link to={SIGNAGE_INVENTORY}>테이블로 보기</Link>
        </button>
      </div>
      {authority === "ROLE_ADMIN" ? (
        <div className="flex justify-end space-x-2 mb-4">
          <button
            type="button"
            className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            <Link to={SIGNAGE_FORM}>재생장치 등록</Link>
          </button>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
        {paginatedPosts.map((signage) => (
          <div
            key={signage.deviceId}
            className="group relative border-2 border-[#fcc310] rounded-md p-3"
          >
            <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
              <img
                alt={signage.deviceName}
                src={signage.thumbNail}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-2 text-gray-700 text-center w-full border-2 border-[#fcc310] rounded-md p-1">
              재생장치 : {signage.deviceName}
            </div>
            <button
              type="button"
              className="mt-2 bg-[#fad96e] w-full rounded-md p-1"
            >
              <Link to={SIGNAGE_DTL + `/${signage.deviceId}`}>상세보기</Link>
            </button>
          </div>
        ))}
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

export default SignageGrid;
