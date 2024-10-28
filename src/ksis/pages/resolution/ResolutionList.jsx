import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";
import { FaSearch } from "react-icons/fa";
import ResolutionAddModal from "./ResolutionAddModal";
import ResolutionUpdateModal from "./ResolutionUpdateModal";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import CheckboxTable from "../../components/CheckboxTable";

const ResolutionList = () => {
  const [resolutions, setResolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [selectUpdate, setSelectUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const openUpdateModal = (resolutionId) => {
    setSelectUpdate(resolutionId);
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectUpdate(null);
  };

  const postsPerPage = 15;

  const loadPage = async () => {
    try {
      const response = await fetcher.get(RESOLUTION + "/all", {
        params: {
          page: currentPage - 1,
          size: postsPerPage,
          searchTerm,
          searchCategory,
        },
      });
      if (response.data.content) {
        setResolutions(response.data.content);
        setTotalPages(response.data.totalPages);

        setLoading(false);
      } else {
        console.error("No data property in response");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    loadPage();
  }, [currentPage, searchTerm]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const deleteResolution = async (e) => {
    try {
      if (selectedPosts.size === 0) {
        alert("삭제할 해상도를 선택해주세요.");
        return;
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const queryString = Array.from(selectedPosts).join(",");
          const response = await fetcher.delete(
            RESOLUTION + "?resolutionIds=" + queryString
          );
          console.log(response.data);
          setResolutions((prevresolution) =>
            prevresolution.filter(
              (resolution) => !selectedPosts.has(resolution.resolutionId)
            )
          );
          alert("해상도가 정상적으로 삭제되었습니다.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleModalClose = async () => {
    await loadPage();
    closeModal();
  };

  const handleUpdateModalClose = async () => {
    await loadPage();
    closeUpdateModal();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto whitespace-nowrap py-6 px-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        해상도 관리
      </h1>

      <div className="flex items-center relative flex-grow border-y border-gray-300 my-10">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 bg-white text-[#444444] font-bold border-x border-gray-300"
        >
          <option value="name">이름</option>
          <option value="width">가로</option>
          <option value="height">세로</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="검색어를 입력하세요"
            className="w-full p-2"
          />
        </div>
        <div className="bg-[#FF9C00] border-x border-[#FF9C00] text-white h-10 w-10 inline-flex items-center text-center">
          <FaSearch className=" w-full" />
        </div>
      </div>

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center p-8 bg-white rounded-sm h-160">
        <CheckboxTable
          headers={["이름", "가로 X 세로(px)", ""]}
          data={resolutions}
          dataKeys={[
            {
              content: (item) => item.name,
              className: "text-gray-800 text-center border-b border-gray-300",
            },
            {
              content: (item) => item.width + "x" + item.height,
              className: "text-gray-800 text-center border-b border-gray-300",
            },
          ]}
          uniqueKey="resolutionId"
          selectedItems={selectedPosts}
          setSelectedItems={setSelectedPosts}
          renderActions={(item) => (
            <button
              onClick={() => openUpdateModal(item.resolutionId)}
              className="rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                        hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
            >
              수정
            </button>
          )}
        />
      </div>

      <div className="flex justify-end space-x-2 my-10">
        <button
          type="button"
          className="rounded-smd border border-[#FF9C00] bg-[#FF9C00] text-white px-3 py-2 text-sm font-semibold shadow-sm 
              hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-[#FF9C00] transition duration-200"
          onClick={openModal}
        >
          해상도 등록
          <ResolutionAddModal
            isOpen={modalIsOpen}
            onRequestClose={handleModalClose}
          />
        </button>
        <button
          onClick={deleteResolution}
          type="button"
          className="rounded-smd border border-[#444444] bg-[#444444] text-white px-3 py-2 text-sm font-semibold shadow-sm 
            hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
        >
          삭제
        </button>
      </div>

      {selectUpdate && (
        <ResolutionUpdateModal
          isOpen={updateModalIsOpen}
          onRequestClose={handleUpdateModalClose}
          resolutionId={selectUpdate}
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Stack spacing={2} className="mt-10 items-center">
          <Pagination
            shape="rounded"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </div>
  );
};

export default ResolutionList;
