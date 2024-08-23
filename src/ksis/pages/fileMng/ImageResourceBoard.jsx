import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { IMAGE_RESOURCE_BOARD, IMAGE_FILE_BOARD } from '../../../constants/page_constant';
import { format, parseISO } from 'date-fns';
import FileBoardModal from "./FileBoardModal";


// ImageResourceBoard라는 이름의 React 함수형 컴포넌트를 정의합니다.
const ImageResourceBoard = () => {
   
    // 검색어를 관리하는 상태값입니다. 초기값은 빈 문자열입니다.
    const [searchTerm, setSearchTerm] = useState('');
    
    // 검색 카테고리를 관리하는 상태값입니다. 초기값은 'total'로 설정되어 있습니다.
    const [searchCategory, setSearchCategory] = useState('total');
    
 // 현재 원본 이미지를 볼지 인코딩된 이미지를 볼지 결정하는 상태값입니다. 초기값은 원본(true)입니다.
    const [isOriginal, setIsOriginal] = useState(true);
   
 // 현재 페이지 번호를 관리하는 상태값입니다. 초기값은 0입니다.
    const [currentPage, setCurrentPage] = useState(0);
   
  // 한 페이지에 표시할 이미지 수를 10으로 설정합니다.
    const postsPerPage = 10;
  
 // 이미지 목록을 관리하는 상태값입니다. 초기값은 빈 배열입니다.
    const [images, setImages] = useState([]);
   
 // 검색 조건에 맞는 이미지들을 관리하는 상태값입니다. 초기값은 빈 배열입니다.
    const [filteredPosts, setFilteredPosts] = useState([]);
   
// 제목을 편집 중인 이미지의 인덱스를 관리하는 상태값입니다. 초기값은 null입니다.
    const [editingTitleIndex, setEditingTitleIndex] = useState(null);
    
// 편집 중인 제목의 새로운 값을 관리하는 상태값입니다. 초기값은 빈 문자열입니다.
    const [newTitle, setNewTitle] = useState('');
    
  // 페이지 이동을 위한 navigate 함수를 선언합니다.
    const navigate = useNavigate();

 // isOriginal 값이 변경될 때마다 해당 값에 따라 navigate를 사용해 다른 페이지로 이동합니다. isOriginal이 true면 원본 페이지로, false면 인코딩된 페이지로 이동합니다.
    useEffect(() => {
        navigate(isOriginal ? IMAGE_RESOURCE_BOARD : IMAGE_FILE_BOARD);
    }, [isOriginal, navigate]);
   

 // 컴포넌트가 처음 렌더링될 때, axios를 사용해 '/resourceList/images' 경로로 GET 요청을 보내 이미지를 불러옵니다. 요청이 성공하면 이미지를 상태값에 저장하고, 실패하면 오류를 콘솔에 출력합니다.
    useEffect(() => {
        axios.get('/resourceList/images')
            .then(response => {
                setImages(response.data);
                console.log("이미지 데이터 : ", response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);
   
    useEffect(() => {
          // 이미지 리스트를 filtered라는 변수에 복사합니다.
        let filtered = images;
 // 사용자가 검색어를 입력하면, 검색 카테고리에 따라 제목이나 등록일을 기준으로 이미지를 필터링합니다.

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
       
   // 필터링된 이미지를 상태값에 저장합니다. 이 효과는 images, searchTerm, searchCategory 중 하나라도 변경될 때마다 실행됩니다.
   setFilteredPosts(filtered);
    }, [images, searchTerm, searchCategory]);


   // isOriginal 상태값을 반전시키는 함수입니다. (즉, true이면 false로, false이면 true로 변경)
    const handleToggle = () => {
        setIsOriginal(prevIsOriginal => !prevIsOriginal);
    };

     // 페이지네이션의 페이지가 변경될 때 호출되는 함수로, 현재 페이지 번호를 변경합니다.
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

   // 사용자가 수정 버튼을 클릭했을 때 호출되는 함수입니다. 현재 편집 중인 이미지의 인덱스를 저장하고, 해당 이미지의 제목을 newTitle 상태에 저장합니다.
    const handleEditClick = (index, title) => {
        setEditingTitleIndex(index);
        setNewTitle(title);
    };

     // 사용자가 수정한 제목을 저장하는 함수입니다. axios를 사용해 서버에 PUT 요청을 보내 제목을 업데이트하고, 
     //요청이 성공하면 상태값을 갱신하여 화면에 반영합니다. 실패 시 오류 메시지를 출력합니다.
    
     const handleSaveClick = async (id) => {
        // 이미지 제목을 수정한 후, images 배열 내에서 수정된 제목을 가진 이미지 객체를 찾아 해당 제목을 업데이트합니다.
        try {
            const response = await axios.put(`/resourceList/${id}`, null, {
                params: { newTitle }
            });
            images.forEach((img) => {
                if(img.originalResourceId === id) {
                    img.fileTitle = newTitle
                }
            })
            
            const updatedImages = images.map(image =>
                image.id === id ? { ...image, title: response.data.title } : image
            );
            setImages(updatedImages);
            setEditingTitleIndex(null);
            setNewTitle('');
            navigate(IMAGE_RESOURCE_BOARD);
        } catch (error) {
            window.confirm('수정에 실패했습니다.');
            console.error('제목 수정 중 오류 발생:', error);
        }
    };
   
// 사용자가 이미지를 삭제하려고 할 때 호출되는 함수입니다. 먼저 삭제 확인을 하고, 확인이 되면 axios를 사용해 서버에 DELETE 요청을 보냅니다. 요청이 성공하면 상태값에서 해당 이미지를 제거합니다.
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
    
 // 날짜 문자열을 받아와 지정된 형식("yyyy-MM-dd")으로 변환하는 함수입니다. 형식이 잘못된 경우 'Invalid date'를 반환합니다.
 const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, "yyyy-MM-dd");
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }
    };
   
    // 현재 페이지에 표시할 이미지들을 잘라내어 currentPosts에 저장합니다.
const currentPosts = filteredPosts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

  //이미지/영상 불러오기
  const [resourceModalIsOpen, setResourceModalIsOpen] = useState(false);

  const openResourceModal = async(id) => setResourceModalIsOpen(true);
  const closeResourceModal = () => setResourceModalIsOpen(false);
    
    return (
        <div className="p-6">

             {/* 페이지 제목을 표시하는 헤더 부분입니다. */}
            <header className="mb-6">
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">이미지 원본 페이지</h1>
            </header>
          
            
            
            {/* 검색 카테고리 선택 드롭다운 메뉴입니다. 사용자가 선택한 카테고리가 searchCategory 상태값에 저장됩니다. */}
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


                {/* 검색어 입력 필드입니다. 입력된 검색어는 searchTerm 상태값에 저장됩니다. 검색 아이콘은 input 필드 왼쪽에 배치되어 있습니다. */}
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


             {/* 원본 이미지와 인코딩된 이미지를 전환하는 토글 버튼입니다. 
             클릭할 때마다 isOriginal 상태가 변경됩니다. */}  
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
            

            {/* 새로운 이미지를 업로드하는 링크 버튼입니다. */}
            <div className="flex justify-end space-x-2 mb-4">
                <Link to="" className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                    파일 등록
                </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        // 이미지가 존재하면, 이미지 리스트를 렌더링합니다. 각 이미지는 grid 형식으로 표시됩니다.
                        
                        <div key={index} className="grid sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                            
                            <div className="items-center text-center rounded-lg w-75 h-75 p-3  bg-[#ffe69c] ">
                                <div className="flex items-center">
                                    {editingTitleIndex === index ? (
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="text-xl font-bold mb-2 border-b border-gray-400"
                                        />
                                    ) : (
                                        <h2 className=" text-xl font-bold mb-2">{post.fileTitle}</h2>
                                    )}
                                    <FaEdit
                                        onClick={() => editingTitleIndex === index ? handleSaveClick(post.originalResourceId) : 
                                            handleEditClick(index, post.fileTitle)}
                                        className="ml-2 cursor-pointer text-gray-600"
                                    />
                                </div>
                                <p className="text-gray-700  overflow-hidden">등록일: {formatDate(post.regTime)}</p>
                                {/* 이미지 파일 */}
                                <div className="h-40 w-52 overflow-hidden margin-0">
                                <img 
                                src={post.filePath} alt={post.fileTitle} 
                               
                                className="w-full h-auto mt-4"></img>
                                 
                                
                                </div>
                                

                                <div className="row">
                                <button 
                                 onClick={()=>openResourceModal(post.originalResourceId)}
                                className="items-center mr-2 mt-2 relative inline-flex  rounded-md bg-[#6dd7e5]
                                 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400 focus-visible:outline 
                                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                                    인코딩
                                   
                                </button>
                                 <FileBoardModal
                                    isOpen={resourceModalIsOpen}
                                    onRequestClose={closeResourceModal}
                                    originalResourceId={post.originalResourceId}
                                />
                               
                                <button
                                    type="button"
                                    onClick={() => handleDelete(post.originalResourceId)}
                                    className="rounded-md bg-[#f48f8f] px-3 py-2 text-sm font-semibold text-black shadow-sm
                                     hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                                      focus-visible:outline-red-600"
                                >
                                    삭제
                                </button>
                                </div>
                            </div>
                        </div>
                    
                    ))
                ) : (
                    //이미지가 없는 경우 "파일이 없습니다."라는 메시지를 표시합니다.
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
// ImageResourceBoard 컴포넌트를 내보냅니다. 이 컴포넌트는 이미지 목록을 표시하고, 검색, 편집, 삭제 기능을 제공합니다.
