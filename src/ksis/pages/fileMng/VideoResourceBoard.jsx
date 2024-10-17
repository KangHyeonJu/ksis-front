import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
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

const VideoResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 16;
  const [videos, setVideos] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // 선택한 영상의 정보를 관리하는 상태값 추가



  // 영상 목록을 가져오는 부분
  useEffect(() => {
    fetcher
      .get(ACTIVE_RSVIDEO_BOARD)
      .then((response) => {
        setVideos(response.data); // 영상 데이터를 설정
      })
      .catch((error) => {
        console.error("Error fetching video:", error);
      });
  }, []);

  useEffect(() => {
    let filtered = videos;

    if (searchTerm) {
      if (searchCategory === "title") {
        filtered = videos.filter((video) => video.fileTitle.includes(searchTerm)); // title -> fileTitle로 수정
      } else if (searchCategory === "regDate") {
        filtered = videos.filter((video) => formatDate(video.regTime).includes(searchTerm)); // 등록일 포맷팅 적용
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

  // 토글 버튼 핸들러 함수
const handleToggle = () => {
  setIsOriginal((prevIsOriginal) => !prevIsOriginal);
  navigate(isOriginal ? IMAGE_RESOURCE_BOARD : VIDEO_RESOURCE_BOARD); // 페이지 이동
};

  // 페이지 변경 핸들러
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
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
    if(window.confirm("정말로 파일의 제목을 변경하시겠습니까?")){
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
    }}
  };


  // 삭제 핸들러
  const handleDeactivate= async (id) => {
    if (window.confirm("정말로 이 영상을 비활성화하시겠습니까?")) {
      try {
        await fetcher.post(FILE_DEACTIVION + `/${id}`);
        setVideos(videos.filter((video) => video.id !== id));
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


      {/* 원본, 인코딩 페이지 선택 토글버튼 */}
      <div className="flex justify-start space-x-2">
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
                      //영상 파일 깨질시 영상 제목으로 설정
                      alt={post.fileTitle}
                       className="w-60 h-60 cursor-pointer object-cover object-center"
                      //영상 클릭하면 모달 열림
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
                        onKeyDown={(e) => handleKeyDown(e, post.originalResourceId)} // 엔터 키 이벤트 추가
                        className="w-full text-xl font-midium border-b text-center
                        border-gray-400 outline-none transition-colors duration-200 
                        focus:border-gray-600 max-w-full mx-auto justify-start"
                    placeholder="제목을 입력해주세요." />
                    
                    ) : (
                      <h2 className="text-xl font-bold truncate max-w-full mx-auto justify-start" title={post.fileTitle}>
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
               <div className="">
                <p className="text-gray-700 mb-2">{formatDate(post.regTime)}</p>
                </div>

                

                {/* 인코딩, 삭제 버튼 */}
                <div className="items-center text-center row mx-auto p-2">
                <Link to={`${VIDEO_ENCODING}/${post.originalResourceId}`}>
                <button
                    className="mr-2 rounded-md bg-[#6dd7e5]
                                        px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 
                                         focus-visible:outline-blue-600">
                인코딩
                </button>
                </Link>
                  
                <button
                  type="button"
                  onClick={() => handleDeactivate(post.originalResourceId)}
                  className="mr-2 rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline-red-600"
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
