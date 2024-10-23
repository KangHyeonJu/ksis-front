import React, { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { format, parseISO } from "date-fns";
import { FaSearch, FaRegPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  TRASH_IMAGE_FILE,
  TRASH_VIDEO_FILE,
} from "../../../constants/page_constant";
import {
  DEACTIVE_VIDEO_BOARD,
  FILE_ACTIVE,
} from "../../../constants/api_constant";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const TrashVideoFileBoard = () => {
  // 페이지네이션 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [isOriginal, setIsOriginal] = useState(true); // 토글 상태 관리
  const [videos, setVideos] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물을 상태로 관리

  const postsPerPage = 16; // 페이지당 게시물 수
  const navigate = useNavigate();

  useEffect(() => {
    fetcher
      .get(DEACTIVE_VIDEO_BOARD, {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory, // 카테고리 검색에 필요한 필드
        },
      })
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setVideos(response.data.content);
        setFilteredPosts(response.data); // 받아온 데이터를 필터링된 게시물 상태로 설정
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, [currentPage, searchTerm]);

  const handleToggle = () => {
    const newIsOriginal = !isOriginal;
    setIsOriginal(newIsOriginal);
    navigate(newIsOriginal ? TRASH_VIDEO_FILE : TRASH_IMAGE_FILE);
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

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
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

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          비활성화 영상 페이지
        </h1>
      </header>

 {/* 검색바 입력창 */} 
 <div className="flex items-center relative flex-grow mb-4 border border-[#FF9C00]">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-gray-600 font-bold"
        >
          <option value="fileTitle">제목</option>
          <option value="regTime">등록일</option>
          <option value="resolution">해상도</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
           className="w-full p-2  pr-10"
          />
        </div>
        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>



{/* 탭버튼 */} 
<div className="flex justify-end mb-4">
  <div className="w-auto flex space-x-2">
    {/* 이미지 탭 */}
    <div className="border-b-2 border-gray-200  hover:border-b-2 hover:border-b-[#FF9C00] ">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold border  hover:border-gray-300 hover:bg-white hover:text-black ${
                window.location.pathname === TRASH_IMAGE_FILE
          ? "text-black bg-white border-gray-300 border-b-0"
          : "text-gray-500 bg-gray-100 border-transparent"
      }`}
      onClick={() => navigate(TRASH_IMAGE_FILE)}
    >
      이미지
    </button>
    </div>
    <div className="border-b-2 border-[#FF9C00]">
    {/* 영상 탭 */}
    <button
      className={`px-6 py-2 rounded-t-lg font-semibold border  ${
        window.location.pathname === TRASH_VIDEO_FILE
          ? "text-black bg-white border-gray-300 border-b-0"
          : "text-gray-500 bg-gray-100 border-transparent "
      }`}
      onClick={() => navigate(TRASH_VIDEO_FILE)}
    >
      영상
    </button>
    </div>
  </div>
</div>

      {/* 그리드 시작 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {videos.length > 0 ? (
          videos.map((post, index) => (
            <div key={index} className="grid p-1">
              {/* 카드 */}
              <div className="flex flex-col  h-full overflow-hidden max-w-xs">

                {/* 썸네일 */}
                <div className="w-full h-auto md:h-60 lg:h-70">
                <div className="relative w-full h-full mb-1 overflow-hidden">
                  <img
                    src={post.thumbFilePath}
                    alt={post.fileTitle}
                    className="w-60 h-60 object-cover object-center" 
                  />
                  {/* 아이콘 추가 */}
                  <FaRegPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-8xl opacity-85" />
                </div>
                </div>
                {/* 제목 */}
                <div className="flex justify-between w-full">
                  <h2
                    className="text-xl font-bold truncate max-w-full mx-auto justify-start"
                    title={post.fileTitle}
                  >
                    {post.fileTitle}
                  </h2>
                </div>
                {/* 등록일 */}
               <div className="mx-auto">
                <p className="text-gray-500">{formatDate(post.regTime)}</p>
                </div>
                {/* 활성화 버튼 */}
                <div>
                <div className="flex justify-center p-2">
                    <button
                      type="button"
                      className="mr-2 rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
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
      {totalPages > 1 && (
        <Stack spacing={2} className="mt-2">
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

export default TrashVideoFileBoard;
