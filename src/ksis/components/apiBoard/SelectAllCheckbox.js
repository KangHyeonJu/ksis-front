// SelectAllCheckbox.js
import React from "react";

const SelectAllCheckbox = ({ isAllSelected, handleSelectAllChange }) => {
  return (
    <input
      type="checkbox"
      checked={isAllSelected}
      onChange={handleSelectAllChange}
    />
  );
};

export default SelectAllCheckbox;
