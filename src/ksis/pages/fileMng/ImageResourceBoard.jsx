import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios'; // HTTP 요청을 위한 axios
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

    useEffect(() => {
        if (isOriginal) {
            navigate(IMAGE_RESOURCE_BOARD);
        }
    }, [isOriginal, navigate]);

    useEffect(() => {
        axios.get('/resourceList/images')
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    useEffect(() => {
        // 필터링 로직을 여기에서 구현
        setFilteredPosts(images);
    }, [images, searchTerm, searchCategory]);

    const handleToggle = () => {
        const newIsOriginal = !isOriginal;
        setIsOriginal(newIsOriginal);
        if (newIsOriginal) {
            navigate(IMAGE_RESOURCE_BOARD);
        } else {
            navigate(IMAGE_FILE_BOARD);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

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
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                    <Link to="">이미지 등록</Link>
                </button>
            </div>

            {/* 이미지 표시 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {filteredPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage).map((image, index) => (
                    <div key={index} className="relative">
                        <img src={image.src} alt={image.title} className="w-full h-auto object-cover rounded-md" />
                        <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
                            <p className="text-lg font-semibold">{image.title}</p>
                            <p>{image.date}</p>
                        </div>
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
