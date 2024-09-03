import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "../../css/dialog";
import { FILE_BASIC } from "../../../constants/api_constant";
import axios from "axios";

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {  
  const [modalData, setModalData] = useState([]); // 모달 데이터를 관리하기 위한 상태

  const loadModal = useCallback(async () => {
    try {
      const response = await axios.get(FILE_BASIC + `/${originalResourceId}`);
      setModalData([response.data]); // 서버에서 받은 데이터를 상태에 저장
      console.log("이미지 모달 데이터 : ", response.data);
    } catch (error) {
      console.error('에러:', error);
    }
  }, [originalResourceId]);

  useEffect(() => {
    if (isOpen && originalResourceId) {
      loadModal();
    }
  }, [isOpen, originalResourceId, loadModal]);

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="p-2 inline-block align-bottom rounded-md bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-6/12 sm:p-6 h-140 relative">
          {/* 닫기 버튼 */}
          <button
            onClick={onRequestClose}
            className="absolute top-2 right-2 rounded-full text-center text-red-700 hover:bg-[#ffc774] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 w-7 h-7"
            aria-label="Close"
          >
            &times;
          </button>
          {/* 모달 내용 */}
          <div className="p-2">
            {modalData.map((data, index) => (
              <div key={index} className="mb-4">
                <img 
                  src={data.filePath} 
                  alt={data.fileTitle} 
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
                      <td className="border border-gray-300 bg-white">{data.fileTitle}</td>
                      <td className="border border-gray-300 bg-white">{data.encodingDate}</td>
                      <td className="border border-gray-300 bg-white">{data.resolution}</td>
                      <td className="border border-gray-300 bg-white">{data.format}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FileBoardModal;
