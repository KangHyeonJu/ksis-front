import React, { useState, useEffect } from 'react';

const FileSizeBoard = () => {
    const [imageMaxSize, setImageMaxSize] = useState(10); // 기본값 설정
    const [videoMaxSize, setVideoMaxSize] = useState(50); // 기본값 설정

    useEffect(() => {
        // API 호출하여 초기값 설정
        const fetchFileSize = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/filesize');
                const data = await response.json();
                setImageMaxSize(data.imageMaxSize ?? 10); // 데이터가 없으면 기본값 사용
                setVideoMaxSize(data.videoMaxSize ?? 50); // 데이터가 없으면 기본값 사용
            } catch (error) {
                console.error('Error fetching file sizes:', error);
            }
        };
        fetchFileSize();
    }, []);

    const handleSave = async () => {
        const fileSizeData = { imageMaxSize, videoMaxSize, fileSizeId: 1 };

        try {
            const response = await fetch('http://localhost:8080/api/filesize', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fileSizeData),
            });

            if (response.ok) {
                alert('설정이 저장되었습니다.');
            } else {
                alert('설정 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating file sizes:', error);
            alert('설정 저장 중 오류 발생');
        }
    };

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">최대 용량 설정</h1>
            </header>
            <table className="w-full border-collapse border border-gray-200">
                <tbody>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">이미지 제한 크기</th>
                        <td className="border border-gray-300 p-2 flex items-center">
                            <input
                                type="number"
                                className="border border-gray-300 p-1 rounded-md w-20 text-right"
                                value={imageMaxSize}
                                onChange={(e) => setImageMaxSize(e.target.value)}
                                min="0"
                            />
                            <span className="ml-2">MB</span>
                        </td>
                    </tr>
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">영상 제한 크기</th>
                        <td className="border border-gray-300 p-2 flex items-center">
                            <input
                                type="number"
                                className="border border-gray-300 p-1 rounded-md w-20 text-right"
                                value={videoMaxSize}
                                onChange={(e) => setVideoMaxSize(e.target.value)}
                                min="0"
                            />
                            <span className="ml-2">MB</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                저장
            </button>
        </div>
    );
};

export default FileSizeBoard;