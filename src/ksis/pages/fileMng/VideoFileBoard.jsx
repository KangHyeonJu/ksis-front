import React, { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { FaSearch } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import {
  IMAGE_FILE_BOARD,
  VIDEO_FILE_BOARD,
} from "../../../constants/page_constant";
import {
  ECVIDEO_BOARD,
  FILE_ENCODED_BASIC,
} from "../../../constants/api_constant";

import EncodedCard from "../../components/file/EncodedCard";
import TabButtons from "../../components/file/FileTab"; // TabButtons 컴포넌트 임포트

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

const VideoFileBoard = () => {
  // 페이지네이션 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [isOriginal, setIsOriginal] = useState(true); // 토글 상태 관리
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물을 상태로 관리
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const postsPerPage = 14; // 페이지당 게시물 수

  useEffect(() => {
    fetcher
      .get(ECVIDEO_BOARD, {
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

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, [currentPage, searchTerm]);

  const handleToggle = () => {
    const newIsOriginal = !isOriginal;
    setIsOriginal(newIsOriginal);
    navigate(newIsOriginal ? VIDEO_FILE_BOARD : IMAGE_FILE_BOARD);
  };

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
        await fetcher.put(`${FILE_ENCODED_BASIC}/${id}`, {
          fileTitle: newTitle, // newTitle을 JSON 형태로 보냄
        });

        // 제목이 변경된 후 videos 상태를 업데이트
        const updatedVideos = videos.map((video) =>
          video.encodedResourceId === id
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

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 영상을 삭제하시겠습니까?")) {
      try {
        await fetcher.delete(FILE_ENCODED_BASIC + `/${id}`);
        const updatedVideos = videos.filter(
          (video) => video.encodedResourceId !== id
        );

        setVideos(updatedVideos);
        setTotalPages(Math.ceil(updatedVideos.length / postsPerPage)); // 페이지 수 업데이트
        window.alert("영상을 삭제하였습니다.");
      } catch (err) {
        console.error("영상 삭제 오류:", err);
        window.alert("영상 삭제에 실패했습니다.");
      }
    }
  };
  const openResourceModal = (src) => {
    setSelectedVideo(src);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedVideo("");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          영상 인코딩 페이지
        </h1>
      </header>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1); // 검색 시 첫 페이지로 이동
        }}
        searchOptions={[
          { value: "fileTitle", label: "제목" },
          { value: "regTime", label: "등록일" },
          { value: "resolution", label: "해상도" },
        ]}
        defaultCategory="fileTitle"
      />

      {/* 탭버튼 */}
          <TabButtons 
              currentPath={location.pathname} 
              imageBoardPath={IMAGE_FILE_BOARD} // 상수에서 경로 가져오기
              videoBoardPath={VIDEO_FILE_BOARD} // 상수에서 경로 가져오기
            />

            {/* 그리드 시작 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {videos.length > 0 ? (
              videos.map((file, index) => (
                  <EncodedCard
                  key={file.encodedResourceId}
                  file={{ ...file, index }} // index를 props로 전달
                  openResourceModal={openResourceModal} // 함수를 전달
                  onEditClick={handleEditClick}
                  handleSaveClick={handleSaveClick}
                  editingTitleIndex={editingTitleIndex}
                  newTitle={newTitle}
                  setNewTitle={setNewTitle}
                  handleDelete={handleDelete}
                  onclick = {openResourceModal}
                  showPlayIcon={true}
                />
              ))):(
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

      {/* 모달창 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative mx-auto rounded-lg max-w-3xl w-full h-auto max-h-[80vh]"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <video
              src={selectedVideo}
              alt="파일이 없습니다."
              className="w-full max-h-screen bg-white text-center text-gray-500"
              controls // 비디오 컨트롤러 추가
            />
            {/* 닫기 버튼 */}

            <ImCross
              className="absolute -top-2 -right-2 text-white cursor-pointer bg-red-500 rounded-full 
           size-6 hover:scale-110"
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFileBoard;
