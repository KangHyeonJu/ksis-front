import React, { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { format, parseISO } from "date-fns";
import { FaSearch, FaEdit, FaRegPlayCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import ReactPaginate from "react-paginate"; // 페이지네이션 컴포넌트 가져오기
import {
  IMAGE_FILE_BOARD,
  VIDEO_FILE_BOARD,
} from "../../../constants/page_constant";
import {
  ECVIDEO_BOARD,
  FILE_ENCODED_BASIC,
} from "../../../constants/api_constant";

const VideoFileBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(true); // 토글 상태 관리
  const [videos, setVideos] = useState([]);
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 16; // 페이지당 게시물 수
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물을 상태로 관리
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetcher
      .get(ECVIDEO_BOARD)
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
    if(window.confirm("정말로 파일의 제목을 변경하시겠습니까?")){
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
    }}
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 영상을 삭제하시겠습니까?")) {
      try {
        await fetcher.delete(FILE_ENCODED_BASIC + `/${id}`);
        setVideos(videos.filter((video) => video.id !== id));
        window.alert("영상을 삭제하였습니다.");
      } catch (err) {
        console.error("영상 삭제 오류:", err);
        window.alert("영상 삭제에 실패했습니다.");
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

  const openResourceModal = (src) => {
    setSelectedVideo(src);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedVideo("");
  };

  const currentPosts = filteredPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          영상 인코딩 페이지
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
                   <div className="relative w-full h-full mb-1 overflow-hidden">
                    <img
                      src={post.thumbFilePath}
                      alt={post.fileTitle}
                     className="w-60 h-60 cursor-pointer object-cover object-center"
                      onClick={() => openResourceModal(post.filePath)}
                    />
                    {/* 아이콘 추가 */}
                    <FaRegPlayCircle  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-8xl cursor-pointer opacity-85" 
                 onClick={() => openResourceModal(post.filePath)} />
                    </div>
                    </div>

                {/* 제목 */}
                <div className="flex justify-between w-full">
                    {editingTitleIndex === index ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, post.encodedResourceId)} // 엔터 키 이벤트 추가
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
                            ? handleSaveClick(post.encodedResourceId)
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
             

                {/* 삭제 버튼 */}
                <div>
                <div className="items-center text-center row mx-auto p-2">
                  <button
                  type="button"
                  className="mr-2 rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline-red-600"
                  onClick={() => handleDelete(post.encodedResourceId)}
                >
                  삭제
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

      {/* 모달창 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        onClick={closeModal}
        >
          <div className="relative mx-auto rounded-lg max-w-3xl w-full h-auto max-h-[80vh]"
          onClick={(event) => {event.stopPropagation();}}
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
