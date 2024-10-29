import { useState, useEffect } from "react";
import fetcher from "../../../fetcher";
import { RESOLUTION } from "../../../constants/api_constant";
import ResolutionAddModal from "./ResolutionAddModal";
import ResolutionUpdateModal from "./ResolutionUpdateModal";

import Loading from "../../components/Loading";
import PaginationComponent from "../../components/PaginationComponent";
import ButtonComponentB from "../../components/ButtonComponentB";
import ButtonComponent from "../../components/ButtonComponent";
import SearchBar from "../../components/SearchBar";
import CheckboxTable from "../../components/CheckboxTable";

const ResolutionList = () => {
  const [resolutions, setResolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const checked = true;

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
    } finally {
      setLoading(false);
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

      <div className="shadow-sm ring-1 ring-gray-900/5 text-center px-8 py-10 bg-white rounded-sm h-170">
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
          check={checked}
          renderActions={(item) => (
            <ButtonComponent
              onClick={() => openUpdateModal(resolutions.resolutionId)}
              defaultColor="blue-600"
              shadowColor="blue-800"
            >
              수정
            </ButtonComponent>
          )}
        />
      </div>

      <div className="flex justify-end space-x-2 my-10">
        <ButtonComponentB
          type="button"
          defaultColor="blue-600"
          shadowColor="blue-800"
          onClick={openModal}
        >
          해상도 등록
          <ResolutionAddModal
            isOpen={modalIsOpen}
            onRequestClose={handleModalClose}
          />
        </ButtonComponentB>

        <ButtonComponentB
          onClick={deleteResolution}
          defaultColor="red-600"
          shadowColor="red-800"
        >
          삭제
        </ButtonComponentB>
      </div>

      {selectUpdate && (
        <ResolutionUpdateModal
          isOpen={updateModalIsOpen}
          onRequestClose={handleUpdateModalClose}
          resolutionId={selectUpdate}
        />
      )}

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

export default ResolutionList;
