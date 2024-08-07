import React from "react";

const FileSizeBoard = () => {
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
                                defaultValue="10" // 기본값을 설정할 수 있습니다
                                min="0" // 최소값 설정
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
                                defaultValue="100" // 기본값을 설정할 수 있습니다
                                min="0" // 최소값 설정
                            />
                            <span className="ml-2">MB</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default FileSizeBoard;
