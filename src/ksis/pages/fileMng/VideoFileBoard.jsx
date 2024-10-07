import React, { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { format, parseISO } from "date-fns";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import ReactPaginate from "react-paginate"; // 페이지네이션 컴포넌트 가져오기
import {
  VIDEO_RESOURCE_BOARD,
  VIDEO_FILE_BOARD,
} from "../../../constants/page_constant";
import {
  ECVIDEO_BOARD,
  FILE_ENCODED_BASIC,
} from "../../../constants/api_constant";

const VideoFileBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(false); // 토글 상태 관리
  const [videos, setVideos] = useState([]);
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 10; // 페이지당 게시물 수
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
        console.log("인코딩 영상 데이터 : ", response.data); //영상 데이터 확인
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  const handleToggle = () => {
    const newIsOriginal = !isOriginal;
    setIsOriginal(newIsOriginal);
    if (newIsOriginal) {
      navigate(VIDEO_RESOURCE_BOARD); // 원본 페이지로 이동
    } else {
      navigate(VIDEO_FILE_BOARD); // 인코딩 페이지로 이동 (replace with the actual path)
    }
  };

  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  const handleSaveClick = async (id) => {
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

      <div className="flex items-center justify-between mb-4">
      
        {/* 파일등록 버튼 */}
      <div className="flex justify-start space-x-2 mb-4 ">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm 
          font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <Link to="ksis://open">파일 등록</Link>
        </button>
      </div>


      {/* 검색바 입력창 */}
      <div className="flex items-center space-x-2 relative flex-grow mx-4">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 rounded-md bg-[#f39704] text-white"
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

      {/* 토글 버튼 */}
      <div className="flex justify-end space-x-2 mb-4 ">
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
      </div>

      {/* 그리드 시작 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div key={index} className="grid p-1">
              {/* 카드 */}
              <div  className="rounded-lg bg-[#ffe69c] p-3 flex flex-col items-center h-full overflow-hidden">
                   {/* 영상 */}
                   <div className="w-full h-full mb-3 overflow-hidden">
                    <img
                      src={post.thumbFilePath}
                      alt={post.fileTitle}
                      className="w-60 h-60 cursor-pointer object-cover object-center"
                      onClick={() => openResourceModal(post.filePath)}
                    />
                    </div>

                {/* 제목 */}
                <div className="flex justify-between w-full">
                    {editingTitleIndex === index ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-xl font-midium mb-2 border-b 
                    border-gray-400 outline-none transition-colors duration-200 focus:border-gray-600"
                    placeholder="제목을 입력해주세요." />
                    
                    ) : (
                      <h2 className="text-m font-bold truncate max-w-full" title={post.fileTitle}>
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
                        className="ml-2 text-l cursor-pointer text-gray-600 transition-transform duration-200 transform hover:scale-110 hover:text-gray-800"
                    />
                    </div>
                   </div>

                {/* 등록일 */}
                <div className="">
                    <p className="text-gray-700 mb-2">{formatDate(post.regTime)}</p>
                </div>

             

                {/* 삭제 버튼 */}
                <div>
                  <div className="items-center text-center row mx-auto">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.encodedResourceId)}
                      className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm
                                    hover:bg-red-400 focus-visible:outline-red-600"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-1/3 h 1/3">
            <video
              src={selectedVideo}
              alt="Selected"
              className="w-full max-h-screen"
              controls // 비디오 컨트롤러 추가
            />
            <button
              className="absolute text-center top-0 right-0 m-4 text-gray-600 text-xl rounded-full hover:bg-red-200 
                focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 w-7 h-7 
                font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFileBoard;
