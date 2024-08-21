import React, { useState, useEffect, useMemo } from "react";
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BOARD, API_FORM } from "../../../constants/page_constant";

const ApiBoard = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('apiName');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPosts, setSelectedPosts] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const postsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/all');
                if (!response.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                const data = await response.json();
                console.log('Fetched data:', data); // 데이터 확인
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleCheckboxChange = (postId, event) => {
        event.stopPropagation(); // 체크박스 클릭 시 테이블 행 클릭 이벤트 전파 차단
        setSelectedPosts(prevSelectedPosts => {
            const newSelectedPosts = new Set(prevSelectedPosts);
            if (newSelectedPosts.has(postId)) {
                newSelectedPosts.delete(postId);
            } else {
                newSelectedPosts.add(postId);
            }
            return newSelectedPosts;
        });
    };

    const handleSelectAllChange = (e) => {
        const isChecked = e.target.checked;
        setSelectedPosts(isChecked ? new Set(paginatedPosts.map(post => post.apiId)) : new Set());
    };

    const handleDeletePosts = async () => {
        if (selectedPosts.size === 0) {
            alert('삭제할 게시글을 선택해주세요.');
            return;
        }
        try {
            console.log('Selected posts before delete:', [...selectedPosts]);
            const deletePromises = [...selectedPosts].map(id =>
                fetch(`http://localhost:8080/api/posts/${id}`, {
                    method: 'DELETE'
                })
            );
            await Promise.all(deletePromises);

            // 성공적으로 삭제된 후 UI 업데이트
            setPosts(prevPosts => prevPosts.filter(post => !selectedPosts.has(post.apiId)));
            setSelectedPosts(new Set());
            alert('선택된 게시글이 삭제되었습니다.'); // 삭제 완료 알림
            navigate({API_BOARD}); // 게시글 삭제 후 보드로 이동
        } catch (err) {
            console.error('Error deleting posts:', err);
            setError('게시글 삭제 중 오류가 발생했습니다.');
            alert('게시글 삭제 중 오류가 발생했습니다.'); // 오류 알림
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.substring(0, 10); // '2024-08-07' 형식으로 반환
    };

    const filteredPosts = useMemo(() => 
        posts.filter(post => {
            const value = post[searchCategory]?.toLowerCase() || '';
            return value.includes(searchTerm.toLowerCase());
        }),
        [posts, searchTerm, searchCategory]
    );

    const paginatedPosts = useMemo(() => {
        const startIndex = currentPage * postsPerPage;
        return filteredPosts.slice(startIndex, startIndex + postsPerPage);
    }, [filteredPosts, currentPage]);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Handle navigation to the API form when API name is clicked
    const handleApiNameClick = (apiId) => {
        navigate(`${API_FORM}/${apiId}`);
    };

    // Determine if all posts in the current page are selected
    const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every(post => selectedPosts.has(post.apiId));

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">API 목록</h1>
            </header>
            <div className="mb-6 flex items-center">
                {/* 검색바 셀렉트 박스 */}
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="mr-4 p-2 border border-gray-300 rounded-md"
                >
                    <option value="apiName">API 이름</option>
                    <option value="expiryDate">만료일</option>
                    <option value="provider">제공업체</option>
                </select>
                {/* 검색바 입력창 */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="flex justify-end space-x-2 mb-4">
                {/* 등록 버튼 */}
                <button 
                    onClick={() => navigate('/apiform')} // API 등록 페이지로 이동
                    className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                    API 등록
                </button>
                {/* 삭제 버튼 */}
                <button 
                    onClick={handleDeletePosts} // 선택된 API 삭제
                    className="relative inline-flex items-center rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    삭제
                </button>
            </div>

            {/* 조회 테이블 */}
            <div>
                {filteredPosts.length === 0 ? (
                    <p>등록된 API가 없습니다.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                <th className="border border-gray-300 p-2">API 이름</th>
                                <th className="border border-gray-300 p-2">만료일</th>
                                <th className="border border-gray-300 p-2">제공업체</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPosts.map((post) => (
                                <tr key={post.apiId}>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.has(post.apiId)}
                                            onChange={(e) => handleCheckboxChange(post.apiId, e)}
                                        />
                                    </td>
                                    <td
                                        className="border border-gray-300 p-2 text-black cursor-pointer"
                                        onClick={() => handleApiNameClick(post.apiId)}
                                    >
                                        {post.apiName}
                                    </td>
                                    <td className="border border-gray-300 p-2">{formatDate(post.expiryDate)}</td>
                                    <td className="border border-gray-300 p-2">{post.provider}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 페이지네이션 */}
            {filteredPosts.length > postsPerPage && (
                <ReactPaginate
                    previousLabel={"이전"}
                    nextLabel={"다음"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={"flex justify-center mt-4"}
                    pageClassName={"mx-1"}
                    pageLinkClassName={"px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"}
                    previousClassName={"mx-1"}
                    previousLinkClassName={"px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"}
                    nextClassName={"mx-1"}
                    nextLinkClassName={"px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"}
                    breakClassName={"mx-1"}
                    breakLinkClassName={"px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"}
                    activeClassName={"bg-blue-500 text-white"}
                />
            )}
        </div>
    );
};

export default ApiBoard;