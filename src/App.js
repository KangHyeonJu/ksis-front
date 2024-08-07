import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import ApiBoard from "./components/page/ApiBoard";
import FileSizeBoard from "./components/page/FileSizeBoard"; // 예시로 FileSizeBoard를 추가했습니다.

const App = () => {
  return (
    <Router>
      <div className="dashboard flex">
        <Sidebar />
        <div className="content flex-1 p-4">
          <Routes>
            <Route path="/apiBoard" element={<ApiBoard />} />
            <Route path="/fileSizeBoard" element={<FileSizeBoard />} />
            {/* 다른 라우트들을 추가할 수 있습니다 */}
            <Route path="/" element={<div>홈 페이지</div>} />{" "}
            {/* 기본 홈 페이지 라우트 추가 예시 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
