import { BrowserRouter, Routes, Route } from "react-router-dom";
import PcList from "./ksis/pages/pc/PcList";
import "./index.css";
import Sidebar from "./ksis/components/SideBar";
import { PC_FORM, PC_INVENTORY } from "./constants/page_constant";
import PcForm from "./ksis/pages/pc/PcForm";
import ApiBoard from "./ksis/pages/api/ApiBoard";
import ApiForm from "./ksis/pages/api/ApiForm"; // 수정된 부분
import FileSizeBoard from "./ksis/pages/fileSize/FileSizeBoard"; // 추가

function App() {
  return (
    <>
      <div className="dashboard flex">
        <Sidebar />
        <div className="content flex-1 p-4">
          <Routes>
            <Route path={PC_INVENTORY} element={<PcList />} />
            <Route path={PC_FORM} element={<PcForm />} />
            <Route path="/apiboard" element={<ApiBoard />} />
            <Route path="/apiform" element={<ApiForm />} />
            <Route path="/filesizeboard" element={<FileSizeBoard />} />
            {/* 다른 라우트들을 추가할 수 있습니다 */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
