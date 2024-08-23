import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogTitle } from "../../css/dialog";
import fetcher from "../../../fetcher";
import { FILE_MODAL } from "../../../constants/page_constant";

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {
  
  const [resources, setResources] = useState([]);

  const loadModal = useCallback(async () => {
    try {
      const response = await fetcher.get(FILE_MODAL + `/${originalResourceId}`);
      setResources(response.data);

      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        <div>
      <button
            onClick={onRequestClose}
            className="absolute top-10 right-96 rounded-full
             bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2
              focus:ring-red-400 focus:ring-offset-2 w-7 h-7 "
            aria-label="Close"
          >
            &times;  {/* &times;는 "×" 기호를 의미합니다 */}
          </button>
        <div className="p-2 inline-block align-bottom rounded-md bg-[#ffe374] px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-6/12 sm:p-6 h-140 relative">
          
          {/* X 버튼 */}
          

          <div className="p-2">
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
              
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </Dialog>
  );
};

export default FileBoardModal;
