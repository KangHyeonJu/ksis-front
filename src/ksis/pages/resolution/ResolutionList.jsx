import { useState, useEffect, useMemo } from "react";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";
import ReactPaginate from "react-paginate";
import { FaSearch } from "react-icons/fa";
import ResolutionAddModal from "./ResolutionAddModal";
import ResolutionUpdateModal from "./ResolutionUpdateModal";

const ResolutionList = () => {
  const [resolutions, setResolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [checkedRowId, setCheckedRowId] = useState([]);

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
      const response = await fetcher.get(RESOLUTION);
      if (response.data) {
        setResolutions(response.data);
      } else {
        console.error("No data property in response");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

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

  const filteredPosts = useMemo(
    () =>
      resolutions.filter((resolution) => {
        const value = resolution[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
      }),
    [resolutions, searchTerm, searchCategory]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
        해상도 관리
      </h1>

      <div className="mb-4 flex items-center">
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="mr-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="name">이름</option>
          <option value="width">가로</option>
          <option value="height">세로</option>
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

      <div className="flex justify-end space-x-2 mb-4">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
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
          className="relative inline-flex items-center rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          삭제
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedPosts(
                    isChecked
                      ? new Set(filteredPosts.map((post) => post.deviceId))
                      : new Set()
                  );
                }}
              />
            </th>
            <th className="border border-gray-300">이름</th>
            <th className="border border-gray-300">가로 X 세로(px)</th>
            <th className="border border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr key={post.resolutionId}>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.resolutionId)}
                  onChange={() => handleCheckboxChange(post.resolutionId)}
                />
              </td>

              <td className="border border-gray-300 p-2">{post.name}</td>

              <td className="border border-gray-300 p-2">
                {post.width} x {post.height}
              </td>

              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => openUpdateModal(post.resolutionId)}
                  className="items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
    </div>
  );
};

export default ResolutionList;
