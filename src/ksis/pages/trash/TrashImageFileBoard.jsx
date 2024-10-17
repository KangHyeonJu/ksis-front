    import React, { useState, useEffect } from "react";
    import { FaSearch, FaEdit } from "react-icons/fa";
    import { Link, useNavigate } from "react-router-dom";
    import ReactPaginate from "react-paginate";
    import {
      IMAGE_ENCODING,
      TRASH_IMAGE_FILE,
      TRASH_VIDEO_FILE
    } from "../../../constants/page_constant";
    import {
        DEACTIVE_IMAGE_BOARD,
      FILE_ORIGINAL_BASIC,
    } from "../../../constants/api_constant";
    import { format, parseISO } from "date-fns";
    import fetcher from "../../../fetcher";
    
    // ImageResourceBoard 컴포넌트를 정의합니다.
    const TrashImageFileBoard = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [searchCategory, setSearchCategory] = useState("total");
      const [isOriginal, setIsOriginal] = useState(false);
      const [currentPage, setCurrentPage] = useState(0);
      const postsPerPage = 16;
      const [images, setImages] = useState([]);
      const [filteredPosts, setFilteredPosts] = useState([]);
      const [editingTitleIndex, setEditingTitleIndex] = useState(null);
      const [newTitle, setNewTitle] = useState("");
      const navigate = useNavigate();
    
    
      useEffect(() => {
        fetcher
          .get(DEACTIVE_IMAGE_BOARD)
          .then((response) => {
            setImages(response.data);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
          });
      }, []);

     const handleToggle = () => {
        const newIsOriginal = !isOriginal;
        setIsOriginal(newIsOriginal);
        navigate(newIsOriginal ? TRASH_VIDEO_FILE : TRASH_IMAGE_FILE);
      };

      
    
      return (
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
              비활성화 이미지 페이지
            </h1>
          </header>
    
    
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
      );
    };
    
export default TrashImageFileBoard;
