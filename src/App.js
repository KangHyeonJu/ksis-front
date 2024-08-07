import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import ApiBoard from "./components/page/ApiBoard";
import ApiDetail from "./components/page/ApiDetail"; // 수정된 부분
import FileSizeBoard from "./components/page/FileSizeBoard"; // 추가

const App = () => {
  return (
    <Router>
      <div className="dashboard flex">
        <Sidebar />
        <div className="content flex-1 p-4">
          <Routes>
            <Route path="/apiBoard" element={<ApiBoard />} />
            <Route path="/apiDetail" element={<ApiDetail />} />{" "}
            {/* 수정된 부분 */}
            <Route path="/fileSizeBoard" element={<FileSizeBoard />} />
            {/* 다른 라우트들을 추가할 수 있습니다 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
