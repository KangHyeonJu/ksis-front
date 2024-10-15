import React, { useCallback, useEffect, useState } from "react"; // React의 훅을 가져옵니다.
import { Dialog } from "../../css/dialog"; // Dialog 컴포넌트를 가져옵니다.
import { ImCross } from "react-icons/im";
import { IMG_ORIGINAL_BASIC } from "../../../constants/api_constant"; // 상수를 가져옵니다.
import { format, parseISO } from 'date-fns';
import fetcher from "../../../fetcher";

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {
  const [modals, setModal] = useState([]); // 모달을 관리하기 위한 상태를 선언합니다.
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태를 추가합니다.
  const itemsPerPage = 5; // 한 페이지에 5개의 항목을 보여줍니다.

  const loadModal = useCallback(async () => {
    fetcher
      .get(IMG_ORIGINAL_BASIC + `/${originalResourceId}`)
      .then((response) => {
        setModal(response.data); // 이미지를 상태에 저장합니다.
      })
      .catch((error) => {
        console.error("fetching Error :", error); // 에러 발생 시 콘솔에 출력합니다.
      });
  }, [originalResourceId]); // originalResourceId가 변경될 때마다 함수를 재생성합니다.

  useEffect(() => {
    // 모달이 열리고 originalResourceId가 있을 때 데이터를 로드합니다.
    if (isOpen && originalResourceId) {
      loadModal();
    }
  }, [isOpen, originalResourceId, loadModal]); // 의존성 배열에 따라 실행됩니다.

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  // 페이지네이션을 위한 변수
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = modals.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(modals.length / itemsPerPage);

  // 페이지 이동 함수
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
    <Dialog open={isOpen} onClose={onRequestClose}> {/* 모달이 열렸을 때 렌더링됩니다. */}
      
      <div className="items-center text-center"
          onClick={onRequestClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          {/* 네모틀 */}
          <div className="relative mx-auto rounded-lg max-w-3xl w-full h-auto max-h-[80vh] p-6 bg-[#ffe69c]"
          onClick={(event) => {event.stopPropagation();}}>
            
            {/* 닫기 버튼 */}
            <ImCross
              className="absolute -top-2 -right-2 text-white cursor-pointer bg-red-500 rounded-full size-6 hover:scale-110"
              onClick={onRequestClose}
            />

            {/* 모달 내용 */}

            {modals.length > 0 ? (
            <div className="text-center items-center p-2">
              {/* 첫 번째 이미지만 렌더링 */}
              {modals.length > 0 && (
                <div className="">
                  {/* 이미지 */}
                  <div className="w-full h-full overflow-hidden mx-auto my-2">
                    <img 
                      src={modals[0].filePath} 
                      alt={modals[0].fileTitle} 
                      className="w-full h-full"  
                    />
                  </div>
                </div>
              )}

              {/* 테이블: 현재 페이지에 해당하는 항목만 렌더링 */}
              <table className="min-w-full divide-y divide-black border-collapse 
                border border-black mb-2 text-center">
                <thead>
                  <tr className="font-bold">
                    <td className="p-2 border border-black bg-[#ffb247]">제목</td>
                    <td className="p-2 border border-black bg-[#ffb247]">인코딩 일자</td>
                    <td className="p-2 border border-black bg-[#ffb247]">해상도</td>
                    <td className="p-2 border border-black bg-[#ffb247]">포맷</td>
                  </tr>
                </thead>
                <tbody>
                      {currentItems.map((post, index) => (
                        <tr key={index}>
                         <td
                            className="p-2 border border-black bg-white overflow-hidden text-ellipsis whitespace-nowrap"
                            title={post.fileTitle}
                            style={{ maxWidth: '150px' }} // 제목 셀의 최대 너비 설정
                          >
                            {post.fileTitle}
                          </td>
                          <td className="p-2 border border-black bg-white">{formatDate(post.regTime)}</td>
                          <td className="p-2 border border-black bg-white">{post.resolution}</td>
                          <td className="p-2 border border-black bg-white">{post.format}</td>
                        </tr>
                      ))}
                    </tbody>
              </table>

              {/* 페이지네이션 버튼 (totalPages가 1보다 클 때만 렌더링) */}
              {modals.length > 5 && (
                <div className="flex justify-between mt-4">
                  <button 
                    className={`px-4 py-2 rounded-full border-2 
                      ${currentPage === 1 ? 'bg-gray-300 text-gray-500 border-gray-300' : 'bg-[#ffb247] text-white border-[#ffb247] hover:bg-[#ff8812]'}
                    `}
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  <span className="text-xl font-bold">{currentPage} / {totalPages}</span>
                  <button 
                    className={`px-4 py-2 rounded-full border-2 
                      ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 border-gray-300' : 'bg-[#ffb247] text-white border-[#ffb247] hover:bg-[#ff8812]'}
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
    </Dialog>
  );
};

export default FileBoardModal;
