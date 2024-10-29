import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TRASH_IMAGE_FILE,
  TRASH_VIDEO_FILE,
} from "../../../constants/page_constant";
import {
  DEACTIVE_IMAGE_BOARD,
  FILE_ACTIVE,
} from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import fetcher from "../../../fetcher";

import TrashCard from "../../components/file/TrashCard";
import TabButtons from "../../components/file/FileTab"; // TabButtons 컴포넌트 임포트

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

// ImageResourceBoard 컴포넌트를 정의합니다.
const TrashImageFileBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("fileTitle");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);

  const [images, setImages] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const postsPerPage = 14;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetcher
      .get(DEACTIVE_IMAGE_BOARD, {
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

  const handleActivation = async (id) => {
    if (window.confirm("정말로 이 이미지를 활성화하시겠습니까?")) {
      try {
        await fetcher.post(`${FILE_ACTIVE}/${id}`);
        setImages(images.filter((image) => image.originalResourceId !== id));

        window.alert("이미지를 활성화하였습니다.");
      } catch (err) {
        console.error("이미지 활성화 오류:", err);
        window.alert("이미지 활성화에 실패했습니다.");
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          비활성화 이미지 페이지
        </h1>
      </header>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1);
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
        imageBoardPath={TRASH_IMAGE_FILE} // 상수에서 경로 가져오기
        videoBoardPath={TRASH_VIDEO_FILE} // 상수에서 경로 가져오기
      />

      {/* 그리드 시작 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {images.length > 0 ? (
          images.map((file, index) => (
            <TrashCard
            key={file.originalResourceId}
            file={{ ...file, index }} // index를 props로 전달
            handleActivation={handleActivation}
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
    </div>
  );
};

export default TrashImageFileBoard;
