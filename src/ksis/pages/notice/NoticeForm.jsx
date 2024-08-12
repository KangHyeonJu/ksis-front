import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NOTICE_BOARD } from '../../../constants/page_constant';

const NoticeForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [accountId, setAccountId] = useState(''); // 예시 값: 실제로는 로그인된 사용자의 ID를 사용
    const [deviceId, setDeviceId] = useState(''); // 필요에 따라 설정
    const [deviceName, setDeviceName] = useState(''); // 필요에 따라 설정
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // 유효성 검사
        if (!title.trim() || !content.trim() || !startDate || !endDate) {
            alert('제목, 내용, 노출 시작일, 종료일 모두 입력해야 합니다.');
            return;
        }
    
        try {
            const noticeData = {
                title,
                content,
                startDate,
                endDate,
                accountId: accountId || 'JW',
                deviceId: deviceId || '1', // 임의 값 설정
                deviceName: deviceName || 'jw-123' // 임의 값 설정
            };
    
            const response = await axios.post('/api/notices', noticeData);
    
            if (response.status === 200 || response.status === 201) {
                navigate(NOTICE_BOARD);
            } else {
                alert('공지글 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('공지글 등록 중 오류 발생:', error);
            alert('공지글 등록 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate(NOTICE_BOARD); // 공지글 목록 페이지로 이동
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">공지글 작성</h1>
            </header>
            <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
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
                            {/* 필요한 경우, 디바이스 관련 입력 필드를 추가할 수 있습니다. */}
                        </div>
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
                </form>
            </div>
        </div>
    );
};

export default NoticeForm;
