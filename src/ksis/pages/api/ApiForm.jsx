import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ApiForm = () => {
    const [apiName, setApiName] = useState('');
    const [provider, setProvider] = useState('');
    const [keyValue, setKeyValue] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [purpose, setPurpose] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { apiId } = useParams(); // apiId를 URL에서 가져오기

    useEffect(() => {
        if (apiId) {
            const fetchApiData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/posts/${apiId}`);
                    if (!response.ok) throw new Error('네트워크 응답이 올바르지 않습니다.');
                    const data = await response.json();
                    setApiName(data.apiName);
                    setProvider(data.provider);
                    setKeyValue(data.keyValue);
                    setExpiryDate(data.expiryDate.substring(0, 10)); // 날짜 형식 조정
                    setPurpose(data.purpose);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchApiData();
        } else {
            setLoading(false); // 새로운 API 등록의 경우 로딩 완료
        }
    }, [apiId]);

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
            const response = await fetch(`http://localhost:8080/api/${apiId ? 'update/' + apiId : 'register'}`, {
                method: apiId ? 'PUT' : 'POST', // PUT 요청 시 수정, POST 요청 시 등록
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            });

            if (response.ok) {
                alert('API 정보가 성공적으로 저장되었습니다.');
                navigate('/apiBoard'); // 성공 시 ApiBoard로 이동
            } else {
                const errorData = await response.json();
                alert(`저장 실패: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('정보 저장 중 오류 발생');
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">{apiId ? 'API 수정' : 'API 등록'}</h1>
            </header>
            <form onSubmit={handleSubmit} className="border p-4 rounded">
            <div className="mb-4">
            <label className="block text-lg font-semibold leading-6 text-gray-900">API 이름</label>
            <input
                type="text"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                className="bg-[#ffe69c] block w-4/5 mx-auto rounded-full border-1 border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-lg font-semibold leading-6 text-gray-900">제공업체</label>
            <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-[#ffe69c] block w-4/5 mx-auto rounded-full border-1 border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-lg font-semibold leading-6 text-gray-900">API Key</label>
            <input
                type="text"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className="bg-[#ffe69c] block w-4/5 mx-auto rounded-full border-1 border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-lg font-semibold leading-6 text-gray-900">만료일</label>
            <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-[#ffe69c] block w-4/5 mx-auto rounded-full border-1 border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block text-lg font-semibold leading-6 text-gray-900">사용 목적</label>
            <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="bg-[#ffe69c] block w-4/5 mx-auto rounded-full border-1 border-gray-300 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500"
                required
            />
        </div>
                <div className="flex justify-end space-x-2 mb-4">
                    <button
                        type="submit"
                        className="mr-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        {apiId ? '수정하기' : '등록하기'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        뒤로가기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApiForm;
