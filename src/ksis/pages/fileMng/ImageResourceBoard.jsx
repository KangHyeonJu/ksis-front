import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { IMAGE_RESOURCE_BOARD, IMAGE_FILE_BOARD } from '../../../constants/page_constant';
import { format, parseISO } from 'date-fns';

const ImageResourceBoard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('total');
    const [isOriginal, setIsOriginal] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 10;
    const [images, setImages] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [editingTitleIndex, setEditingTitleIndex] = useState(null);
    const [newTitle, setNewTitle] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        navigate(isOriginal ? IMAGE_RESOURCE_BOARD : IMAGE_FILE_BOARD);
    }, [isOriginal, navigate]);

    useEffect(() => {
        axios.get('/resourceList/images')
            .then(response => {
                setImages(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);
    
    useEffect(() => {
        axios.get('/resourceList/images')
            .then(response => {
                setImages(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

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

    const handleToggle = () => {
        setIsOriginal(prevIsOriginal => !prevIsOriginal);
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleEditClick = (index, title) => {
        setEditingTitleIndex(index);
        setNewTitle(title);
    };

    const handleSaveClick = async (id) => {
        try {
            const response = await axios.put(`/resourceList/${id}`, null, {
                params: { newTitle }
            });
            const updatedImages = images.map(image =>
                image.id === id ? { ...image, title: response.data.title } : image
            );
            setImages(updatedImages);
            setEditingTitleIndex(null);
            setNewTitle('');
            navigate(IMAGE_FILE_BOARD);
        } catch (error) {
            window.confirm('수정에 실패했습니다.');
            console.error('제목 수정 중 오류 발생:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/resourceList/${id}`);
                setImages(images.filter(image => image.id !== id));
            } catch (err) {
                console.error('이미지 삭제 오류:', err);
                window.alert('이미지 삭제에 실패했습니다.');
            }
        }
    };

        // 유효한 날짜 포맷으로 변환
        const formatDate = (dateString) => {
            try {
                const date = parseISO(dateString);
                return format(date, "yyyy-MM-dd");
            } catch (error) {
                console.error('Invalid date format:', dateString);
                return 'Invalid date';
            }
        };
    

    const currentPosts = filteredPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">이미지 원본 페이지</h1>
            </header>

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
                    파일 등록
                </Link>
            </div>

            {/* 이미지 리스트 */}
            <div className="flex flex-wrap gap-4">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                            <div className="rounded-lg p-6 shadow-sm bg-[#ffe69c] mb-4">
                                <div className="flex items-center">
                                    {editingTitleIndex === index ? (
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="text-xl font-bold mb-2 border-b border-gray-400 w-full"
                                        />
                                    ) : (
                                        <h2 className="text-xl font-bold mb-2">{post.fileTitle}</h2>
                                    )}
                                    <FaEdit
                                        onClick={() => editingTitleIndex === index ? handleSaveClick(post.originalResourceId) : handleEditClick(index, post.fileTitle)}
                                        className="ml-2 cursor-pointer text-gray-600"
                                    />
                                </div>
                                <p className="text-gray-700">등록일: {formatDate(post.regTime)}</p>
                                <img src={post.filePath} alt={post.fileTitle} className="w-full h-auto mt-4" />
                                <button className="mr-2 mt-2 relative inline-flex items-center rounded-md bg-[#6dd7e5] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                                    인코딩
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(post.originalResourceId)}
                                    className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-600 mt-10 w-full">
                        파일이 없습니다.
                    </div>
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

export default ImageResourceBoard;
