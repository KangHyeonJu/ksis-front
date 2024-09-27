import React, { useState, useEffect } from "react";
import { FILE_SIZE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher"; // fetcher import

const FileSizeBoard = () => {
  const [imageMaxSize, setImageMaxSize] = useState(10); // 기본값 설정
  const [videoMaxSize, setVideoMaxSize] = useState(500); // 기본값 설정
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태

  // 파일 크기 설정을 API에서 가져오는 함수
  const fetchFileSize = async () => {
    try {
      const response = await fetcher.get(FILE_SIZE); // GET 요청을 통해 데이터 조회
      if (response.status === 200) {
        const { imageMaxSize, videoMaxSize } = response.data;
        setImageMaxSize(imageMaxSize); // 이미지 최대 크기 설정
        setVideoMaxSize(videoMaxSize); // 비디오 최대 크기 설정
      } else {
        alert("파일 크기 설정값을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("Error fetching file sizes:", error);
      alert("파일 크기 설정을 가져오는 중 오류 발생");
    } finally {
      setLoading(false); // 데이터 로딩 상태 해제
    }
  };

  // 컴포넌트가 마운트될 때 파일 크기 설정을 불러옴
  useEffect(() => {
    fetchFileSize();
  }, []);

  const handleSave = async () => {
    const fileSizeData = { imageMaxSize, videoMaxSize, fileSizeId: 1 };

    try {
      const response = await fetcher.put(FILE_SIZE, fileSizeData); // fetcher를 사용한 PUT 요청

      if (response.status === 200 || response.status === 201) {
        alert("설정이 저장되었습니다.");
      } else {
        alert("설정 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating file sizes:", error);
      alert("설정 저장 중 오류 발생");
    }
  };

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
          최대 용량 설정
        </h1>
      </header>
      <table className="w-full border-collapse border border-gray-900">
        <tbody>
          <tr>
            <th className="border border-gray-300 p-2 text-gray-500 text-left bg-[#ffc97e]">
              이미지 제한 크기
            </th>
            <td className="border border-gray-300 p-2 items-center">
              <div>
                <input
                  type="number"
                  className="border border-gray-300 p-1 rounded-md w-20 text-right"
                  value={imageMaxSize}
                  onChange={(e) => setImageMaxSize(e.target.value)}
                  min="0"
                />
                <span className="ml-2">MB</span>
              </div>
              <p className="text-gray-500">
                하나의 이미지에 대해 최대 용량을 지정할 수 있습니다.
              </p>
            </td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 text-gray-500 text-left background bg-[#ffc97e]">
              영상 제한 크기
            </th>
            <td className="border border-gray-300 p-2 items-center bg-[#ffe8cc]">
              <input
                type="number"
                className="border border-gray-300 p-1 rounded-md w-20 text-right"
                value={videoMaxSize}
                onChange={(e) => setVideoMaxSize(e.target.value)}
                min="0"
              />
              <span className="ml-2">MB</span>
              <p className="text-gray-500">
                하나의 영상에 대해 최대 용량을 지정할 수 있습니다.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default FileSizeBoard;
