// TableCell.js
import React from "react";

const TableCell = ({ content, onClick }) => {
  return (
    <td
      className="border border-gray-300 p-2 text-black cursor-pointer"
      onClick={onClick}
    >
      {content}
    </td>
  );
};

export default TableCell;
