import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "../../css/dialog";
import ReactPaginate from "react-paginate";
import fetcher from "../../../fetcher";
import { FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import { SIGNAGE_NOTICE } from "../../../constants/api_constant";

const NoticeModal = ({ isOpen, onRequestClose, signageId }) => {
  const [notices, setNotices] = useState([]);

  const loadPage = useCallback(async () => {
    try {
      const response = await fetcher.get(SIGNAGE_NOTICE + `/${signageId}`);
      console.log(response);
      if (response.data) {
        setNotices(response.data);
      } else {
        console.error("No data property in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [signageId]);

  useEffect(() => {
    if (signageId) {
      loadPage();
    }
  }, [signageId, loadPage]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title");
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 5;

  const filteredPosts = useMemo(
    () =>
      notices.filter((signage) => {
        const value = signage[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      }),
    [notices, searchTerm, searchCategory]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span> */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-7/12 sm:p-6 h-96">
          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
            공지조회
          </DialogTitle>
          <DialogBody className="mt-2">
            <div className="mb-4 flex items-center">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="mr-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="title">제목</option>
                <option value="account">작성자</option>
                <option value="regDate">작성일</option>
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
            <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4 text-center">
              <thead>
                <tr>
                  <td className="border border-gray-300">작성자(아이디)</td>
                  <td className="border border-gray-300">제목</td>
                  <td className="border border-gray-300">작성일</td>
                  <td className="border border-gray-300">노출일</td>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((notice) => (
                  <tr key={notice.noticeId}>
                    <td className="border border-gray-300 p-2">
                      {notice.account.name}({notice.account.accountId})
                    </td>

                    <td className="border border-gray-300 p-2">
                      {notice.title}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {format(notice.regDate, "yyyy-MM-dd")}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {format(notice.startDate, "yyyy-MM-dd")} ~{" "}
                      {format(notice.endDate, "yyyy-MM-dd")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogBody>
          <DialogActions className="mt-4">
            <button
              onClick={onRequestClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600/70 text-base font-medium text-white shadow-sm hover:bg-red-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              닫기
            </button>
          </DialogActions>
        </div>
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
    </Dialog>
  );
};

export default NoticeModal;
