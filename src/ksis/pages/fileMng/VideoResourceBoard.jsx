import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaRegPlayCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import {
  VIDEO_RESOURCE_BOARD,
  IMAGE_RESOURCE_BOARD,
  VIDEO_ENCODING,
} from "../../../constants/page_constant";
import {
  ACTIVE_RSVIDEO_BOARD,
  FILE_ORIGINAL_BASIC,
  FILE_DEACTIVION,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import VideoResourceModal from "./VideoResourceModal";
import fetcher from "../../../fetcher";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const VideoResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [isOriginal, setIsOriginal] = useState(true);
  const [videos, setVideos] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const postsPerPage = 16;
  const navigate = useNavigate();

  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // 선택한 영상의 정보를 관리하는 상태값 추가

  // 영상 목록을 가져오는 부분
  useEffect(() => {
    fetcher
      .get(ACTIVE_RSVIDEO_BOARD, {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory, // 카테고리 검색에 필요한 필드
        },
      })
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setVideos(response.data.content); // 영상 데이터를 설정
        setFilteredPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
      });
  }, [currentPage, searchTerm]);

  useEffect(() => {
    let filtered = videos;

    if (searchTerm) {
      if (searchCategory === "title") {
        filtered = videos.filter((video) =>
          video.fileTitle.includes(searchTerm)
        ); // title -> fileTitle로 수정
      } else if (searchCategory === "regDate") {
        filtered = videos.filter((video) =>
          formatDate(video.regTime).includes(searchTerm)
        ); // 등록일 포맷팅 적용
      } else {
        filtered = videos.filter(
          (video) =>
            video.fileTitle.includes(searchTerm) ||
            formatDate(video.regTime).includes(searchTerm) // 등록일 포맷팅 적용
        );
      }
    }

    setFilteredPosts(filtered);
  }, [videos, searchTerm, searchCategory]);

  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  // 엔터 키로 제목 저장
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      handleSaveClick(id);
    }
  };

  // 제목 수정
  const handleSaveClick = async (id) => {
    if (window.confirm("정말로 파일의 제목을 변경하시겠습니까?")) {
      try {
        await fetcher.put(`${FILE_ORIGINAL_BASIC}/${id}`, {
          fileTitle: newTitle, // newTitle을 JSON 형태로 보냄
        });

        // 제목이 변경된 후 videos 상태를 업데이트
        const updatedVideos = videos.map((video) =>
          video.originalResourceId === id
            ? { ...video, fileTitle: newTitle }
            : video
        );
        setVideos(updatedVideos);

        // 변경된 videos를 기반으로 filteredPosts 상태도 업데이트
        setFilteredPosts(updatedVideos);

        setEditingTitleIndex(null);
        setNewTitle("");
      } catch (error) {
        window.confirm("수정에 실패했습니다.");
        console.error("제목 수정 중 오류 발생:", error);
      }
    }
  };

  // 삭제 핸들러
  const handleDeactivate = async (id) => {
    if (window.confirm("정말로 이 영상을 비활성화하시겠습니까?")) {
      try {
        await fetcher.post(FILE_DEACTIVION + `/${id}`);

        const updatedVideos = videos.filter(
          (video) => video.originalResourceId !== id
        );
        setVideos(updatedVideos);
        setTotalPages(Math.ceil(updatedVideos.length / postsPerPage)); // 페이지 수 업데이트
        window.alert("영상을 비활성화하였습니다.");
      } catch (err) {
        console.error("영상 비활성화 오류:", err);
        window.alert("영상 비활성화에 실패했습니다.");
      }
    }
  };

  // 유효한 날짜 포맷으로 변환
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  // 모달 열기 함수 수정
  const openResourceModal = (video) => {
    setSelectedVideo(video); // 선택된 영상을 설정합니다.
    setResourceModalIsOpen(true); // 모달을 엽니다.
  };

  const closeResourceModal = () => {
    setResourceModalIsOpen(false);
    setSelectedVideo(null); // 모달을 닫을 때 선택된 영상을 초기화합니다.
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

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          영상 원본 페이지
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
            className="w-full p-2"
          />
        </div>
        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF9C00]" />
      </div>


        {/* 탭버튼 */} 
          <div className="flex justify-end mb-4">
          <div className="w-auto flex space-x-2 ">
            {/* 이미지 탭 */}
            <div className="border-b-2 border-gray-200 ">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold border ${
                window.location.pathname === IMAGE_RESOURCE_BOARD
                  ? "text-black bg-white border-gray-300 border-b-0"
                  : "text-gray-500 bg-gray-100 border-transparent"
              }`}
              onClick={() => navigate(IMAGE_RESOURCE_BOARD)}
            >
              이미지
            </button>
            </div>
            <div className="border-b-2 border-[#FF9C00]">
            {/* 영상 탭 */}
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold border  ${
                window.location.pathname === VIDEO_RESOURCE_BOARD
                  ? "text-black bg-white border-gray-300 border-b-0"
                  : "text-gray-500 bg-gray-100 border-transparent "
              }`}
              onClick={() => navigate(VIDEO_RESOURCE_BOARD)}
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

                {/* 영상 */}
                <div className="w-full h-auto md:h-60 lg:h-70">
                  <div className="relative w-full h-full mb-1 overflow-hidden ">
                    <img
                      src={post.thumbFilePath}
                      //영상 파일 깨질시 영상 제목으로 설정
                      alt={post.fileTitle}
                      className="w-full h-full cursor-pointer object-cover object-center hover:scale-150"
                     
                      //영상 클릭하면 모달 열림
                      onClick={() => openResourceModal(post.originalResourceId)}
                    />

                    {/* 아이콘 추가 */}
                    <FaRegPlayCircle
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-8xl cursor-pointer opacity-85"
                      onClick={() => openResourceModal(post.originalResourceId)}
                    />
                  </div>
                </div>
                {/* 제목 */}
                <div className="flex justify-between w-full">
                  {editingTitleIndex === index ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, post.originalResourceId)
                      } // 엔터 키 이벤트 추가
                      className="w-full text-xl font-midium border-b text-center
                      border-gray-400 outline-none transition-colors duration-200 
                      focus:border-gray-600 max-w-full mx-auto justify-start"
                      placeholder="제목을 입력해주세요."
                    />
                  ) : (
                    <h2 className="text-xl font-bold truncate max-w-full mx-auto justify-start text-gray-800" title={post.fileTitle}>
                    {post.fileTitle}
                    </h2>
                  )}
                  <div>
                    <FaEdit
                      onClick={() =>
                        editingTitleIndex === index
                          ? handleSaveClick(post.originalResourceId)
                          : handleEditClick(index, post.fileTitle)
                      }
                       className="justify-end text-xl cursor-pointer text-gray-600 transition-transform duration-200 
                    transform hover:scale-110 hover:text-gray-800 m-1 "
                    />
                  </div>
                </div>

                {/* 등록일 */}
                <div className="mx-auto">
                <p className="text-gray-500">{formatDate(post.regTime)}</p>
                </div>

                {/* 인코딩, 삭제 버튼 */}
                <div className="items-center text-center row mx-auto p-2">
                  <Link to={`${VIDEO_ENCODING}/${post.originalResourceId}`}>
                    <button
                       className="mr-2 rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
                  >
                      인코딩
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeactivate(post.originalResourceId)}
                    className="mr-2 rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
                >
                    비활성화
                  </button>
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


      {/* 모달 컴포넌트 호출 */}
      {selectedVideo && (
        <VideoResourceModal
          isOpen={resourceModalIsOpen}
          onRequestClose={closeResourceModal}
          originalResourceId={selectedVideo} // 선택한 영상의 정보를 전달합니다.
        />
      )}
    </div>
  );
};

export default VideoResourceBoard;
