import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApiDetail = () => {
    const [apiName, setApiName] = useState('');
    const [provider, setProvider] = useState('');
    const [keyValue, setKeyValue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [purpose, setPurpose] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiData = {
            apiName,
            provider,
            keyValue,
            expiryDate: new Date(expiryDate).toISOString(), // ISO 8601 형식으로 변환
            purpose,
        };

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            });

            if (response.ok) {
                alert('API 등록 성공');
                navigate('/apiBoard'); // 성공 시 ApiBoard로 이동
            } else {
                const errorData = await response.json(); // 서버에서 반환한 에러 메시지 확인
                alert(`API 등록 실패: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('API 등록 중 오류 발생');
        }
    };

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">API 정보 등록</h1>
            </header>
            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">API 이름</label>
                    <input
                        type="text"
                        value={apiName}
                        onChange={(e) => setApiName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">제공업체</label>
                    <input
                        type="text"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">API Key</label>
                    <input
                        type="text"
                        value={keyValue}
                        onChange={(e) => setKeyValue(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">만료일</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">사용 목적</label>
                    <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        등록하기
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        뒤로가기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApiDetail;
