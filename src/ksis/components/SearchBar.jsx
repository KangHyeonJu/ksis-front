import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  onSearch, // 검색 이벤트 핸들러
  searchOptions = [], // 검색 옵션 배열
  defaultCategory = "", // 기본 선택된 검색 카테고리
  selectOptions = {}, // 특정 카테고리에 사용할 select 옵션
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState(defaultCategory);

  const handleSearch = () => {
    // 검색 버튼 클릭 시 상위 컴포넌트에 검색어와 카테고리 전달
    onSearch(searchTerm, searchCategory);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSearchCategory(newCategory);
    setSearchTerm("");

    if (selectOptions[newCategory]) {
      onSearch("", newCategory);
    }
  };

  const handleSelectChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value, searchCategory);
  };

  return selectOptions[searchCategory] ? (
    // select 박스와 자동 검색
    <div className="flex items-center relative flex-grow border-gray-300 my-10">
      <select
        value={searchCategory}
        onChange={handleCategoryChange}
        className="p-2 bg-white text-[#444444] font-bold border border-gray-300"
      >
        {searchOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="relative flex-grow">
        <select
          value={searchTerm}
          onChange={handleSelectChange} // 선택 시 자동으로 검색 실행
          className="ml-2 p-2 border border-gray-300 rounded-md flex-grow"
        >
          {selectOptions[searchCategory].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : (
    <div className="flex items-center relative flex-grow border-y border-gray-300 my-10">
      <select
        value={searchCategory}
        onChange={handleCategoryChange}
        className="p-2 bg-white text-[#444444] font-bold border-x border-gray-300"
      >
        {searchOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-full p-2 pr-10"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-[#FF9C00] border-x border-[#FF9C00] text-white h-10 w-10 inline-flex items-center text-center"
      >
        <FaSearch className=" w-full" />
      </button>
    </div>
  );
};

export default SearchBar;
