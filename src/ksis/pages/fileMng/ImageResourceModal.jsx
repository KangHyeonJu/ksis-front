import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "../../css/dialog";
import { ImCross } from "react-icons/im";
import { IMG_ORIGINAL_BASIC } from "../../../constants/api_constant";
import { format, parseISO } from "date-fns";
import fetcher from "../../../fetcher";

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {
  const [modals, setModal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadModal = useCallback(async () => {
    fetcher
      .get(IMG_ORIGINAL_BASIC + `/${originalResourceId}`)
      .then((response) => {
        setModal(response.data);
      })
      .catch((error) => {
        console.error("fetching Error :", error);
      });
  }, [originalResourceId]);

  useEffect(() => {
    if (isOpen && originalResourceId) {
      loadModal();
    }
  }, [isOpen, originalResourceId, loadModal]);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = modals.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(modals.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="items-center text-center" onClick={onRequestClose}>
        <div className="fixed inset-0 flex items-center justify-center">
        <div
            className="relative mx-auto rounded-lg w-full h-auto max-w-3xl max-h-[80vh] p-6 bg-white"
          
          >
        <ImCross
              className="absolute -top-2 -right-2 text-white cursor-pointer bg-red-500 rounded-full size-6 hover:scale-125 "
              onClick={onRequestClose}
            />
          <div
            className="relative mx-auto rounded-lg w-full h-auto max-w-3xl max-h-[80vh] p-6 bg-white border-gray-400 overflow-hidden"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            

            {modals.length > 0 ? (
              <div className="text-center items-center p-2 max-h-[70vh] overflow-y-auto">
                {modals.length > 0 && (
                  <div className="w-full h-auto max-w-lg mx-auto my-2">
                    <img
                      src={modals[0].filePath}
                      alt={modals[0].fileTitle}
                      className="w-full h-auto max-h-[40vh] object-contain"
                    />
                  </div>
                )}

                {currentItems.some(post => post.encodedResourceId !== null) ? (
                  <table className="w-full table-fixed border-collapse mt-4">
                    <thead className="border-t border-b border-double border-[#FF9C00]">
                      <tr className="font-bold">
                        <th className="w-5/12 p-2">제목</th>
                        <th className="w-3/12 p-2">인코딩 일자</th>
                        <th className="w-3/12 p-2">해상도</th>
                        <th className="w-2/12 p-2"> 포맷</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((post, index) =>
                        post.fileTitle !== null ? (
                          <tr key={index}>
                            <td
                              className="text-left p-2 border-b border-gray-300 bg-white overflow-hidden text-ellipsis whitespace-nowrap"
                              title={post.fileTitle}
                              style={{ maxWidth: "150px" }}
                            >
                              {post.fileTitle}
                            </td>
                            <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                              {formatDate(post.regTime)}
                            </td>
                            <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                              {post.resolution}
                            </td>
                            <td className="p-2 text-gray-800 text-center border-b border-gray-300">
                              {post.format}
                            </td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    인코딩된 파일이 없습니다.
                  </div>
                )}

                {modals.length > 5 && (
                  <div className="flex justify-between mt-4">
                    <button
                      className={`px-4 py-2 rounded-full border-2 
                      ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 border-gray-300"
                          : "bg-[#ffb247] text-white border-[#ffb247] hover:bg-[#ff8812]"
                      }
                    `}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <span className="text-xl font-bold">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-full border-2 
                      ${
                        currentPage === totalPages
                          ? "bg-gray-300 text-gray-500 border-gray-300"
                          : "bg-[#ffb247] text-white border-[#ffb247] hover:bg-[#ff8812]"
                      }
                    `}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-span-full text-center text-gray-500">
                파일이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>  
      </div>
    </Dialog>
  );
};

export default FileBoardModal;
