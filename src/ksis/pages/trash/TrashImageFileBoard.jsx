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

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import ButtonComponentB from "../../components/ButtonComponentB";
import TabButton from "../../components/TapButton";

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
            <TabButton
                label="이미지"
                path={TRASH_IMAGE_FILE}
                isActive={location.pathname === TRASH_IMAGE_FILE}
                onClick={() => navigate(TRASH_IMAGE_FILE)}
            />
            <TabButton
                label="영상"
                path={TRASH_VIDEO_FILE}
                isActive={location.pathname === TRASH_VIDEO_FILE}
                onClick={() => navigate(TRASH_VIDEO_FILE)}
            />
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
                      alt={post.fileTitle}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* 제목 */}
                <div className="flex justify-between w-full">
                  <h2
                    className="text-xl font-bold truncate max-w-full mx-auto justify-start"
                    title={post.fileTitle}
                  >
                    {post.fileTitle}
                  </h2>
                </div>

                {/* 등록일 */}
                <div className="mx-auto">
                  <p className="text-gray-500">{formatDate(post.regTime)}</p>
                </div>
                {/* 활성화 버튼 */}
                <div>
                  <div className="flex justify-center p-2">
                    <ButtonComponentB
                        onClick={() => handleActivation(post.originalResourceId)}
                        defaultColor="blue-600"
                        shadowColor="blue-800"
                    >
                      활성화
                    </ButtonComponentB>
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

      <div>
        <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TrashImageFileBoard;
