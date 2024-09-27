// ApiPagination.js
import React from "react";
import ReactPaginate from "react-paginate";

const ApiPagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={"이전"}
      nextLabel={"다음"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
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
  );
};

export default ApiPagination;
