import React, {useEffect, useMemo, useState} from "react";
import fetcher from "../../../fetcher";
import {ACCOUNT_FORM, ACCOUNT_LIST} from "../../../constants/account_constant";
import {FaSearch} from "react-icons/fa";
import {Link} from "react-router-dom";
import ReactPaginate from "react-paginate";

const AccountList = () => {
    const [posts, setPosts] = useState([]);

    const loadPage = async () => {
        try {
            const response = await fetcher.get(ACCOUNT_LIST);
            console.log(response); // 응답 객체 확인을 위해 콘솔 출력
            if (response.data) {
                setPosts(response.data);
            } else {
                console.error("No data property in response");
            }
        } catch (error) {
            console.error("Error fetching data:", error); // 전체 오류 객체를 콘솔에 출력
            alert(error.response?.data || "Unknown error occurred");
        }
    };

    useEffect(() => {
        loadPage();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("accountId"); // 검색 필터 상태
    const [currentPage, setCurrentPage] = useState(0);

    const postsPerPage = 5;

    const filteredPosts = useMemo(
        () =>
            posts.filter((post) => {
                const value = post[searchCategory]?.toLowerCase() || "";
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


    const handleToggleActive = async (accountId, isActive) => {
        console.log(JSON.stringify({
            isActive: isActive
        }))
        try {
            const response = await fetcher.put(
                `${ACCOUNT_FORM}/${accountId}/active`,
                JSON.stringify({
                    isActive: isActive,
                }),
                {headers: {
                    "Content-Type": "application/json"
                }}
            );
            console.log("Sending data:", { isActive: isActive });
            console.log("Data type of isActive:", typeof isActive);

            if (response.status === 200) {
                console.log("Account status updated successfully");
                // 로컬 상태 업데이트
                alert("비활성화 여부가 변경되었습니다.")
                await loadPage();
            } else {
                console.error("Failed to update account status:", response.statusText);
                console.log("Sending data:", JSON.stringify({ isActive: isActive }));
            }
        } catch (error) {
            console.error("Error:", error);
            console.log("Sending data:", JSON.stringify({ isActive: isActive }));
        }
    };



    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 my-4">
                계정목록
            </h1>

            <div className="mb-4 flex items-center">
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="mr-1 p-2 border border-gray-300 rounded-md"
                >
                    <option value="accountId">계정 아이디</option>
                    <option value="name">이름</option>
                    <option value="businessTel">업무 연락처</option>
                    <option value="isActive">비활성화 여부</option>
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

            <div className="flex justify-end space-x-2 mb-4">
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-[#ffcf8f] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                    <Link to={ACCOUNT_FORM}>계정 등록</Link>
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-300 border-collapse border border-gray-300 mb-4">
                <thead>
                <tr>
                    <th className="border border-gray-300">계정 아이디</th>
                    <th className="border border-gray-300">이름</th>
                    <th className="border border-gray-300">업무 전화번호</th>
                    <th className="border border-gray-300">비활성화 여부</th>
                    <th className="border border-gray-300">수정/비활성화</th>
                </tr>
                </thead>
                <tbody>
                {paginatedPosts.map((post) => (
                    <tr key={post.accountId} >
                        <td className="border border-gray-300 p-2">{post.accountId}</td>
                        <td className="border border-gray-300 p-2">{post.name}</td>
                        <td className="border border-gray-300 p-2">{post.businessTel}</td>
                        <td className="border border-gray-300 p-2">{post.isActive ? "T" : "F" }</td>
                        <td className="border border-gray-300 p-2 flex justify-center">
                            <Link
                                to={`/account/${post.accountId}`}
                                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                수정
                            </Link>
                            <button
                                className={`mr-2 ${
                                    post.isActive
                                        ? "bg-green-500 hover:bg-green-700" 
                                        : "bg-red-500 hover:bg-red-700" 
                                } text-white font-bold py-1 px-2 rounded`}
                                onClick={() => handleToggleActive(post.accountId, post.isActive)}
                            >
                                {post.isActive ? "활성화" : "비활성화"}
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
                    pageLinkClassName={
                        "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                    }
                    previousClassName={"mx-1"}
                    previousLinkClassName={
                        "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                    }
                    nextClassName={"mx-1"}
                    nextLinkClassName={
                        "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                    }
                    breakClassName={"mx-1"}
                    breakLinkClassName={
                        "px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                    }
                    activeClassName={"bg-blue-500 text-white"}
                />
            )}
        </div>
    );
};

export default AccountList;