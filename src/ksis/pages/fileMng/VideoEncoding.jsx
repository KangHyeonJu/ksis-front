import React, { useState, useEffect } from "react";
import {
  ENCODING_RESOURCE_FILE,
  ENCODED_VIDEO,
} from "../../../constants/api_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";

const VideoEncoding = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [encodingOptions, setEncodingOptions] = useState([
    { format: "mp4", resolution: "360p" },
  ]);

  const fetchImageData = async (originalResourceId) => {
    try {
      const response = await fetcher.get(
        `${ENCODING_RESOURCE_FILE}/${originalResourceId}`
      );
      setVideo(response.data);
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
      { format: "mp4", resolution: "360p" },
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
          fileTitle: video.fileTitle,
          filePath: video.filePath,
          fileRegTime: video.regTime,
          format: option.format,
          resolution: option.resolution,
        };
        console.log("리퀘스트 데이터 : ", requestData);
        console.log("오리지널 리소스 아이디 : ", params.originalResourceId);
        const response = await fetcher.post(
          `${ENCODED_VIDEO}/${params.originalResourceId}`,
          requestData
        );
        navigate();
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

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center p-6">
      <div className="bg-[#ffe69c] p-6 rounded-lg relative">
        <h1 className="mx-auto text-center rounded-lg text-xl font-bold mb-4 bg-white">
          {video.fileTitle || "파일 제목"}
        </h1>

        <div className="overflow-hidden flex items-center justify-center bg-gray-100 p-10 rounded-lg">
          <div className="w-full h-auto flex items-center justify-center">
            <video
              src={video.filePath}
              alt={video.fileTitle}
              className="object-contain max-w-full max-h-full p-10"
              controls
            />
          </div>

          <div className="flex flex-col">
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
                  <option value="mp4">MP4</option>
                  <option value="mov">MOV</option>
                  <option value="avi">AVI</option>
                  <option value="mkv">MKV</option>
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

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="ml-4 text-blue-500"
                >
                  <AiFillPlusCircle size={25} color="#f25165" />
                </button>

                {encodingOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="ml-2 text-gray-600"
                  >
                    <AiFillMinusCircle size={25} color="#717273" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 bottom-2 flex justify-end">
          <button
            onClick={handleEncoding}
            className="mr-2 rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline-blue-600"
          >
            인코딩
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline-red-600"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEncoding;
