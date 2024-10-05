import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import ReactPaginate from "react-paginate"; // 페이지네이션 컴포넌트 가져오기
import {
  IMAGE_RESOURCE_BOARD,
  IMAGE_FILE_BOARD,
} from "../../../constants/page_constant";
import {
  ECIMAGE_BOARD,
  FILE_ENCODED_BASIC,
} from "../../../constants/api_constant";
import fetcher from "../../../fetcher";

const ImageFileBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(false); // 토글 상태 관리
  const [images, setImages] = useState([]);
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10; // 페이지당 게시물 수
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물을 상태로 관리
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetcher
      .get(ECIMAGE_BOARD)
      .then((response) => {
        setImages(response.data);
        setFilteredPosts(response.data); // 받아온 데이터를 필터링된 게시물 상태로 설정
        console.log("인코딩 이미지 데이터 : ", response.data); //이미지 데이터 확인
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  const handleSaveClick = async (id) => {
    try {
      await fetcher.put(`${FILE_ENCODED_BASIC}/${id}`, {
        fileTitle: newTitle, 
      });

      // 제목이 변경된 후 images 상태를 업데이트
      const updatedImages = images.map((image) =>
        image.encodedResourceId === id
          ? { ...image, fileTitle: newTitle }
          : image
      );
      setImages(updatedImages);

      // 변경된 images를 기반으로 filteredPosts 상태도 업데이트
      setFilteredPosts(updatedImages);

      setEditingTitleIndex(null);
      setNewTitle("");
    } catch (error) {
      window.confirm("수정에 실패했습니다.");
      console.error("제목 수정 중 오류 발생:", error);
    }
  };

  const handleToggle = () => {
    const newIsOriginal = !isOriginal;
    setIsOriginal(newIsOriginal);
    if (newIsOriginal) {
      navigate(IMAGE_RESOURCE_BOARD); // 원본 페이지로 이동
    } else {
      navigate(IMAGE_FILE_BOARD); // 인코딩 페이지로 이동 (replace with the actual path)
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) {
      try {
        await fetcher.delete(FILE_ENCODED_BASIC + `/${id}`);
        setImages(images.filter((image) => image.id !== id));
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

  const currentPosts = filteredPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          이미지 인코딩 페이지
        </h1>
      </header>

      {/* 검색바 입력창 */}
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

      <div className="flex justify-end space-x-2 mb-4">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <Link to="ksis://open">파일 등록</Link>
        </button>
      </div>

      {/* 그리드 시작 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <div key={index} className="grid p-1">
              {/* 네모틀 */}
              <div className="items-center text-center rounded-lg w-2/3 h-full p-3 bg-[#ffe69c]">
                {/* 제목 */}
                <div>
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
                          ? handleSaveClick(post.encodedResourceId)
                          : handleEditClick(index, post.fileTitle)
                      }
                      className="ml-2 cursor-pointer text-gray-600"
                    />
                  </div>
                </div>

                {/* 등록일 */}
                <div>
                  <p className="text-gray-700 ">
                    등록일: {formatDate(post.regTime)}
                  </p>
                </div>

                {/* 이미지 */}
                <div>
                <div className="w-5/6 h-5/6 overflow-hidden mt-4 mb-4 cursor-pointer mx-auto flex justify-center items-center" >
                <div style={{ width: "100PX", height: "100px", align: "center", background: "white",}}>
                
                  <img
                      src={post.thumbFilePath}
                      alt={post.fileTitle}
                      className="w-full h-full object-cover"
                      onClick={() => openResourceModal(post.filePath)}
                    />
                  </div>
                  </div>
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

      {/* 모달창 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-1/3 h 1/3">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full max-h-screen"
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

export default ImageFileBoard;