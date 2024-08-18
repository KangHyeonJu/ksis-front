import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NOTICE_BOARD } from '../../../constants/page_constant'; // 공지글 목록 페이지 경로
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'; // 아이콘 임포트

const NoticeForm = () => {
    // 상태 변수 선언
    const [title, setTitle] = useState(''); // 제목
    const [content, setContent] = useState(''); // 내용
    const [startDate, setStartDate] = useState(''); // 노출 시작일
    const [endDate, setEndDate] = useState(''); // 노출 종료일
    const [deviceIds, setDeviceIds] = useState(['']); // 재생장치 목록
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 재생장치 목록 예시 (실제 데이터는 API 또는 다른 방법으로 받아올 수 있음)
    const deviceOptions = [
        { value: 'device1', label: '디바이스 1' },
        { value: 'device2', label: '디바이스 2' },
        { value: 'device3', label: '디바이스 3' },
    ];

    // 폼 제출 처리 함수
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!title.trim() || !content.trim() || !startDate || !endDate) {
            alert('제목, 내용, 노출 시작일, 종료일을 모두 입력해야 합니다.');
            return;
        }

        // 재생장치 목록 유효성 검사
        if (deviceIds.some(deviceId => !deviceId.trim())) {
            alert('모든 재생장치를 선택해야 합니다.');
            return;
        }

        try {
            // 공지글 데이터 준비
            const noticeData = {
                title,
                content,
                startDate,
                endDate,
                deviceIds: deviceIds.filter(deviceId => deviceId.trim()) // 빈 값 필터링
            };

            // 공지글 등록 요청
            const response = await axios.post('/api/notices', noticeData);

            // 요청 성공 시 공지글 목록 페이지로 이동
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

    // 취소 버튼 클릭 시 처리 함수
    const handleCancel = () => {
        navigate(NOTICE_BOARD); // 공지글 목록 페이지로 이동
    };

    // 재생장치 추가 함수
    const addDevice = () => {
        setDeviceIds((prev) => [
            ...prev,
            ''
        ]);
    };

    // 재생장치 제거 함수
    const removeDevice = (index) => {
        setDeviceIds((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // 재생장치 ID 변경 함수
    const handleDeviceChange = (index, value) => {
        setDeviceIds((prev) =>
            prev.map((deviceId, i) =>
                i === index ? value : deviceId
            )
        );
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
                            <label htmlFor="title"></label>
                            <input
                                id="title"
                                placeholder='제목을 입력하세요.'
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="content"></label>
                            <textarea
                                id="content"
                                placeholder='내용을 입력하세요.'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full p-5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label htmlFor="deviceId"></label>
                            {deviceIds.map((deviceId, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <select
                                        value={deviceId}
                                        onChange={(e) => handleDeviceChange(index, e.target.value)}
                                        className="mt-1 block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">재생장치를 선택하세요</option>
                                        {deviceOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="ml-2 flex items-center">
                                <button
                                    type="button"
                                    onClick={addDevice}
                                    className="flex items-center text-blue-500"
                                >
                                    <AiFillPlusCircle size={25} color="#f25165" />
                                    <span className="ml-1"></span>
                                </button>
                            </div>
                                    {deviceIds.length > 1 && (
                                        <div className="ml-2 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => removeDevice(index)}
                                                className="flex items-center"
                                            >
                                                <AiFillMinusCircle size={25} color="#717273" />
                                            </button>
                                        </div>
                                        
                                    )}
                                </div>
                            ))}
                            
                        </div>
                        <div className="rounded-lg p-2 shadow-sm bg-white">
                            <div className="flex items-center space-x-4 mb-4">
                                {/* 노출 시작일 */}
                                <div className="flex-1 flex items-center">
                                    <label htmlFor="startDate" className="w-2/4 block text-sm font-semibold leading-6 text-gray-900">노출 시작일</label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                
                                {/* ~ 기호 */}
                                <span className="text-lg font-semibold">~</span>

                                {/* 종료일 */}
                                <div className="flex-1 flex items-center">
                                    <label htmlFor="endDate" className="w-1/4 block text-sm font-semibold leading-6 text-gray-900">종료일</label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
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
