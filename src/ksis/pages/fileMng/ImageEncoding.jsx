import React, { useState, useEffect } from "react";
import {
  ENCODING_RESOURCE_FILE,
  ENCODED_IMG,
  RESOLUTION,
} from "../../../constants/api_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";

const ImageEncoding = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [encodingOptions, setEncodingOptions] = useState([
    { format: "png", resolution: "360p" },
  ]);

  const fetchImageData = async (originalResourceId) => {
    try {
      const response = await fetcher.get(
        `${ENCODING_RESOURCE_FILE}/${originalResourceId}`
      );
      setImage(response.data);
      console.log("원본 이미지 인코딩 페이지 데이터: ", response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  

  useEffect(() => {
    fetchImageData(params.originalResourceId);
  }, [params.originalResourceId]);

  const handleAddOption = () => {
    setEncodingOptions([
      ...encodingOptions,
      { format: "png", resolution: "360p" },
    ]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = encodingOptions.filter((_, i) => i !== index);
    setEncodingOptions(updatedOptions);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEncoding = async () => {
    try {
      for (const option of encodingOptions) {
        const requestData = {
          fileTitle: image.fileTitle,
          filePath: image.filePath,
          fileRegTime: image.regTime,
          format: option.format,
          resolution: option.resolution,
        };
        console.log("리퀘스트 데이터 : ", requestData);
        console.log("오리지널 리소스 아이디 : ", params.originalResourceId);
        const response = await fetcher.post(
          `${ENCODED_IMG}/${params.originalResourceId}`,
          requestData
        );

        if (response.status === 200) {
          console.log("인코딩 요청에 성공했습니다. ");
        } else {
          alert("인코딩 요청에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("인코딩 요청 중 오류 발생:", error);
      alert("인코딩 중 오류가 발생했습니다.");
    }
  };

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-[#ffe69c] p-6 rounded-lg relative max-w-4xl w-full h-auto max-h-[80vh]">
        <h1 className="mx-auto text-center rounded-lg text-xl font-bold mb-4 bg-white p-2">
          {image.fileTitle || "파일 제목"}
        </h1>

        <div className="overflow-hidden flex items-center justify-center bg-gray-100 p-10 rounded-lg mb-3">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={image.filePath}
              alt={image.fileTitle}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col m-10">
            {encodingOptions.map((option, idx) => (
              <div key={idx} className="flex items-center mb-4">
                <select
                  value={option.format}
                  onChange={(e) => {
                    const updatedOptions = [...encodingOptions];
                    updatedOptions[idx].format = e.target.value;
                    setEncodingOptions(updatedOptions);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="bmp">BMP</option>
                </select>

                <select
                  value={option.resolution}
                  onChange={(e) => {
                    const updatedOptions = [...encodingOptions];
                    updatedOptions[idx].resolution = e.target.value;
                    setEncodingOptions(updatedOptions);
                  }}
                  className="ml-4 p-2 border border-gray-300 rounded-md"
                >
                  <option value="360p">360p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                </select>

                {/* + 버튼 */}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="ml-4 text-blue-500"
                  style={{ minWidth: '30px', textAlign: 'center' }} 
                >
                  <AiFillPlusCircle size={25} color="#f25165" />
                </button>

                {/* - 버튼 */}
                {encodingOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="ml-2 text-gray-600"
                    style={{ minWidth: '30px', textAlign: 'center' }} 
                  >
                    <AiFillMinusCircle size={25} color="#717273" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="items-center text-center row mx-auto p-2">
          <button
            onClick={handleEncoding}
            className="mr-2 rounded-md bg-[#6dd7e5] p-3 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline-blue-600"
          >
            인코딩
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md bg-[#f48f8f] p-3 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline-red-600"
            >
              취소
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEncoding;
