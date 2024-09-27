// RowCheckbox.js
import React from "react";

const RowCheckbox = ({ postId, isSelected, handleCheckboxChange }) => {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={(e) => handleCheckboxChange(postId, e)}
    />
  );
};

export default RowCheckbox;
