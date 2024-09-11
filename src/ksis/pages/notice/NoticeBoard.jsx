import React, { useState, useEffect, useMemo } from 'react';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import fetcher from "../../../fetcher";
import { NOTICE_FORM, NOTICE_DTL } from '../../../constants/page_constant';
import { NOTICE_ALL } from '../../../constants/api_constant';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const noticesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetcher.get(NOTICE_ALL)
            .then(response => {
                setNotices(response.data);
                console.log("공지 전체 조회 데이터 : " , response.data );
            })
            .catch(err => {
                setError('데이터를 가져오는 데 실패했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredNotices = useMemo(() =>
        notices.filter(notice =>
            notice.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [notices, searchTerm]
    );

    const paginatedNotices = useMemo(() => {
        const startIndex = currentPage * noticesPerPage;
        return filteredNotices.slice(startIndex, startIndex + noticesPerPage);
    }, [filteredNotices, currentPage]);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRegisterClick = () => {
        navigate(NOTICE_FORM); // 공지글 등록 페이지로 이동
    };

    const handleNoticeClick = (id) => {
        navigate(`${NOTICE_DTL}/${id}`); // 특정 공지사항 상세 페이지로 이동
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
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">공지글 관리</h1>
            </header>
            <div className="mb-6 flex items-center">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="검색..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleRegisterClick}
                    className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                    공지글 등록
                </button>
            </div>
            <div>
                {filteredNotices.length === 0 ? (
                    <p className="text-center text-gray-600 mt-10 w-full">공지글이 없습니다.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">작성일</th>
                                <th className="border border-gray-300 p-2">작성자</th>
                                <th className="border border-gray-300 p-2">제목</th>
                                <th className="border border-gray-300 p-2">재생장치</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNotices.map((notice) => (
                                <tr key={notice.noticeId} onClick={() => handleNoticeClick(notice.noticeId)} className="cursor-pointer">
                                    {/* 작성일은 YYYY-MM-DD 형식으로 포맷팅 */}
                                    <td className="border border-gray-300 p-2">{new Date(notice.regTime).toISOString().split('T')[0]}</td>
                                    {/* 작성자 이름과 아이디를 함께 표시 */}
                                    <td className="border border-gray-300 p-2">{notice.name} ({notice.accountId})</td>
                                    <td className="border border-gray-300 p-2">{notice.title}</td>
                                    <td className="border border-gray-300 p-2">{notice.deviceName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {filteredNotices.length > noticesPerPage && (
                <ReactPaginate
                    previousLabel={"이전"}
                    nextLabel={"다음"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filteredNotices.length / noticesPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="flex justify-center mt-4 space-x-1"
                    pageClassName="mx-1"
                    pageLinkClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                    previousClassName="mx-1"
                    previousLinkClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                    nextClassName="mx-1"
                    nextLinkClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                    breakClassName="mx-1"
                    breakLinkClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                    activeClassName="bg-blue-500 text-white"
                />
            )}
        </div>
    );
};

export default NoticeBoard;