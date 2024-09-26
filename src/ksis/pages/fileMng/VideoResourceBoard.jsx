import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  VIDEO_RESOURCE_BOARD,
  VIDEO_FILE_BOARD,
  VIDEO_ENCODING,
} from "../../../constants/page_constant";
import {
  RSVIDEO_BOARD,
  FILE_ORIGINAL_BASIC,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import VideoResourceModal from "./VideoResourceModal";
import fetcher from "../../../fetcher";

const VideoResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;
  const [videos, setVideos] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // 선택한 영상의 정보를 관리하는 상태값 추가

  // isOriginal 값에 따라 페이지를 이동
  useEffect(() => {
    navigate(isOriginal ? VIDEO_RESOURCE_BOARD : VIDEO_FILE_BOARD);
  }, [isOriginal, navigate]);

  // 영상 목록을 가져오는 부분
  useEffect(() => {
    fetcher
      .get(RSVIDEO_BOARD)
      .then((response) => {
        setVideos(response.data); // 영상 데이터를 설정
        console.log("영상 데이터 : ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
      });
  }, []);

  // 검색어와 카테고리에 따라 영상 필터링
  useEffect(() => {
    let filtered = videos;

    if (searchTerm) {
      if (searchCategory === "title") {
        filtered = videos.filter((video) => video.title.includes(searchTerm));
      } else if (searchCategory === "regDate") {
        filtered = videos.filter((video) => video.regDate.includes(searchTerm));
      } else {
        filtered = videos.filter(
          (video) =>
            video.title.includes(searchTerm) ||
            video.regDate.includes(searchTerm)
        );
      }
    }

    setFilteredPosts(filtered);
  }, [videos, searchTerm, searchCategory]);

  // 토글 버튼 핸들러 함수 추가
  const handleToggle = () => {
    setIsOriginal((prevIsOriginal) => !prevIsOriginal);
  };

  // 페이지 변경 핸들러
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 제목 수정 핸들러
  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  //제목 수정
  const handleSaveClick = async (id) => {
    try {
      const response = await fetcher.put(FILE_ORIGINAL_BASIC + `/${id}`, null, {
        params: { newTitle },
      });
      videos.forEach((vdo) => {
        if (vdo.originalResourceId === id) {
          vdo.fileTitle = newTitle;
        }
      });

      const updatedVideos = videos.map((video) =>
        video.id === id ? { ...video, title: response.data.title } : video
      );
      setVideos(updatedVideos);
      setEditingTitleIndex(null);
      setNewTitle("");
    } catch (error) {
      window.confirm("수정에 실패했습니다.");
      console.error("제목 수정 중 오류 발생:", error);
    }
  };

  // 삭제 핸들러
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 영상을 삭제하시겠습니까?")) {
      try {
        await fetcher.delete(FILE_ORIGINAL_BASIC + `/${id}`);
        setVideos(videos.filter((video) => video.id !== id));
        window.alert("영상을 삭제하였습니다.");
      } catch (err) {
        console.error("영상 삭제 오류:", err);
        window.alert("영상 삭제에 실패했습니다.");
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

  // 현재 페이지에 표시할 포스트 계산
  const currentPosts = filteredPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          영상 원본 페이지
        </h1>
      </header>
      {/* 검색창 */}
      {/* 검색창 선택 */}
      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 rounded-md bg-[#f39704] text-white"
        >
          <option value="total">전체</option>
          <option value="title">제목</option>
          <option value="regDate">등록일</option>
        </select>
        {/* 검색어 작성 */}
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

      {/* 원본, 인코딩 페이지 선택 토글버튼 */}
      <div className="flex justify-start space-x-2 mb-4">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex items-center h-8 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
            isOriginal ? "bg-[#f39704]" : "bg-gray-200"
          }`}
          role="switch"
          aria-checked={isOriginal}
        >
          <span className="sr-only">{isOriginal ? "원본" : "인코딩"}</span>
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
            {isOriginal ? "원본" : "인코딩"}
          </span>
        </button>
      </div>

      {/* 파일등록 버튼 */}
      <div className="flex justify-end space-x-2 mb-4">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <Link to="ksis://open">파일 등록</Link>
        </button>
      </div>

      {/* 영상 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div key={index} className="grid p-1">
              {/* 네모틀 */}
              <div
                className="items-center text-center rounded-lg 
                            w-2/3 h-full p-3 bg-[#ffe69c]"
              >
                {/* 제목 */}
                <div className="flex items-center">
                  {editingTitleIndex === index ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-5/6 text-xl font-bold mb-2 border-b border-gray-400 mx-auto"
                    />
                  ) : (
                    <h2 className="w-5/6 text-xl font-bold mb-2 mx-auto max-w-[4/6] flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                      {post.fileTitle}
                    </h2>
                  )}

                  <FaEdit
                    onClick={() =>
                      editingTitleIndex === index
                        ? handleSaveClick(post.originalResourceId)
                        : handleEditClick(index, post.fileTitle)
                    }
                    className="ml-2 cursor-pointer text-gray-600"
                  />
                </div>

                {/* 등록일 */}
                <div>
                  <p className="text-gray-700 ">
                    등록일: {formatDate(post.regTime)}
                  </p>
                </div>

                {/* 영상 */}
                <div>
                <div className="w-5/6 h-5/6 overflow-hidden mt-4 mb-4 cursor-pointer mx-auto flex justify-center items-center" >
                <div style={{ width: "100PX", height: "100px", align: "center", background: "white",}}>
                
                    <video
                      src={post.filePath}
                      //영상 파일 깨질시 영상 제목으로 설정
                      alt={post.fileTitle}
                      className="w-full h-full"
                      //영상 클릭하면 모달 열림
                      onClick={() => openResourceModal(post.originalResourceId)}
                    />
                  </div>
                  </div>
                </div>

                {/* 인코딩, 삭제 버튼 */}

                <div className="items-center text-center row mx-auto p-2">
                  <button
                    className="mr-2 mt-2 rounded-md bg-[#6dd7e5]
                                        px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 
                                         focus-visible:outline-blue-600"
                  >
                    <Link to={`${VIDEO_ENCODING}/${post.originalResourceId}`}>
                      인코딩
                    </Link>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.originalResourceId)}
                    className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm
                                        hover:bg-red-400 focus-visible:outline-red-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-screen">
            <p className="text-center text-gray-600 w-4/5">파일이 없습니다.</p>
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
