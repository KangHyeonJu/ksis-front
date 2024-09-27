// DeleteButton.js
import React from "react";
import "../../css/apiBoard/buttons.css";

const DeleteButton = ({ handleDelete }) => {
  return (
    <button onClick={handleDelete} className="deleteButton">
      {" "}
      {/* deleteButton 클래스로 수정 */}
      삭제
    </button>
  );
};

export default DeleteButton;
