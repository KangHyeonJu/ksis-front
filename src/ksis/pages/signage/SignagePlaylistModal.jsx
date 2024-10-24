import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogBody } from "../../css/dialog";
import fetcher from "../../../fetcher";
import {
  SIGNAGE_PLAYLIST,
  SIGNAGE_RESOURCE_PAGE,
} from "../../../constants/api_constant";
import { ImCross } from "react-icons/im";
import SignageResourceModal from "./SignageResourceModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaSearch } from "react-icons/fa";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { BsPlusSquare } from "react-icons/bs";

const SignagePlaylistModal = ({ isOpen, onRequestClose, signageId }) => {
  const [data, setData] = useState({
    deviceId: "",
    fileTitle: "",
    slideTime: "",
  });
  const [resources, setResources] = useState([]);
  const [resourceSequence, setResourceSequence] = useState([]);
  const [resourceAdds, setResourceAdds] = useState([]);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const postsPerPage = 8; // 한 페이지 10개 데이터

  //이미지/영상 불러오기
  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);
  const openResourceModal = () => setResourceModalIsOpen(true);

  const closeResourceModal = () => {
    setResourceModalIsOpen(false);
    loadModal();
    setResourceAdds([]);
  };

  //재생장치의 인코딩리소스 불러오기
  const loadModal = async () => {
    try {
      const response = await fetcher.get(
        SIGNAGE_RESOURCE_PAGE + `/${signageId}`,
        {
          params: {
            page: currentPage - 1,
            size: postsPerPage,
            searchTerm,
            searchCategory,
          },
        }
      );

      if (response.data) {
        setResources(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("No data property in response");
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isOpen && signageId) {
      loadModal();
      setResourceAdds([]);
    }
  }, [isOpen, signageId]);

  useEffect(() => {
    loadModal();
  }, [currentPage, searchTerm, searchCategory]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 핸들러
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 검색어 변경 핸들러
  const handleCategory = (e) => {
    setSearchCategory(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  //이미지 클릭 시 재생목록 추가 및 삭제
  const addList = (resource) => {
    if (
      !resourceAdds.some(
        (res) => res.encodedResourceId === resource.encodedResourceId
      )
    ) {
      setResourceAdds([...resourceAdds, resource]);
    }
  };

  const removeList = (resource) => {
    setResourceAdds((prevResources) =>
      prevResources.filter(
        (res) => res.encodedResourceId !== resource.encodedResourceId
      )
    );
  };

  //drag&drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(resourceAdds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResourceAdds(items);
  };

  //재생 목록 등록
  useEffect(() => {
    setResourceSequence(
      resourceAdds.map((resource, index) => ({
        encodedResourceId: resource.encodedResourceId, // encodedResourceId를 추가
        sequence: index + 1, // 인덱스를 추가
      }))
    );

    setData((prevData) => ({
      ...prevData,
      deviceId: signageId,
    }));
  }, [resourceAdds, signageId]);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addPlayList = async () => {
    try {
      console.log("resourceAdds", resourceAdds);
      if (data.fileTitle === null || data.fileTitle === "") {
        alert("재생목록 제목을 입력하세요.");
        return;
      } else if (data.fileTitle.length > 50) {
        alert("제목을 50자 이내로 작성하세요.");
        return;
      }

      if (data.slideTime === null || data.slideTime === "") {
        alert("Slide Time을 입력하세요.");
        return;
      } else if (data.slideTime <= 0) {
        alert("Slide Time은 0보다 커야합니다");
        return;
      }

      if (resourceAdds.length === 0) {
        alert("재생목록에 추가할 파일을 선택하세요.");
        return;
      }
      const formData = new FormData();
      formData.append(
        "playListAddDTO",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      formData.append(
        "resourceSequence",
        new Blob([JSON.stringify(resourceSequence)], {
          type: "application/json",
        })
      );
      if (window.confirm("등록하시겠습니까?")) {
        const response = await fetcher.post(SIGNAGE_PLAYLIST, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response.data);

        alert("재생목록이 정상적으로 등록되었습니다.");
        setData({ fileTitle: "", slideTime: "" });
        setSearchCategory("");
        setSearchTerm("");
        onRequestClose();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onCloseHandler = async () => {
    setData({ fileTitle: "", slideTime: "" });
    setSearchCategory("");
    setSearchTerm("");
    setCurrentPage(1);
    onRequestClose();
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-gray-100 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:align-middle sm:w-6/12 sm:p-6 h-160">
          <div className="h-full">
            <div className="flex items-center justify-center">
              <DialogTitle className="leading-6 text-gray-900 text-center flex-grow">
                <p className="text-xl">재생 목록 등록</p>
              </DialogTitle>

              <div
                className="relative inline-block cursor-pointer mr-1"
                onClick={openResourceModal}
              >
                <BsPlusSquare
                  size="22"
                  className="text-gray-700 hover:text-[#FF9C00]"
                />
                {/* <button
                onClick={openResourceModal}
                type="button"
                className="rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ml-4"
              >
                파일 불러오기
              </button> */}

                <SignageResourceModal
                  isOpen={resourceModalIsOpen}
                  onRequestClose={closeResourceModal}
                  signageId={data.deviceId}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-9/12 pr-4">
                <DialogBody>
                  <div className="mb-4 flex items-center">
                    <div className="w-full h-140 border border-gray-900 overflow-y-auto p-4 bg-white">
                      <div className="mb-4 flex items-center">
                        <select
                          value={searchCategory}
                          onChange={handleCategory}
                          className="mr-1 p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">전체</option>
                          <option value="image">이미지</option>
                          <option value="video">영상</option>
                        </select>
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="검색어를 입력하세요"
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                          />
                          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4">
                          {resources.map((resource) => (
                            <div
                              key={resource.encodedResourceId}
                              onClick={() => addList(resource)}
                              className="group relative border border-gray-900 cursor-pointer"
                            >
                              <div className="w-full h-full overflow-hidden bg-gray-200 lg:h-40">
                                <img
                                  src={resource.thumbFilePath}
                                  alt={resource.fileTitle}
                                  className="h-full w-full object-cover object-center transform hover:brightness-90"
                                />
                              </div>
                              {resourceAdds.find(
                                (r) =>
                                  r.encodedResourceId ===
                                  resource.encodedResourceId
                              ) && (
                                <div className="absolute top-0 left-0 m-2 rounded-full border border-black bg-gray-200 h-6 w-6 flex items-center justify-center">
                                  {resourceAdds.findIndex(
                                    (r) =>
                                      r.encodedResourceId ===
                                      resource.encodedResourceId
                                  ) + 1}
                                </div>
                              )}
                              <div className="relative group text-gray-700 text-center w-full p-1 bg-white">
                                <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                  {resource.fileTitle}
                                </p>

                                <span className="z-10 absolute left-0 bottom-1/4 w-full p-1 bg-gray-100/90 text-sm  opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  {resource.fileTitle}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Stack spacing={2} className="mt-6">
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color={"primary"}
                          className="z-20"
                        />
                      </Stack>
                    </div>
                  </div>
                </DialogBody>
              </div>
              <div className="w-3/12">
                <DialogBody className="mt-2">
                  <div className="mb-4 flex items-center">
                    <div className="w-full h-140 border border-gray-900 overflow-y-auto p-4 bg-white">
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable-1">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {resourceAdds.map((resourceAdd, index) => (
                                <Draggable
                                  key={resourceAdd.encodedResourceId}
                                  draggableId={resourceAdd.encodedResourceId.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="group relative rounded-md border border-gray-300 bg-white h-10 text-center pt-1.5 hover:bg-gray-200"
                                    >
                                      <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                        {resourceAdd.fileTitle}
                                      </p>
                                      {/* <span className="absolute left-0 w-auto p-1 bg-gray-100/90 text-sm  opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                                        {resourceAdd.fileTitle}
                                      </span> */}
                                      <ImCross
                                        className="absolute top-0 right-0 text-red-500 cursor-pointer"
                                        onClick={() => removeList(resourceAdd)}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </DialogBody>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex">
                <label className="h-10 w-20 block text-center text-sm pt-1.5 font-semibold border border-gray-200 leading-6 text-gray-900">
                  제목
                </label>
                <input
                  className="h-10 w-60 pl-2 border-y border-r border-gray-200"
                  type="text"
                  value={data.fileTitle}
                  name="fileTitle"
                  onChange={onChangeHandler}
                />

                <div className="flex ml-2">
                  <label className="h-10 w-24 block text-center text-sm pt-1.5 font-semibold border border-gray-200 leading-6 text-gray-900">
                    Slide Time
                  </label>
                  <input
                    className="h-10 w-20 pl-2 border-y border-gray-200"
                    type="number"
                    value={data.slideTime}
                    name="slideTime"
                    onChange={onChangeHandler}
                  />
                  <p className="bg-white inline-flex items-center pr-1 border-y border-r border-gray-200">
                    (s)
                  </p>
                </div>
              </div>
              <div className="flex flex-row-reverse">
                <button
                  onClick={onCloseHandler}
                  className="ml-2 inline-flex justify-center rounded-sm px-4 py-2 bg-[#444444] text-sm font-medium text-white hover:bg-gray-200 hover:text-[#444444] hover:font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={addPlayList}
                  className="inline-flex justify-center rounded-sm px-4 py-2 bg-[#FF9C00] text-sm font-medium text-white hover:bg-gray-200 hover:text-[#444444] hover:font-semibold"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SignagePlaylistModal;
