import React, { useState, useMemo } from "react";
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa'; // Font Awesome 아이콘 라이브러리
import { useNavigate } from 'react-router-dom'; // 추가

const ApiBoard = () => {
    const [posts, setPosts] = useState([
        { id: 1, apiName: "weather-forecast-api", expirationDate: "2024-12-31", provider: "현주컴퍼니" },
        { id: 2, apiName: "geo-location-service", expirationDate: "2025-07-15", provider: "재혁컴퍼니" },
        { id: 3, apiName: "translation-engine-api", expirationDate: "2025-08-09", provider: "민규컴퍼니" },
        { id: 4, apiName: "stock-market-data", expirationDate: "2025-09-05", provider: "지원컴퍼니" },
        { id: 5, apiName: "weather-forecast-api", expirationDate: "2024-12-31", provider: "현주컴퍼니" },
        { id: 6, apiName: "geo-location-service", expirationDate: "2025-07-15", provider: "재혁컴퍼니" },
        { id: 7, apiName: "translation-engine-api", expirationDate: "2025-08-09", provider: "민규컴퍼니" },
        { id: 8, apiName: "stock-market-data", expirationDate: "2025-09-05", provider: "지원컴퍼니" },
        // 예제 데이터 추가
    ]);
    const [newPost, setNewPost] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('apiName'); // 검색 필터 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPosts, setSelectedPosts] = useState(new Set()); // 체크박스 선택 상태

    const postsPerPage = 5;
    const navigate = useNavigate(); // 추가

    const handleAddPost = () => {
        if (newPost.trim() === '') return;
        // 데이터 추가 로직
        const newPostObj = {
            id: posts.length + 1,
            apiName: newPost,
            expirationDate: "2024-12-31", // 예제 날짜
            provider: "업체 C" // 예제 제공업체
        };
        setPosts([...posts, newPostObj]);
        setNewPost('');
    };

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

    const handleDeletePosts = () => {
        setPosts(prevPosts => prevPosts.filter(post => !selectedPosts.has(post.id)));
        setSelectedPosts(new Set()); // 삭제 후 선택된 상태 초기화
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
                    onClick={() => navigate('/apiDetail')} // 수정된 부분
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    API 등록
                </button>
                
                <button 
                    onClick={handleDeletePosts} // 수정된 부분
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
