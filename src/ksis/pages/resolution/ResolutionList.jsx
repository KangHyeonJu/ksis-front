import { useState, useEffect, useMemo } from "react";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";
import { FaSearch } from "react-icons/fa";
import ResolutionAddModal from "./ResolutionAddModal";
import ResolutionUpdateModal from "./ResolutionUpdateModal";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";

const ResolutionList = () => {
  const [resolutions, setResolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);
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

  const postsPerPage = 10;

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
      } else {
        console.error("No data property in response");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [currentPage, searchTerm]);

  const handleCheckboxChange = (postId) => {
    setSelectedPosts((prevSelectedPosts) => {
      const newSelectedPosts = new Set(prevSelectedPosts);
      if (newSelectedPosts.has(postId)) {
        let newCheckedRowId = checkedRowId.filter((e) => e !== postId);
        setCheckedRowId(newCheckedRowId);

        newSelectedPosts.delete(postId);
      } else {
        setCheckedRowId([...checkedRowId, postId]);
        newSelectedPosts.add(postId);
      }
      return newSelectedPosts;
    });
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

  const deleteResolution = async (e) => {
    try {
      if (checkedRowId.length === 0) {
        alert("삭제할 해상도를 선택해주세요.");
      } else {
        if (window.confirm("삭제하시겠습니까?")) {
          const queryString = checkedRowId.join(",");
          const response = await fetcher.delete(
            RESOLUTION + "?resolutionIds=" + queryString
          );
          console.log(response.data);
          setResolutions((prevresolution) =>
            prevresolution.filter(
              (resolution) => !checkedRowId.includes(resolution.resolutionId)
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
    <div className="mx-auto max-w-screen-2xl whitespace-nowrap p-6">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        해상도 관리
      </h1>

      <SearchBar
        onSearch={(term, category) => {
          setSearchTerm(term);
          setSearchCategory(category);
          setCurrentPage(1);
        }}
        searchOptions={[
          { value: "name", label: "이름" },
          { value: "width", label: "가로" },
          { value: "height", label: "세로" },
        ]}
        defaultCategory="name"
      />

      <div className="flex justify-end space-x-2 mb-4">
        <button
          type="button"
          className="rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
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
          className="mr-2 rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
               hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
        >
          삭제
        </button>
      </div>

      <table className="w-full table-fixed border-collapse mt-4">
        <thead className="border-t border-b border-double border-[#FF9C00]">
          <tr>
            <th className="w-1/12 p-2 text-center text-gray-800">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedPosts(
                    isChecked
                      ? new Set(resolutions.map((post) => post.resolutionId))
                      : new Set()
                  );
                }}
              />
            </th>
            <th className="w-4/12 p-2 text-gray-800 text-center">이름</th>
            <th className="w-4/12 p-2 text-gray-800 text-center">
              가로 X 세로(px)
            </th>
            <th className="w-3/21 p-2 text-gray-800 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {resolutions.map((post) => (
            <tr key={post.resolutionId}>
              <td className="text-center p-2 border-b border-gray-300">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.resolutionId)}
                  onChange={() => handleCheckboxChange(post.resolutionId)}
                />
              </td>

              <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                {post.name}
              </td>

              <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                {post.width} x {post.height}
              </td>

              <td className="border-b border-gray-300 p-2 text-center">
                <button
                  onClick={() => openUpdateModal(post.resolutionId)}
                  className="rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
                      hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
                >
                  수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectUpdate && (
        <ResolutionUpdateModal
          isOpen={updateModalIsOpen}
          onRequestClose={handleUpdateModalClose}
          resolutionId={selectUpdate}
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Stack spacing={2} className="mt-10">
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

export default ResolutionList;
