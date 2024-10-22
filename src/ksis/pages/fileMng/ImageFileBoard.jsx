import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { FaSearch, FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  VIDEO_FILE_BOARD,
  IMAGE_FILE_BOARD,
} from "../../../constants/page_constant";
import { ECIMAGE_BOARD, FILE_ENCODED_BASIC } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";


const ImageFileBoard = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [isOriginal, setIsOriginal] = useState(false);
  const [images, setImages] = useState([]);
 
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  
  const navigate = useNavigate();
  const postsPerPage = 16;


  useEffect(() => {
    fetcher
      .get(ECIMAGE_BOARD, {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory, // 카테고리 검색에 필요한 필드
        },
      })
      .then((response) => {
        setTotalPages(response.data.totalPages);
        setImages(response.data.content);
        setFilteredPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
     
  }, [currentPage, searchTerm]);

  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  const handleSaveClick = async (id) => {
    if(window.confirm("정말로 파일의 제목을 변경하시겠습니까?")){
    try {
      await fetcher.put(`${FILE_ENCODED_BASIC}/${id}`, {
        fileTitle: newTitle,
      });

      const updatedImages = images.map((image) =>
        image.encodedResourceId === id ? { ...image, fileTitle: newTitle } : image
      );
      setImages(updatedImages);
      setFilteredPosts(updatedImages);

      setEditingTitleIndex(null);
      setNewTitle("");
    } catch (error) {
      window.confirm("수정에 실패했습니다.");
      console.error("제목 수정 중 오류 발생:", error);
    }}
  };

  const handleToggle = () => {
    const newIsOriginal = !isOriginal;
    setIsOriginal(newIsOriginal);
    navigate(newIsOriginal ? VIDEO_FILE_BOARD : IMAGE_FILE_BOARD);
  };

    // 엔터 키로 제목 저장
const handleKeyDown = (e, id) => {
  if (e.key === "Enter") {
    handleSaveClick(id);
  }
};

const handleDelete = async (id) => {
  if (window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) {
    try {
      await fetcher.delete(`${FILE_ENCODED_BASIC}/${id}`);
      const updatedImages = images.filter(
        (image) => image.encodedResourceId !== id
      );
      setImages(updatedImages);
      setTotalPages(Math.ceil(updatedImages.length / postsPerPage)); // 페이지 수 업데이트
      window.alert("이미지를 삭제하였습니다.");
    } catch (err) {
      console.error("이미지 삭제 오류:", err);
      window.alert("이미지 삭제에 실패했습니다.");
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
    setSelectedImage(src);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage("");
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
          이미지 인코딩 페이지
        </h1>
      </header>



      {/* 검색바 입력창 */}
      <div className="flex items-center relative flex-grow mb-4">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
            className="p-2 mr-2 rounded-md bg-[#f39704] text-white"
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
            {images.length > 0 ? (
              images.map((post, index) => (

            <div key={index} className="grid p-1">

              {/* 카드 */}
            <div className="rounded-lg bg-[#ffe69c] px-3 py-5 flex flex-col items-center 
              h-full overflow-hidden max-w-xs"> {/* max-w-xs로 카드 너비 제한 */}

                {/* 이미지 */}
                <div>
                <div className="w-full h-full mb-1 overflow-hidden">
                    <img
                      src={post.thumbFilePath}
                      alt={post.fileTitle}
                      className="w-60 h-60 cursor-pointer object-cover object-center"
                      onClick={() => openResourceModal(post.filePath)}
                    />
                  </div>
                </div>
                
                 {/* 제목 및 아이콘 래퍼 */}
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
        <Stack spacing={2}
      className="mt-2" >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color={"primary"}
        />
      </Stack>

      {/* 모달창 */}
      {isOpen && (
      
        <div onClick={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          
          
          <div className="relative mx-auto rounded-lg max-w-3xl w-full h-auto max-h-[80vh]"
          onClick={(event) => {event.stopPropagation();}}
          >
          
            <img
              src={selectedImage}
              alt="파일이 없습니다."
              className="w-full max-h-screen bg-white text-center text-gray-500"
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

export default ImageFileBoard;
