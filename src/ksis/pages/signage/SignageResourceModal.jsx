import React, { useCallback, useEffect, useState, useRef } from "react";
import { Dialog, DialogTitle, DialogBody } from "../../css/dialog";
import fetcher from "../../../fetcher";
import {
  SIGNAGE_ACCOUNT_RESOURCE,
  SIGNAGE_ADD_RESOURCE,
  SIGNAGE_RESOURCE,
} from "../../../constants/api_constant";
import { ImCross } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { BsXCircleFill } from "react-icons/bs";

const SignageResourceModal = ({ isOpen, onRequestClose, signageId }) => {
  const modalRef = useRef(null);

  //재생장치의 인코딩리소스 불러오기
  const [resources, setResources] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [addResources, setAddResources] = useState([]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onRequestClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadModal = useCallback(async () => {
    try {
      const [responseResource, responseMyResource] = await Promise.all([
        fetcher.get(SIGNAGE_RESOURCE + `/${signageId}`),
        fetcher.get(SIGNAGE_ACCOUNT_RESOURCE),
      ]);

      setResources(responseResource.data);
      setMyResources(responseMyResource.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [signageId]);

  useEffect(() => {
    if (isOpen && signageId) {
      loadModal();
    }
  }, [isOpen, signageId, loadModal]);

  //삭제
  const deleteResource = async (encodedResourceId) => {
    try {
      if (window.confirm("삭제하시겠습니까?")) {
        const response = await fetcher.delete(
          SIGNAGE_RESOURCE + `/${signageId}/` + encodedResourceId
        );

        console.log(response.data);

        setResources((prevResources) =>
          prevResources.filter(
            (resource) => resource.encodedResourceId !== encodedResourceId
          )
        );

        setAddResources((prevResources) =>
          prevResources.filter((id) => id !== encodedResourceId)
        );
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //추가
  const addResource = (resource) => {
    // 이미 resources에 존재하면 추가하지 않음
    if (
      resources.some(
        (res) => res.encodedResourceId === resource.encodedResourceId
      )
    ) {
      return;
    }
    setAddResources((prevResources) => [
      ...prevResources,
      resource.encodedResourceId,
    ]);
    setResources((prevResources) => [...prevResources, resource]);
  };

  const addResourceOnClick = async () => {
    try {
      if (window.confirm("저장하시겠습니까?")) {
        const formData = new FormData();

        formData.append(
          "encodedResourceIdList",
          new Blob([JSON.stringify(addResources)], { type: "application/json" })
        );

        const postData = await fetcher.post(
          SIGNAGE_ADD_RESOURCE + `/${signageId}`,
          formData
        );

        console.log(postData);

        alert("이미지/영상이 추가되었습니다.");
        onRequestClose();
      }
    } catch (error) {
      console.log(error.postData);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          ref={modalRef}
          className="inline-block align-bottom bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-9/12 sm:p-6"
        >
          <div className="flex h-160">
            <div className="w-4/6 pr-4">
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900 text-center">
                재생장치 이미지/영상
              </DialogTitle>
              <DialogBody className="mt-2">
                <div className="mb-4 flex items-center">
                  <div className="w-full border h-150 border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                    <div className="space-y-2">
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                        {resources.map((resource) => (
                          <div
                            key={resource.encodedResourceId}
                            className="group relative border border-gray-900 mb-5"
                          >
                            <button
                              className="absolute top-0 right-0 m-2 text-red-500 cursor-pointer"
                              onClick={() =>
                                deleteResource(resource.encodedResourceId)
                              }
                            >
                              <ImCross />
                            </button>
                            <div className="w-full overflow-hidden bg-gray-200 lg:h-60">
                              <img
                                src={resource.thumbFilePath}
                                alt={resource.fileTitle}
                                height=""
                                width=""
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="relative group text-gray-700 text-center w-full p-1 bg-white">
                              <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {resource.fileTitle}
                              </p>

                              {resource.fileTitle.length > 20 && (
                                <span className="absolute left-0 w-auto p-1 bg-gray-100 text-sm  opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  {resource.fileTitle}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogBody>
            </div>

            <div className="border-l border-gray-400 pr-4"></div>

            <div className="w-2/6">
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900 text-center">
                내 이미지/영상
              </DialogTitle>
              <DialogBody className="mt-2">
                <div className="mb-4 flex items-center">
                  <div className="w-full h-150 border border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                    <div className="space-y-2">
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-2 md:gap-y-0 lg:gap-x-8">
                        {myResources.map((resource) => {
                          const isInResources = resources.some(
                            (res) =>
                              res.encodedResourceId ===
                              resource.encodedResourceId
                          );
                          return (
                            <div
                              key={resource.encodedResourceId}
                              className={`group relative border border-gray-900 mb-5 ${
                                isInResources ? "bg-orange-200" : "bg-white"
                              }`}
                            >
                              <div className="w-full overflow-hidden lg:h-60">
                                <img
                                  src={resource.thumbFilePath}
                                  alt={resource.fileTitle}
                                  height=""
                                  width=""
                                  className="h-full w-full object-cover object-center cursor-pointer"
                                  onClick={() => addResource(resource)}
                                />
                              </div>
                              <div className="relative group text-gray-700 text-center w-full p-1 bg-white">
                                <p className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                  {resource.fileTitle}
                                </p>

                                {resource.fileTitle.length > 20 && (
                                  <span className="absolute left-0 w-auto p-1 bg-gray-100 text-sm  opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    {resource.fileTitle}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogBody>
              <div className="flex flex-row-reverse">
                <button
                  onClick={onRequestClose}
                  className="ml-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#f48f8f] text-base font-bold text-black shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  닫기
                </button>
                <button
                  onClick={addResourceOnClick}
                  className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#6dd7e5] text-base font-bold text-black shadow-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
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

export default SignageResourceModal;
