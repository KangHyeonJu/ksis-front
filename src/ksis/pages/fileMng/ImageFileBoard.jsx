import React, { useState, useEffect } from "react";
import { FaSearch} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useNavigate, useLocation  } from "react-router-dom"; // Import useNavigate
import {
  VIDEO_FILE_BOARD,
  IMAGE_FILE_BOARD,
} from "../../../constants/page_constant";
import {
  ECIMAGE_BOARD,
  FILE_ENCODED_BASIC,
} from "../../../constants/api_constant";
import fetcher from "../../../fetcher";

import EncodedCard from "../../components/file/EncodedCard";
import TabButtons from "../../components/file/FileTab"; // TabButtons 컴포넌트 임포트

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

const ImageFileBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const postsPerPage = 14;

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

  const handleSaveClick = async (id) => {
    if (window.confirm("정말로 파일의 제목을 변경하시겠습니까?")) {
      try {
        await fetcher.put(`${FILE_ENCODED_BASIC}/${id}`, {
          fileTitle: newTitle,
        });

        const updatedImages = images.map((image) =>
          image.encodedResourceId === id
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

  const openResourceModal = (image) => {
    setSelectedImage(image);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          이미지 인코딩 페이지
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
      {images.length > 0 ? (
        images.map((file, index) => (
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
            showPlayIcon={false}
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
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div
            className="relative mx-auto rounded-lg max-w-3xl w-full h-auto max-h-[80vh]"
            onClick={(event) => {
              event.stopPropagation();
            }}
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
