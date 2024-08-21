import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NOTICE_BOARD, NOTICE_FORM } from '../../../constants/page_constant';

const NoticeDetail = () => {
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { noticeId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`/api/notices/${noticeId}`);
                const formattedNotice = formatNoticeDates(response.data);
                setNotice(formattedNotice);
            } catch (err) {
                setError('공지사항 정보를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotice();
    }, [noticeId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatNoticeDates = (notice) => {
        return {
            ...notice,
            regTime: formatDate(notice.regTime),
            startDate: formatDate(notice.startDate),
            endDate: formatDate(notice.endDate),
        };
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    if (!notice) {
        return <p>공지사항이 존재하지 않습니다.</p>;
    }

    const handleDelete = async () => {
        if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/notices/${noticeId}`);
                navigate(NOTICE_BOARD);
            } catch (err) {
                setError('공지사항 삭제에 실패했습니다.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`${NOTICE_FORM}/${noticeId}`);
    };

    const handleCancel = () => {
        navigate(NOTICE_BOARD);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">공지사항 상세</h1>
            </header>
            <div className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c]">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1 flex items-center">
                                <label
                                    htmlFor="device_id"
                                    className="text-sm font-semibold leading-6 text-gray-900 bg-[#fcc310] rounded-md text-center w-1/3 h-full flex items-center justify-center"
                                >
                                    재생장치
                                </label>
                                <input
                                    id="device_id"
                                    type="text"
                                    value={notice.deviceIds ? notice.deviceIds.join(', ') : ''}
                                    readOnly
                                    className="ml-0 flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                                />
                            </div>
                            <div className="flex-1 flex items-center">
                                <label
                                    htmlFor="regTime"
                                    className="text-sm font-semibold leading-6 text-gray-900 bg-[#fcc310] rounded-md text-center w-1/3 h-full flex items-center justify-center"
                                >
                                    작성일
                                </label>
                                <input
                                    id="regTime"
                                    type="text"
                                    value={notice.regTime}
                                    readOnly
                                    className="ml-0 flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="title"></label>
                            <input
                                id="title"
                                type="text"
                                value={notice.title}
                                readOnly
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="content"></label>
                            <textarea
                                id="content"
                                value={notice.content}
                                readOnly
                                className="mt-1 block w-full p-5 border border-gray-300 rounded-md shadow-sm bg-white whitespace-pre-line"
                                rows="4"
                            />
                        </div>
                        <div className="rounded-lg p-2 shadow-sm bg-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1 flex items-center">
                                    <label htmlFor="startDate" className="w-2/4 block text-sm font-semibold leading-6 text-gray-900">노출 시작일</label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        value={notice.startDate}
                                        readOnly
                                        className="ml-0 block w-full border border-gray-300 rounded-md shadow-sm bg-white"
                                    />
                                </div>
                                <span className="text-lg font-semibold">~</span>
                                <div className="flex-1 flex items-center">
                                    <label htmlFor="endDate" className="w-1/4 block text-sm font-semibold leading-6 text-gray-900">종료일</label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        value={notice.endDate}
                                        readOnly
                                        className="ml-0 block w-full border border-gray-300 rounded-md shadow-sm bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-4 mt-2">
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-md bg-[#ffc107] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#f9a301] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9a301]"
                            >
                                뒤로가기
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                수정하기
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeDetail;
