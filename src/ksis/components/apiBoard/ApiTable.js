// ApiTable.js
import React from "react";
import SelectAllCheckbox from "./SelectAllCheckbox";
import RowCheckbox from "./RowCheckbox";
import TableCell from "./TableCell";

const ApiTable = ({
  paginatedPosts,
  selectedPosts,
  handleCheckboxChange,
  handleSelectAllChange,
  isAllSelected,
  handleApiNameClick,
  formatDate,
}) => {
  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">
            <SelectAllCheckbox
              isAllSelected={isAllSelected}
              handleSelectAllChange={handleSelectAllChange}
            />
          </th>
          <th className="border border-gray-300 p-2">API 이름</th>
          <th className="border border-gray-300 p-2">만료일</th>
          <th className="border border-gray-300 p-2">제공업체</th>
        </tr>
      </thead>
      <tbody>
        {paginatedPosts.map((post) => (
          <tr key={post.apiId}>
            <td className="border border-gray-300 p-2 text-center">
              <RowCheckbox
                postId={post.apiId}
                isSelected={selectedPosts.has(post.apiId)}
                handleCheckboxChange={handleCheckboxChange}
              />
            </td>
            <TableCell
              content={post.apiName}
              onClick={() => handleApiNameClick(post.apiId)}
            />
            <TableCell content={formatDate(post.expiryDate)} />
            <TableCell content={post.provider} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApiTable;
