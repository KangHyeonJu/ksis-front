import React, { useState, useEffect } from "react";
import {
  ENCODING_RESOURCE_FILE,
  ENCODED_VIDEO,
  RESOLUTION,
} from "../../../constants/api_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";

const VideoEncoding = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [resolutions, setResolution] = useState([]);
  const [encodingOptions, setEncodingOptions] = useState([
    { format: "mp4", resolution: "" },
  ]);

  const fetchImageData = async (originalResourceId) => {
    try {
      const response = await fetcher.get(
        `${ENCODING_RESOURCE_FILE}/${originalResourceId}`
      );
      setVideo(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const fetchResolutionData = async () => {
    try {
      const responseResolution = await fetcher.get(RESOLUTION);
      setResolution(responseResolution.data);

      // 처음 옵션 추가 시 기본 해상도 설정
      setEncodingOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          resolution: `${responseResolution.data[0].width}x${responseResolution.data[0].height}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching resolution:", error);
    }
  };

  useEffect(() => {
    fetchImageData(params.originalResourceId);
    fetchResolutionData();
  }, [params.originalResourceId]);

  const handleAddOption = () => {
    setEncodingOptions([
      ...encodingOptions,
      { format: "mp4", resolution: `${resolutions[0]?.width}x${resolutions[0]?.height}` }, // 새로운 옵션에 기본 해상도 추가
    ]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = encodingOptions.filter((_, i) => i !== index);
    setEncodingOptions(updatedOptions);
  };

  const handleCancel = () => {
    navigate(-1);
  };


  //post
  const handleEncoding = async () => {
     // 인코딩 시작 전 확인 창
     const confirmEncoding = window.confirm("정말 인코딩을 시작하겠습니까?");
        
     if (!confirmEncoding) {
       return; // 사용자가 취소하면 함수 종료
     }
     try {
      let allSuccessful = true; // 인코딩 성공 여부 추적

      for (const option of encodingOptions) {

        // 해상도가 없을 경우 기본 해상도 설정
        const resolutionToUse = option.resolution || `${resolutions[0].width}x${resolutions[0].height}`;

        const requestData = {
          originalResourceId: video.originalResourceId,
          fileTitle: video.fileTitle,
          filePath: video.filePath,
          fileRegTime: video.regTime,
          format: option.format,
          resolution:resolutionToUse,
        };
        const response = await fetcher.post(
          `${ENCODED_VIDEO}/${params.originalResourceId}`,
          requestData
        );
        navigate();
        if (response.status !== 200) {
          allSuccessful = false; // 실패한 요청이 있을 경우 false로 변경
        }

        if (response.status === 202) {
          alert("동일한 해상도와 포멧이 존재합니다.");
          return;
         }
      }
      alert("인코딩을 시작했습니다.");
      navigate(-1);
  
      // 모든 요청이 끝난 후에 알림 한 번만 띄우기
      if (allSuccessful) {
      } else {
        alert("일부 인코딩 요청에 실패했습니다.");
      }
  
      // 모든 요청이 끝난 후에 알림 한 번만 띄우기
      if (allSuccessful) {
        alert("인코딩을 시작했습니다.");
        navigate(-1);
      } else {
        alert("일부 인코딩 요청에 실패했습니다.");
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
      <div className="bg-[#ffe69c] p-6 rounded-lg relative max-w-4xl w-full h-auto max-h-[80vh]">
        <h1 className="mx-auto text-center rounded-lg text-xl font-bold mb-4 bg-white p-2">
          {video.fileTitle || "파일 제목"}
        </h1>

        <div className="overflow-hidden flex items-center justify-center bg-gray-100 p-10 rounded-lg">
          <div className="w-full h-full flex items-center justify-center">
            <video
              src={video.filePath}
              alt={video.fileTitle}
              className="object-contain w-full h-full"
              controls
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
                  {resolutions.map((resolution) => (
                    <option
                      value={`${resolution.width}x${resolution.height}`}
                      key={resolution.resolutionId}
                    >
                      {resolution.width} x {resolution.height}
                    </option>
                  ))}
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
