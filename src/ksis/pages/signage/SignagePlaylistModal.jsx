import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogBody } from "../../css/dialog";
import fetcher from "../../../fetcher";
import { SIGNAGE_RESOURCE } from "../../../constants/api_constant";
import { ImCross } from "react-icons/im";
const SignagePlaylistModal = ({ isOpen, onRequestClose, signageId }) => {
  const addPlaylist = async () => {
    try {
    } catch (error) {}
  };

  //재생장치의 인코딩리소스 불러오기
  const [resources, setResources] = useState([]);

  const loadModal = useCallback(async () => {
    try {
      const response = await fetcher.get(SIGNAGE_RESOURCE + `/${signageId}`);
      setResources(response.data);

      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [signageId]);

  useEffect(() => {
    if (isOpen && signageId) {
      loadModal();
    }
  }, [isOpen, signageId, loadModal]);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-6/12 sm:p-6 h-140">
          <div className="h-full">
            <div className="items-center justify-center">
              <DialogTitle className="leading-6 text-gray-900 text-center">
                <p className="text-xl">재생 목록 등록</p>
              </DialogTitle>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-9/12 pr-4">
                <DialogBody>
                  <div className="mb-4 flex items-center">
                    <div className="w-full h-96 border border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                      <div className="space-y-2">
                        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4">
                          {resources.map((resource) => (
                            <div
                              key={resource.encodedResourceId}
                              className="group relative border border-gray-900 mb-5"
                            >
                              <div className="w-full overflow-hidden bg-gray-200 lg:h-40">
                                <img
                                  src={`${process.env.REACT_APP_API_BASE_URL}${resource.thumbFilePath}`}
                                  alt={resource.fileTitle}
                                  className="h-full w-full object-cover object-center transform hover:brightness-90"
                                />
                              </div>
                              <div className="text-gray-700 text-center w-full p-1">
                                {resource.fileTitle}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogBody>
              </div>
              <div className="w-3/12">
                <DialogBody className="mt-2">
                  <div className="mb-4 flex items-center">
                    <div className="w-full h-96 border border-gray-900 overflow-y-auto p-4 bg-[#f6f6f6]">
                      <div className="space-y-2">
                        <div className="rounded-full bg-[#fad96e] h-10">{}</div>
                      </div>
                    </div>
                  </div>
                </DialogBody>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex">
                <label className="h-10 w-20 block text-center text-sm pt-1.5 font-semibold bg-[#ffb247] leading-6 text-gray-900">
                  제목
                </label>
                <input className="h-10 w-60" />

                <div className="bg-[#d9d9d8] p-1 flex ml-2">
                  <p className="bg-[#f2f2f2] pr-1 pl-1">slide time</p>
                  <input className="w-20 ml-1" />
                  <p className="bg-white pr-1 pl-1">(s)</p>
                </div>
              </div>
              <div className="flex flex-row-reverse">
                <button
                  onClick={onRequestClose}
                  className="ml-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[#f48f8f] text-base font-bold text-black shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  닫기
                </button>
                <button
                  onClick={addPlaylist}
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

export default SignagePlaylistModal;
