// src/components/page/ApiRegistration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가

const ApiRegistration = () => {
    const [apiName, setApiName] = useState('');
    const [provider, setProvider] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [purpose, setPurpose] = useState('');

    const navigate = useNavigate(); // 추가

    const handleSubmit = (e) => {
        e.preventDefault();
        // 폼 제출 로직을 여기에 추가
        console.log({
            apiName,
            provider,
            apiKey,
            expirationDate,
            purpose
        });
        // 폼 제출 후 API 목록 페이지로 돌아가기
        navigate('/apiBoard');
    };

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">API 정보 등록</h1>
            </header>
            <div className="border border-gray-300 p-6 rounded-md shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="apiName">API 이름</label>
                        <input
                            type="text"
                            id="apiName"
                            value={apiName}
                            onChange={(e) => setApiName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="provider">API 제공업체</label>
                        <input
                            type="text"
                            id="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="apiKey">API Key</label>
                        <input
                            type="text"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="expirationDate">만료일</label>
                        <input
                            type="date"
                            id="expirationDate"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="purpose">사용목적</label>
                        <textarea
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            등록하기
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/apiBoard')}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            뒤로가기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApiRegistration;
