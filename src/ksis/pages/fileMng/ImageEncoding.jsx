import React, { useState, useEffect } from "react";
import {
  ENCODING_RESOURCE_FILE,
  ENCODED_IMG,
  RESOLUTION,
} from "../../../constants/api_constant";
import { IMAGE_RESOURCE_BOARD } from "../../../constants/page_constant";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";
import { decodeJwt } from "../../../decodeJwt";
import Loading from "../../components/Loading";

const ImageEncoding = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [resolutions, setResolution] = useState([]);
  const [encodingOptions, setEncodingOptions] = useState([
    { format: "png", resolution: "" },
  ]);
  const accountId = decodeJwt().accountId;

  const fetchImageData = async (originalResourceId) => {
    try {
      const response = await fetcher.get(
        `${ENCODING_RESOURCE_FILE}/${originalResourceId}`
      );
      setImage(response.data);

      if (
        decodeJwt.roles !== "ROLE_ADMIN" &&
        !response.data.accountList.some(
          (i) => i.accountId === decodeJwt.accountId
        )
      ) {
        alert("접근권한이 없습니다.");
        navigate(IMAGE_RESOURCE_BOARD);
      }
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
      {
        format: "png",
        resolution: `${resolutions[0]?.width}x${resolutions[0]?.height}`,
      }, // 새로운 옵션에 기본 해상도 추가
    ]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = encodingOptions.filter((_, i) => i !== index);
    setEncodingOptions(updatedOptions);
  };

  const handleCancel = () => {
    navigate(IMAGE_RESOURCE_BOARD);
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
        const resolutionToUse =
          option.resolution ||
          `${resolutions[0].width}x${resolutions[0].height}`;

        const requestData = {
          originalResourceId: image.originalResourceId,
          accountId: accountId,
          fileTitle: image.fileTitle,
          filePath: image.filePath,
          fileRegTime: image.regTime,
          format: option.format,
          resolution: resolutionToUse,
        };
        const response = await fetcher.post(
          `${ENCODED_IMG}/${params.originalResourceId}`,

          requestData
        );

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
    } catch (error) {
      // 서버에서 반환된 에러 메시지를 확인하고 alert 창 띄우기
      console.error("인코딩 요청 중 오류 발생:", error);
      alert(`${error.response?.data || error.message}`);
    }
  };

  if (!image) {
    return <Loading />;
  }

  return (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="shadow-sm ring-4 ring-gray-900/5 text-center p-6 bg-white rounded-lg max-w-4xl w-full">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          {image.fileTitle || "파일 제목"}
        </h1>

        <div className="overflow-hidden flex items-center justify-center bg-white p-10 rounded-lg mb-3">
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
                  {resolutions.map((resolution) => (
                    <option
                      value={`${resolution.width}x${resolution.height}`}
                      key={resolution.resolutionId}
                    >
                      {resolution.width} x {resolution.height}
                    </option>
                  ))}
                </select>

                {/* + 버튼 */}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="ml-4 text-blue-500"
                  style={{ minWidth: "30px", textAlign: "center" }}
                >
                  <AiFillPlusCircle size={25} color="#f25165" />
                </button>

                {/* - 버튼 */}
                {encodingOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="ml-2 text-gray-600"
                    style={{ minWidth: "30px", textAlign: "center" }}
                  >
                    <AiFillMinusCircle size={25} color="#717273" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="items-center text-center row mx-auto mt-4">
          <button
            onClick={handleEncoding}
            className="mr-4 rounded-md border border-blue-600 bg-white text-blue-600 px-3 py-2 text-sm font-semibold shadow-sm 
           hover:bg-blue-600 hover:text-white hover:shadow-inner hover:shadow-blue-800 focus-visible:outline-blue-600 transition duration-200"
          >
            인코딩
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-red-600 bg-white text-red-600 px-3 py-2 text-sm font-semibold shadow-sm 
            hover:bg-red-600 hover:text-white hover:shadow-inner hover:shadow-red-800 focus-visible:outline-red-600 transition duration-200"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEncoding;
