import React, { useState, useEffect, useMemo } from "react";
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa'; // Font Awesome 아이콘 라이브러리
import { useNavigate } from 'react-router-dom';

const ApiBoard = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('apiName'); // 검색 필터 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPosts, setSelectedPosts] = useState(new Set()); // 체크박스 선택 상태
    const [loading, setLoading] = useState(true); // 데이터 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const postsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/all'); // 포트 번호 8080으로 변경
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

    const handleDeletePosts = async () => {
        try {
            await Promise.all([...selectedPosts].map(id =>
                fetch(`http://localhost:8080/api/posts/${id}`, {
                    method: 'DELETE'
                })
            ));
            setPosts(prevPosts => prevPosts.filter(post => !selectedPosts.has(post.id)));
            setSelectedPosts(new Set()); // 삭제 후 선택된 상태 초기화
        } catch (err) {
            console.error('Error deleting posts:', err);
        }
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
                    <option value="expirationDate">만료일</option>
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
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setSelectedPosts(isChecked 
                                                ? new Set(filteredPosts.map(post => post.id)) 
                                                : new Set());
                                        }}
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
                                            checked={selectedPosts.has(post.id)}
                                            onChange={() => handleCheckboxChange(post.id)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">{post.apiName}</td>
                                    <td className="border border-gray-300 p-2">{post.expirationDate}</td>
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
