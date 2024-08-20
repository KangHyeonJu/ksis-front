import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NOTICE_BOARD } from '../../../constants/page_constant';

const NoticeForm = () => {
    const { noticeId } = useParams(); // URL에서 noticeId를 가져옵니다.
    const [formMode, setFormMode] = useState('create'); // 기본 모드를 'create'로 설정
    const [notice, setNotice] = useState({
        title: '',
        content: '',
        deviceIds: [],
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (noticeId) {
            // noticeId가 존재하면 수정 모드로 전환
            setFormMode('edit');
            const fetchNotice = async () => {
                try {
                    const response = await axios.get(`/api/notices/${noticeId}`);
                    setNotice(response.data);
                } catch (err) {
                    setError('공지사항 정보를 가져오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };

            fetchNotice();
        } else {
            // noticeId가 없으면 등록 모드로 설정하고 로딩 완료
            setFormMode('create');
            setLoading(false);
        }
    }, [noticeId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (formMode === 'create') {
                // 등록 모드일 때
                await axios.post('/api/notices', notice);
            } else {
                // 수정 모드일 때
                await axios.put(`/api/notices/${noticeId}`, notice);
            }
            navigate(NOTICE_BOARD);
        } catch (err) {
            setError(formMode === 'create' ? '공지사항 등록에 실패했습니다.' : '공지사항 수정에 실패했습니다.');
        }
    };

    const handleChange = (e) => {
        setNotice({
            ...notice,
            [e.target.id]: e.target.value,
        });
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 my-4">
                    {formMode === 'create' ? '공지사항 등록' : '공지사항 수정'}
                </h1>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="title">제목</label>
                        <input
                            id="title"
                            type="text"
                            value={notice.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            value={notice.content}
                            onChange={handleChange}
                            className="mt-1 block w-full p-5 border border-gray-300 rounded-md shadow-sm bg-white"
                            rows="4"
                        />
                    </div>
                    {/* 기타 입력 필드들... */}
                </div>
                <div className="flex justify-end gap-4 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(NOTICE_BOARD)}
                        className="rounded-md bg-[#ffc107] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#f9a301]"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400"
                    >
                        {formMode === 'create' ? '등록하기' : '수정하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeForm;
