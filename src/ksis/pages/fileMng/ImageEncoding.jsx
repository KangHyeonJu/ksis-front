import React, { useState, useEffect } from 'react';
import { IMAGE_RESOURCE_BOARD, IMAGE_FILE_BOARD } from '../../../constants/page_constant';
import { FILE_ALL, FILE_ENCODED_BASIC } from '../../../constants/api_constant';
import axios from 'axios';

const ImageEncoding = () => {
    const [images, setImages] = useState([]);
 

  // Effect hook for performing side effects
  useEffect(() => {
    axios.get( FILE_ALL )
    .then(response => {
        setImages(response.data);
        console.log("원본 이미지 인코딩 페이지 데이터 : ", response.data); //이미지 데이터 확인
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });
}, []);

  return (
    <div className="items-center text-center" >
    <div className="mx-auto rounded-lg w-2/3 h-full p-3 bg-[#ffe69c]">
      
      <h1 className="text-xl font-bold mb-4">인코딩 페이지</h1>

      <div className="mx-auto rounded-lg w-2/4 h-full p-3 bg-white">
      </div>
      
    </div>
    </div>
  );
};

export default ImageEncoding;
