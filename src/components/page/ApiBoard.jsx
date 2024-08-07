import React, { useState, useEffect, useMemo } from "react";
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ApiBoard = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('apiName');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPostIds, setSelectedPostIds] = useState(new Set());
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
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleCheckboxChange = (postId) => {
        setSelectedPostIds(prevSelectedPostIds => {
            const newSelectedPostIds = new Set(prevSelectedPostIds);
            if (newSelectedPostIds.has(postId)) {
                newSelectedPostIds.delete(postId);
            } else {
                newSelectedPostIds.add(postId);
            }
            return newSelectedPostIds;
        });
    };

    const handleSelectAllChange = (e) => {
        const isChecked = e.target.checked;
        setSelectedPostIds(isChecked ? new Set(paginatedPosts.map(post => post.id)) : new Set());
    };

    const handleDeletePosts = async () => {
        try {
            const deletePromises = [...selectedPostIds].map(id =>
                fetch(`http://localhost:8080/api/posts/${id}`, {
                    method: 'DELETE'
                })
            );
            await Promise.all(deletePromises);
            setPosts(prevPosts => prevPosts.filter(post => !selectedPostIds.has(post.id)));
            setSelectedPostIds(new Set()); // Clear the selection
        } catch (err) {
            console.error('Error deleting posts:', err);
            setError('게시글 삭제 중 오류가 발생했습니다.');
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

    const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every(post => selectedPostIds.has(post.id));

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>오류 발생: {error}</p>;
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">게시판</h1>
            </header>
            <div className="mb-6 flex items-center">
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="mr-4 p-2 border border-gray-300 rounded-md"
                >
                    <option value="apiName">API 이름</option>
                    <option value="expiryDate">만료일</option>
                    <option value="provider">제공업체</option>
                </select>
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
            <div className="mb-6">
                <button 
                    onClick={() => navigate('/apiDetail')} // API 등록 페이지로 이동
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    API 등록
                </button>
                <button 
                    onClick={handleDeletePosts} // 선택된 API 삭제
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    삭제
                </button>
            </div>

            <div>
                {filteredPosts.length === 0 ? (
                    <p>게시글이 없습니다.</p>
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
                                <tr key={post.id}>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedPostIds.has(post.id)}
                                            onChange={() => handleCheckboxChange(post.id)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">{post.apiName}</td>
                                    <td className="border border-gray-300 p-2">{formatDate(post.expiryDate)}</td>
                                    <td className="border border-gray-300 p-2">{post.provider}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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
