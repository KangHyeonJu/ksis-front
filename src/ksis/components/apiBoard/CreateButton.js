// CreateButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_FORM } from "../../../constants/page_constant";
import "../../css/apiBoard/buttons.css";

const CreateButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(API_FORM)} className="createButton">
      {" "}
      {/* createButton 클래스로 수정 */}
      API 등록
    </button>
  );
};

export default CreateButton;
