import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IMAGE_RESOURCE_BOARD,
  VIDEO_RESOURCE_BOARD,
  IMAGE_ENCODING,
} from "../../../constants/page_constant";

import OriginCard from "../../components/file/OriginCard";

import {
  ACTIVE_RSIMAGE_BOARD,
  FILE_ORIGINAL_BASIC,
  FILE_DEACTIVION,
} from "../../../constants/api_constant";
import ImageResourceModal from "./ImageResourceModal";
import fetcher from "../../../fetcher";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import TabButton from "../../components/TapButton";
import SearchBar from "../../components/SearchBar";

// ImageResourceBoard 컴포넌트를 정의합니다.
const ImageResourceBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [images, setImages] = useState([]);
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const location = useLocation();
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

  const openResourceModal = (image) => {
    setSelectedImage(image);
    setResourceModalIsOpen(true);
  };

  const closeResourceModal = () => {
    setSelectedImage(null); // 모달을 닫을 때 선택된 이미지를 초기화합니다.
    setResourceModalIsOpen(false);
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
      <div className="flex justify-end mb-4">
        <div className="w-auto flex space-x-2">
          <TabButton
            label="이미지"
            path={IMAGE_RESOURCE_BOARD}
            isActive={location.pathname === IMAGE_RESOURCE_BOARD}
            onClick={() => navigate(IMAGE_RESOURCE_BOARD)}
          />
          <TabButton
            label="영상"
            path={VIDEO_RESOURCE_BOARD}
            isActive={location.pathname === VIDEO_RESOURCE_BOARD}
            onClick={() => navigate(VIDEO_RESOURCE_BOARD)}
          />
        </div>
      </div>

      {/* 그리드 시작 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {images.length > 0 ? (
          images.map((file, index) => (
            <OriginCard
              key={file.originalResourceId}
              file={{ ...file, index }} // index를 props로 전달
              openResourceModal={openResourceModal} // 함수를 전달
              onEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              editingTitleIndex={editingTitleIndex}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              handleDeactivate={handleDeactivate}
              onclick={openResourceModal}
              showPlayIcon={false}
              encodingPath={IMAGE_ENCODING}
            />
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
