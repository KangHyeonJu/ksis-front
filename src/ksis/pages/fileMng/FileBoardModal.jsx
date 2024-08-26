import React, { useCallback, useEffect, useState } from "react"; // React의 훅을 가져옵니다.
import { Dialog, DialogTitle } from "../../css/dialog"; // Dialog 컴포넌트를 가져옵니다.
import { FILE_BASIC  } from "../../../constants/api_constant"; // 상수를 가져옵니다.
import axios from "axios"; // axios를 가져옵니다.

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {  
  const [modals, setModal] = useState([]); // 모달을 관리하기 위한 상태를 선언합니다.

  const loadModal = useCallback(async () => {

    axios.get(FILE_BASIC + `/${originalResourceId}`)
    .then(response => {
      setModal(response.data); // 이미지를 상태에 저장합니다.
      console.log("이미지 모달 데이터 : ", response.data); // 이미지 데이터를 콘솔에 출력합니다.
    })
    .catch(error => {
      console.error('에러:', error); // 에러 발생 시 콘솔에 출력합니다.
    });
  }, [originalResourceId]); // originalResourceId가 변경될 때마다 함수를 재생성합니다.

  useEffect(() => {
    // 모달이 열리고 originalResourceId가 있을 때 데이터를 로드합니다.
    if (isOpen && originalResourceId) {
      loadModal();
    }
  }, [isOpen, originalResourceId, loadModal]); // 의존성 배열에 따라 실행됩니다.


 

  return (
    <Dialog open={isOpen} onClose={onRequestClose}> {/* 모달이 열렸을 때 렌더링됩니다. */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div>
        
          <div className="p-2 inline-block align-bottom rounded-md bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-6/12 sm:p-6 h-140 relative">
              {/* 닫기 버튼 */}
          <button
            onClick={onRequestClose}
            className="absolute top-2 right-2 rounded-full
            text-center text-red-700 hover:bg-[#ffc774] focus:outline-none focus:ring-2
              focus:ring-red-400 focus:ring-offset-2 w-7 h-7 "
            aria-label="Close"
          >
            &times;  {/* &times;는 "×" 기호를 의미합니다 */}
          </button>
            {/* 모달 내용 */}
            <div className="p-2">
              {modals.map((props, index) => ( // resources 배열을 반복하여 이미지를 렌더링합니다.
                <div key={index} className="mb-4">
                  <img 
                    src={props.filePath} 
                    alt={props.fileTitle} 
                    className="w-full h-auto mt-4 cursor-pointer" 
                  />
                  {/* 데이터 테이블 */}
                  <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4 text-center">
                    <thead>
                      <tr>
                        <td className="border border-gray-300 bg-white">제목</td>
                        <td className="border border-gray-300 bg-white">인코딩 일자</td>
                        <td className="border border-gray-300 bg-white">해상도</td>
                        <td className="border border-gray-300 bg-white">포맷</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 bg-white">{props.fileTitle}</td>
                        <td className="border border-gray-300 bg-white">{props.encodingDate}</td>
                        <td className="border border-gray-300 bg-white">{props.resolution}</td>
                        <td className="border border-gray-300 bg-white">{props.format}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FileBoardModal; // 컴포넌트를 내보냅니다.
