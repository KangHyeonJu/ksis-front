import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  IMAGE_RESOURCE_BOARD,
  IMAGE_ENCODING,
  VIDEO_RESOURCE_BOARD,
} from "../../../constants/page_constant";
import {
  ACTIVE_RSIMAGE_BOARD,
  FILE_ORIGINAL_BASIC,
  FILE_DEACTIVION,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import ImageResourceModal from "./ImageResourceModal";
import fetcher from "../../../fetcher";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";

// ImageResourceBoard 컴포넌트를 정의합니다.
const ImageResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [isOriginal, setIsOriginal] = useState(false);

  const [images, setImages] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const navigate = useNavigate();
  const postsPerPage = 14;

  const [loading, setLoading] = useState(true);

  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지의 정보를 관리하는 상태값 추가

  useEffect(() => {
    fetcher
      .get(ACTIVE_RSIMAGE_BOARD, {
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

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, [currentPage, searchTerm]);

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

  //제목 수정
  const handleSaveClick = async (id) => {
    if (window.confirm("정말로 파일의 제목을 변경하시겠습니까?")) {
      try {
        await fetcher.put(`${FILE_ORIGINAL_BASIC}/${id}`, {
          fileTitle: newTitle,
        });

        const updatedImages = images.map((image) =>
          image.originalResourceId === id
            ? { ...image, fileTitle: newTitle }
            : image
        );
        setImages(updatedImages);
        setFilteredPosts(updatedImages);

        setEditingTitleIndex(null);
        setNewTitle("");
      } catch (error) {
        window.confirm("수정에 실패했습니다.");
        console.error("제목 수정 중 오류 발생:", error);
      }
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm("정말로 이 이미지를 비활성화하시겠습니까?")) {
      try {
        await fetcher.post(FILE_DEACTIVION + `/${id}`);
        const updatedImages = images.filter(
          (image) => image.originalResourceId !== id
        );
        setImages(updatedImages);
        setTotalPages(Math.ceil(updatedImages.length / postsPerPage)); // 페이지 수 업데이트

        window.alert("이미지를 비활성화하였습니다.");
      } catch (err) {
        console.error("이미지 비활성화 오류:", err);
        window.alert("이미지 비활성화에 실패했습니다.");
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

  // 모달 열기 함수 수정
  const openResourceModal = (image) => {
    setSelectedImage(image); // 선택된 이미지를 설정합니다.
    setResourceModalIsOpen(true); // 모달을 엽니다.
  };

  const closeResourceModal = () => {
    setResourceModalIsOpen(false);
    setSelectedImage(null); // 모달을 닫을 때 선택된 이미지를 초기화합니다.
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          이미지 원본 페이지
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
          <div className="border-b-2 border-[#FF9C00]">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold border ${
                window.location.pathname === IMAGE_RESOURCE_BOARD
                  ? "text-black bg-white border-border-[#FF9C00] border-b-0"
                  : "text-gray-500 bg-gray-300 border-transparent"
              }`}
              onClick={() => navigate(IMAGE_RESOURCE_BOARD)}
            >
              이미지
            </button>
          </div>
          <div className="border-b-2 border-gray-200  hover:border-b-2 hover:border-b-[#FF9C00] ">
            {/* 영상 탭 */}
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold border hover:border-gray-300 hover:bg-white hover:text-black ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {images.length > 0 ? (
          images.map((post, index) => (
            <div key={index} className="grid p-1">
              {/* 카드 */}
              <div className="flex flex-col  h-full overflow-hidden max-w-xs">
                {/* 이미지 */}
                <div className="w-full h-auto md:h-60 lg:h-70">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={post.thumbFilePath}
                      //이미지 파일 깨질시 이미지 제목으로 설정
                      alt={post.fileTitle}
                      className="w-full h-full cursor-pointer object-cover object-center hover:scale-150 hover:"
                      //이미지 클릭하면 모달 열림
                      onClick={() => openResourceModal(post.originalResourceId)}
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
                      onKeyDown={(e) =>
                        handleKeyDown(e, post.originalResourceId)
                      } // 엔터 키 이벤트 추가
                      className="w-full text-xl font-midium border-b text-center
                      border-gray-400 outline-none transition-colors duration-200 
                      focus:border-gray-600 max-w-full mx-auto justify-start"
                      placeholder="제목을 입력해주세요."
                    />
                  ) : (
                    <h2
                      className="text-xl font-bold truncate max-w-full mx-auto justify-start text-gray-800"
                      title={post.fileTitle}
                    >
                      {post.fileTitle}
                    </h2>
                  )}
                  {/* 제목수정 아이콘 */}
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
                  {/* 제목수정 아이콘 끝 */}
                </div>

                {/* 등록일 */}
                <div className="mx-auto">
                  <p className="text-gray-500">{formatDate(post.regTime)}</p>
                </div>

                {/* 인코딩, 삭제 버튼 */}
                <div className="items-center text-center row mx-auto p-2">
                  <Link to={`${IMAGE_ENCODING}/${post.originalResourceId}`}>
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

      <div>
        <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
        />
      </div>

      {/* 모달 컴포넌트 호출 */}
      {selectedImage && (
          <ImageResourceModal
              isOpen={resourceModalIsOpen}
              onRequestClose={closeResourceModal}
              originalResourceId={selectedImage} // 선택한 이미지의 정보를 전달합니다.
        />
      )}
    </div>
  );
};

export default ImageResourceBoard;
