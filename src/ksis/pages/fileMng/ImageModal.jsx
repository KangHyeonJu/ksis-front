import React, { useCallback, useEffect, useState } from "react"; // React의 훅을 가져옵니다.
import { Dialog } from "../../css/dialog"; // Dialog 컴포넌트를 가져옵니다.
import { FILE_ENCODED_BASIC  } from "../../../constants/api_constant"; // 상수를 가져옵니다.
import axios from "axios"; // axios를 가져옵니다.

const ImageModal = ({ isOpen, onRequestClose, encodedResourceId }) => {  
  const [modals, setModal] = useState([]); // 모달을 관리하기 위한 상태를 선언합니다.

  const loadModal = useCallback(async () => {

    axios.get(FILE_ENCODED_BASIC + `/${encodedResourceId}`)
    .then(response => {
      setModal(response.data); // 이미지를 상태에 저장합니다.
      console.log("인코딩 이미지 모달 데이터 : ", response.data); // 이미지 데이터를 콘솔에 출력합니다.
    })
    .catch(error => {
      console.error(':', error); // 에러 발생 시 콘솔에 출력합니다.
    });
  }, [encodedResourceId]); // encodedResourceId 변경될 때마다 함수를 재생성합니다.

  useEffect(() => {
    // 모달이 열리고 encodedResourceId 있을 때 데이터를 로드합니다.
    if (isOpen && encodedResourceId) {
      loadModal();
    }
  }, [isOpen, encodedResourceId, loadModal]); // 의존성 배열에 따라 실행됩니다.

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
             
                <div className="mb-4">
                  {/* 이미지 */}
           {/*        <div className="w-1/3 h-1/3 overflow-hidden mx-auto mb-4 ">
                  <img 
                    src={post.filePath} 
                    alt={post.fileTitle} 
                    className=" w-full h-full"  
                  />
                  </div> */}
                </div>
            </div>
          </div>
        </div>
      </div>
      
    </Dialog>
    
  );
};

export default ImageModal; // 컴포넌트를 내보냅니다.
