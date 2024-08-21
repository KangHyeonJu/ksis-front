import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { IMAGE_RESOURCE_BOARD, IMAGE_FILE_BOARD } from '../../../constants/page_constant';

const ImageResourceBoard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('total');
    const [isOriginal, setIsOriginal] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 10;
    const [images, setImages] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const navigate = useNavigate();

    // isOriginal 값에 따라 페이지를 이동
    useEffect(() => {
        navigate(isOriginal ? IMAGE_RESOURCE_BOARD : IMAGE_FILE_BOARD);
    }, [isOriginal, navigate]);

    // 이미지 목록을 가져오는 부분
    useEffect(() => {
        axios.get('/resourceList/images')
            .then(response => {
                setImages(response.data);
                console.log(response.data)  // 이미지 데이터를 설정
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    // 검색어와 카테고리에 따라 이미지 필터링
    useEffect(() => {
        let filtered = images;

        if (searchTerm) {
            if (searchCategory === 'title') {
                filtered = images.filter(image => image.title.includes(searchTerm));
            } else if (searchCategory === 'regDate') {
                filtered = images.filter(image => image.regDate.includes(searchTerm));
            } else {
                filtered = images.filter(image => 
                    image.title.includes(searchTerm) || image.regDate.includes(searchTerm)
                );
            }
        }

        setFilteredPosts(filtered);
    }, [images, searchTerm, searchCategory]);

    // 토글 버튼 핸들러 함수 추가
    const handleToggle = () => {
        setIsOriginal(prevIsOriginal => !prevIsOriginal);
    };

    // 페이지 변경 핸들러
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // 현재 페이지에 표시할 포스트 계산
    const currentPosts = filteredPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">이미지 원본 페이지</h1>
            </header>

            {/* 검색바 입력창 */}
            <div className="mb-4 flex items-center">
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="mr-1 p-2 rounded-md bg-[#f39704] text-white"
                >
                    <option value="total">전체</option>
                    <option value="title">제목</option>
                    <option value="regDate">등록일</option>
                </select>
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            {/* 토글 버튼 */}
            <div className="flex justify-start space-x-2 mb-4">
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`relative inline-flex items-center h-8 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        isOriginal ? 'bg-[#f39704]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={isOriginal}
                >
                    <span className="sr-only">{isOriginal ? '원본' : '인코딩'}</span>
                    <span
                        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                            isOriginal ? 'translate-x-10' : 'translate-x-0'
                        }`}
                        aria-hidden="true"
                    />
                    <span
                        className={`absolute left-2 right-2 text-sm font-medium text-black transition-transform duration-200 ease-in-out ${
                            isOriginal ? 'text-left' : 'text-right'
                        }`}
                    >
                        {isOriginal ? '원본' : '인코딩'}
                    </span>
                </button>
            </div>

            <div className="flex justify-end space-x-2 mb-4">
                <Link to="" className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                    이미지 등록
                </Link>
            </div>
            
            {/* 이미지 리스트 */}
            <div className="">
                {currentPosts.map((post, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-6 shadow-sm bg-[#ffe69c] mb-4">
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-gray-700">등록일: {post.regDate}</p>
                        <img src={post.url} alt={post.title} className="w-full h-auto mt-4" />
                        <button className="mr-2 mt-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                            인코딩
                        </button>
                        <button className="mt-2 rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                            삭제
                        </button>
                    </div>
                ))}
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

export default ImageResourceBoard;
