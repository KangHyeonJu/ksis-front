import React, { useCallback, useEffect, useState } from "react"; // React의 훅을 가져옵니다.
import { Dialog } from "../../css/dialog"; // Dialog 컴포넌트를 가져옵니다.
import { IMG_ORIGINAL_BASIC  } from "../../../constants/api_constant"; // 상수를 가져옵니다.
import { format, parseISO } from 'date-fns';
import fetcher from "../../../fetcher";

const FileBoardModal = ({ isOpen, onRequestClose, originalResourceId }) => {  
  const [modals, setModal] = useState([]); // 모달을 관리하기 위한 상태를 선언합니다.

  const loadModal = useCallback(async () => {

    fetcher 
    .get(IMG_ORIGINAL_BASIC + `/${originalResourceId}`)
    .then(response => {
      setModal(response.data); // 이미지를 상태에 저장합니다.
      console.log("이미지 모달 데이터 : ", response.data); // 이미지 데이터를 콘솔에 출력합니다.
    })
    .catch(error => {
      console.error(':', error); // 에러 발생 시 콘솔에 출력합니다.
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
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
    }}

    
 

  return (

    <Dialog open={isOpen} onClose={onRequestClose}> {/* 모달이 열렸을 때 렌더링됩니다. */}

      <div className=" items-center text-center">
        <div>

           {/* 네모틀 */}
          <div className=" mx-auto rounded-lg w-1/2 h-full p-3 bg-[#ffe69c]">
             
           {/* 닫기 버튼 */}
            <div className="text-right">
              <button
                onClick={onRequestClose}
                className="rounded-full text-red-700 hover:bg-[#ffc774] 
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 w-7 h-7 
                font-bold"
                aria-label="Close"
              >
                &times;  {/* &times;는 "×" 기호를 의미합니다 */}
              </button>
            </div>

            {/* 모달 내용 */}
            <div className=" text-center items-center p-2">
              {modals.map((post, index) => ( // resources 배열을 반복하여 이미지를 렌더링합니다.
                <div key={index} className="mb-4">
                  {/* 이미지 */}
                  <div className="w-1/3 h-1/3 overflow-hidden mx-auto mb-4 ">
                  <img 
                    src={post.filePath} 
                    alt={post.fileTitle} 
                    className=" w-full h-full"  
                  />
                  </div>

                  {/* 데이터 테이블 */}
                  <table className="min-w-full divide-y divide-black border-collapse 
                  border border-black mb-4 text-center">
                    <thead>
                      <tr>
                        <td className="border border-black bg-[#ffb247]">제목</td>
                        <td className="border border-black bg-[#ffb247]">인코딩 일자</td>
                        <td className="border border-black bg-[#ffb247]">해상도</td>
                        <td className="border border-black bg-[#ffb247]">포맷</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black bg-white">{post.fileTitle}</td>
                        <td className="border border-black bg-white">{formatDate(post.regTime)}</td>
                        <td className="border border-black bg-white">{post.resolution}</td>
                        <td className="border border-black bg-white">{post.format}</td>
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
