import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeForm = () => {
    const [device, setDevice] = useState('모바일');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [createdAt] = useState(new Date().toISOString().split('T')[0]); // 현재 날짜를 YYYY-MM-DD 형식으로 설정
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // 공지글 등록 로직을 여기에 추가합니다.
        // 예를 들어, API 호출을 통해 공지글을 서버에 저장할 수 있습니다.
        console.log({
            device,
            title,
            content,
            startDate,
            endDate,
            createdAt
        });
        // 폼 제출 후 페이지 이동 (예: 공지글 목록 페이지로)
        navigate('/notice-board');
    };

    const handleCancel = () => {
        // 취소 버튼 클릭 시 공지글 목록 페이지로 이동
        navigate('/notice-board');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto ">
            <header className="mb-6">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">공지글 작성</h1>
            </header>
            <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                   

                    <div className="flex space-x-2 mb-4 ">

                            <label htmlFor="device" className="block text-sm font-semibold leading-6 text-gray-900">재생장치</label>
                            <select
                                id="device"
                                value={device}
                                onChange={(e) => setDevice(e.target.value)}
                                className="mt-1  block w-1/3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="모바일">모바일</option>
                                <option value="PC">PC</option>
                            </select>
                            <label htmlFor="createdAt" className="block text-sm font-semibold leading-6 text-gray-900">작성일</label>
                            <input
                                id="createdAt"
                                type="text"
                                value={createdAt}
                                readOnly
                                className="mt-1 block w-1/3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold leading-6 text-gray-900">제목</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold leading-6 text-gray-900">내용</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full p-5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                rows="4"
                            />
                        </div>
                        <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white">
                        <div className="flex space-x-2 mb-4">
                            <label htmlFor="startDate" className="block text-sm font-semibold leading-6 text-gray-900">노출 시작일</label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <label htmlFor="endDate" className="block text-sm font-semibold leading-6 text-gray-900">종료일</label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    </div>

                    
                </form>
            </div>
            <div className="flex justify-end gap-4 mt-2">
                        <button
                            type="submit"
                            className="mr-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            등록하기
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            뒤로가기
                        </button>
                    </div>
        </div>
    );
};

export default NoticeForm;
