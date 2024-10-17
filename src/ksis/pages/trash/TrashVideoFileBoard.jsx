 import React, { useState, useEffect } from "react";
  import fetcher from "../../../fetcher";
  import { format, parseISO } from "date-fns";
  import { FaSearch } from "react-icons/fa";
  import { ImCross } from "react-icons/im";
  import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
  import ReactPaginate from "react-paginate"; // 페이지네이션 컴포넌트 가져오기
  import {
    TRASH_IMAGE_FILE,
    TRASH_VIDEO_FILE
  } from "../../../constants/page_constant";
  import {
    DEACTIVE_VIDEO_BOARD,
    FILE_ACTIVE,
  } from "../../../constants/api_constant";
  
  const TrashVideoFileBoard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("total");
    const [isOriginal, setIsOriginal] = useState(true); // 토글 상태 관리
    const [videos, setVideos] = useState([]);
    // 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(0);
  
    const postsPerPage = 16; // 페이지당 게시물 수
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물을 상태로 관리
    const navigate = useNavigate(); // Initialize useNavigate
  
    useEffect(() => {
      fetcher
        .get(DEACTIVE_VIDEO_BOARD)
        .then((response) => {
          setVideos(response.data);
          setFilteredPosts(response.data); // 받아온 데이터를 필터링된 게시물 상태로 설정
        })
        .catch((error) => {
          console.error("Error fetching videos:", error);
        });
    }, []);
  
    const handleToggle = () => {
      const newIsOriginal = !isOriginal;
      setIsOriginal(newIsOriginal);
      navigate(newIsOriginal ? TRASH_VIDEO_FILE : TRASH_IMAGE_FILE);
    };

    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
    };
  
    const handleActivation = async (id) => {
      if (window.confirm("정말로 이 영상을 활성화하시겠습니까?")) {
        try {
          await fetcher.post(`${FILE_ACTIVE}/${id}`);
          setVideos(videos.filter((image) => image.originalResourceId !== id));
          window.alert("영상을 활성화하였습니다.");
        } catch (err) {
          console.error("영상 활성화 오류:", err);
          window.alert("영상 활성화에 실패했습니다.");
        }
      }
    };
  
    const formatDate = (dateString) => {
      try {
        const date = parseISO(dateString);
        return format(date, "yyyy-MM-dd");
      } catch (error) {
        console.error("Invalid date format:", dateString);
        return "Invalid date";
      }
    };
  
    const currentPosts = filteredPosts.slice(
      currentPage * postsPerPage,
      (currentPage + 1) * postsPerPage
    );
  
    return (
      <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          비활성화 영상 페이지
        </h1>
      </header>

{/* 검색바 입력창 */}
<div className="flex items-center relative flex-grow mb-4">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
           className="p-2 mr-2 rounded-md bg-[#f39704] text-white"
        >
          <option value="total">전체</option>
          <option value="title">제목</option>
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

      <div className="flex items-center justify-between mb-4">
      
        {/* 파일등록 버튼 */}
      <div className="flex justify-start space-x-2 ">
      <Link to="ksis://open">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm 
          font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-offset-2 focus-visible:outline-orange-600">
         파일 등록
        </button>
        </Link>
      </div>

      {/* 토글 버튼 */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex items-center h-8 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
            isOriginal ? "bg-[#f39704]" : "bg-gray-200"
          }`}
          role="switch"
          aria-checked={isOriginal}
        >
          <span className="sr-only">{isOriginal ? "이미지" : "영상"}</span>
          <span
            className={`inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
              isOriginal ? "translate-x-10" : "translate-x-0"
            }`}
            aria-hidden="true"
          />
          <span
            className={`absolute left-2 right-2 text-sm font-medium text-black transition-transform duration-200 ease-in-out ${
              isOriginal ? "text-left" : "text-right"
            }`}
          >
            {isOriginal ? "이미지" : "영상"}
          </span>
        </button>
      </div>
      </div>

       {/* 그리드 시작 */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div key={index} className="grid p-1">
              
            {/* 카드 */}
            <div className="rounded-lg bg-[#ffe69c] px-3 py-5 flex flex-col items-center 
              h-full overflow-hidden max-w-xs"> {/* max-w-xs로 카드 너비 제한 */}
                 
                   {/* 영상 */}
                   <div>
                   <div className="w-full h-full mb-1 overflow-hidden">
                    <img
                      src={post.thumbFilePath}
                      alt={post.fileTitle}
                     className="w-60 h-60 cursor-pointer object-cover object-center"
                    />
                    </div>
                    </div>

                {/* 제목 */}
                <div className="flex justify-between w-full">
                    
                <h2 className="text-xl font-bold truncate max-w-full mx-auto justify-start" title={post.fileTitle}>
                {post.fileTitle}
                </h2>
                      
                      
                     
                   
                </div>

                 {/* 등록일 */}
                 <div className="">
                <p className="text-gray-700 mb-2">{formatDate(post.regTime)}</p>
                </div>
             

                {/* 활성화 버튼 */}
                <div>
                <div className="items-center text-center row mx-auto p-2">
                  <button
                  type="button"
                  className="mr-2 rounded-md bg-[#6dd7e5]
                                      px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 
                                       focus-visible:outline-blue-600"
                  onClick={() => handleActivation(post.originalResourceId)}
                >
                  활성화
                </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            게시된 파일이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
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
  
export default TrashVideoFileBoard;