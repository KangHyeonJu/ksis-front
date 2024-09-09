import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  IMAGE_RESOURCE_BOARD,
  IMAGE_FILE_BOARD,
  IMAGE_ENCODING,
} from "../../../constants/page_constant";
import {
  RSIMAGE_BOARD,
  FILE_ORIGINAL_BASIC,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import ImageResourceModal from "./ImageResourceModal";

// ImageResourceBoard 컴포넌트를 정의합니다.
const ImageResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("total");
  const [isOriginal, setIsOriginal] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;
  const [images, setImages] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지의 정보를 관리하는 상태값 추가

  useEffect(() => {
    navigate(isOriginal ? IMAGE_RESOURCE_BOARD : IMAGE_FILE_BOARD);
  }, [isOriginal, navigate]);

  useEffect(() => {
    axios
      .get(RSIMAGE_BOARD)
      .then((response) => {
        setImages(response.data);
        console.log("원본 이미지 데이터 : ", response.data); //이미지 데이터 확인
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  //받아온 이미지 데이터 필터링하고 그걸로 검색
  useEffect(() => {
    let filtered = images;
    if (searchTerm) {
      if (searchCategory === "title") {
        filtered = images.filter((image) => image.title.includes(searchTerm));
      } else if (searchCategory === "regDate") {
        filtered = images.filter((image) => image.regDate.includes(searchTerm));
      } else {
        filtered = images.filter(
          (image) =>
            image.title.includes(searchTerm) ||
            image.regDate.includes(searchTerm)
        );
      }
    }
    setFilteredPosts(filtered);
  }, [images, searchTerm, searchCategory]);

  const handleToggle = () => {
    setIsOriginal((prevIsOriginal) => !prevIsOriginal);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleEditClick = (index, title) => {
    setEditingTitleIndex(index);
    setNewTitle(title);
  };

  //제목 수정
  const handleSaveClick = async (id) => {
    try {
      const response = await axios.put(FILE_ORIGINAL_BASIC + `/${id}`, null, {
        params: { newTitle },
      });
      images.forEach((img) => {
        if (img.originalResourceId === id) {
          img.fileTitle = newTitle;
        }
      });

      const updatedImages = images.map((image) =>
        image.id === id ? { ...image, title: response.data.title } : image
      );
      setImages(updatedImages);
      setEditingTitleIndex(null);
      setNewTitle("");
    } catch (error) {
      window.confirm("수정에 실패했습니다.");
      console.error("제목 수정 중 오류 발생:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 이미지를 삭제하시겠습니까?")) {
      try {
        await axios.delete(FILE_ORIGINAL_BASIC + `/${id}`);
        setImages(images.filter((image) => image.id !== id));
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

  // 모달 열기 함수 수정
  const openResourceModal = (image) => {
    setSelectedImage(image); // 선택된 이미지를 설정합니다.
    setResourceModalIsOpen(true); // 모달을 엽니다.
  };

  const closeResourceModal = () => {
    setResourceModalIsOpen(false);
    setSelectedImage(null); // 모달을 닫을 때 선택된 이미지를 초기화합니다.
  };

  const currentPosts = filteredPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          이미지 원본 페이지
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

                {/* 이미지 */}
                <div>
                  <div className="w-5/6 h-5/6 overflow-hidden  mt-4 cursor-pointer mx-auto">
                    <img
                      src={post.filePath}
                      //이미지 파일 깨질시 이미지 제목으로 설정
                      alt={post.fileTitle}
                      className="w-full h-full"
                      //이미지 클릭하면 모달 열림
                      onClick={() => openResourceModal(post.originalResourceId)}
                    />
                  </div>
                </div>

                {/* 인코딩, 삭제 버튼 */}

                <div className="items-center text-center row mx-auto p-2">
                  <button
                    className="mr-2 mt-2 rounded-md bg-[#6dd7e5]
                                        px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 
                                         focus-visible:outline-blue-600"
                  >
                    <Link to={`${IMAGE_ENCODING}/${post.originalResourceId}`}>
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
