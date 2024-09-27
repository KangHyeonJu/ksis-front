// ApiSearchBar.js
import React from "react";
import { FaSearch } from "react-icons/fa";

const ApiSearchBar = ({
  searchTerm,
  setSearchTerm,
  searchCategory,
  setSearchCategory,
}) => {
  return (
    <div className="mb-6 flex items-center">
      {/* 검색 카테고리 셀렉트 박스 */}
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
  );
};

export default ApiSearchBar;
