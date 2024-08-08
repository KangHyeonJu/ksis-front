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
                        {apiId ? '수정하기' : '등록하기'}
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

export default ApiForm;
